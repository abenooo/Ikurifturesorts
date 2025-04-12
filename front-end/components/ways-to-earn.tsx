"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Hotel, Utensils, Users, Calendar, Star, CheckCircle2, Sparkles, Loader2 } from "lucide-react"

interface WaysToEarnProps {
  onEarnPoints: (amount: number, description: string) => void
}

export default function WaysToEarn({ onEarnPoints }: WaysToEarnProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Ways to Earn Points
        </CardTitle>
        <CardDescription>Complete these activities to earn more points and unlock premium rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="quick">Quick Earn</TabsTrigger>
            <TabsTrigger value="stays">During Stays</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>

          <TabsContent value="quick">
            <div className="space-y-4">
              <QuickEarnCard
                title="Complete Your Profile"
                description="Add your preferences, contact details, and profile picture"
                icon={<CheckCircle2 className="h-5 w-5" />}
                points={500}
                onEarn={onEarnPoints}
              />

              <QuickEarnCard
                title="Take Our Survey"
                description="Share your travel preferences and help us improve"
                icon={<Star className="h-5 w-5" />}
                points={300}
                onEarn={onEarnPoints}
              />

              <QuickEarnCard
                title="Download Our App"
                description="Get the Kuriftu mobile app for exclusive offers"
                icon={<Sparkles className="h-5 w-5" />}
                points={400}
                onEarn={onEarnPoints}
              />
            </div>
          </TabsContent>

          <TabsContent value="stays">
            <div className="space-y-4">
              <EarnInfoCard
                title="Book Direct"
                description="Earn 10 points per $1 spent when booking directly through our website"
                icon={<Hotel className="h-5 w-5" />}
                points="10 pts per $1"
              />

              <EarnInfoCard
                title="Dining at Our Restaurants"
                description="Earn 5 points per $1 spent at any Kuriftu restaurant"
                icon={<Utensils className="h-5 w-5" />}
                points="5 pts per $1"
              />

              <EarnInfoCard
                title="Extended Stays"
                description="Earn 1,000 bonus points for stays of 3+ nights"
                icon={<Calendar className="h-5 w-5" />}
                points="1,000 bonus pts"
              />
            </div>
          </TabsContent>

          <TabsContent value="social">
            <div className="space-y-4">
              <QuickEarnCard
                title="Refer a Friend"
                description="Invite friends to join Kuriftu Rewards"
                icon={<Users className="h-5 w-5" />}
                points={1000}
                onEarn={onEarnPoints}
              />

              <EarnInfoCard
                title="Social Media Check-in"
                description="Tag us in your posts on Instagram or Facebook during your stay"
                icon={<CheckCircle2 className="h-5 w-5" />}
                points="200 pts per post"
              />

              <EarnInfoCard
                title="Write a Review"
                description="Share your experience on TripAdvisor or Google"
                icon={<Star className="h-5 w-5" />}
                points="300 pts per review"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <p className="text-sm text-gray-500">
          Points are typically credited to your account within 24-48 hours of completing an activity.
        </p>
      </CardFooter>
    </Card>
  )
}

function QuickEarnCard({
  title,
  description,
  icon,
  points,
  onEarn,
}: {
  title: string
  description: string
  icon: React.ReactNode
  points: number
  onEarn: (amount: number, description: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleEarn = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setIsCompleted(true)
      onEarn(points, title)
    }, 1500)
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 p-2 rounded-full text-amber-600">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <span className="block text-amber-600 font-bold">+{points} pts</span>
        </div>

        {isCompleted ? (
          <Button disabled className="bg-emerald-600">
            <CheckCircle2 className="h-4 w-4 mr-1" /> Completed
          </Button>
        ) : (
          <Button onClick={handleEarn} disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Processing
              </>
            ) : (
              "Complete"
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

function EarnInfoCard({
  title,
  description,
  icon,
  points,
}: {
  title: string
  description: string
  icon: React.ReactNode
  points: string
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 p-2 rounded-full text-amber-600">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      <div className="text-right">
        <span className="block text-amber-600 font-bold">{points}</span>
      </div>
    </div>
  )
}
