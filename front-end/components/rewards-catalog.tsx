"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, Filter, Gift, AlertCircle } from "lucide-react"
import RedemptionModal from "@/components/redemption-modal"

interface RewardsCatalogProps {
  userPoints: number
  onRedeemReward: (reward: Reward, onSuccess: () => void) => void
}

export interface Reward {
  id: string
  title: string
  description: string
  category: "spa" | "dining" | "activities" | "stays"
  points: number
  image: string
}

const rewards: Reward[] = [
  {
    id: "spa-1",
    title: "Relaxing Massage Treatment",
    description: "60-minute massage with essential oils and lake view",
    category: "spa",
    points: 3500,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "spa-2",
    title: "Couples Spa Package",
    description: "Full spa day for two with treatments and private relaxation area",
    category: "spa",
    points: 6000,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "spa-3",
    title: "Traditional Ethiopian Spa Ritual",
    description: "Experience ancient wellness practices with local ingredients",
    category: "spa",
    points: 4200,
    image:
      "https://images.unsplash.com/photo-1620733723572-11c53f73a416?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
  },
  {
    id: "dining-1",
    title: "Romantic Lakeside Dinner",
    description: "Private dinner for two with a curated menu by our executive chef",
    category: "dining",
    points: 3800,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "dining-2",
    title: "Ethiopian Coffee Ceremony",
    description: "Traditional coffee experience with local pastries",
    category: "dining",
    points: 3000,
    image:
      "https://images.unsplash.com/photo-1462919407465-b3dc132d800c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1207&q=80",
  },
  {
    id: "dining-3",
    title: "Chef's Table Experience",
    description: "Interactive dining experience with our chef preparing a multi-course meal right before your eyes",
    category: "dining",
    points: 4500,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "activities-1",
    title: "Sunset Kayaking",
    description: "Guided kayak tour on Lake Koriftu during sunset",
    category: "activities",
    points: 3200,
    image:
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
  },
  {
    id: "activities-2",
    title: "Guided Birding Tour",
    description: "Explore the rich birdlife around Bishoftu with an expert guide",
    category: "activities",
    points: 3100,
    image:
      "https://images.unsplash.com/photo-1621494547928-9f90998fa061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "activities-3",
    title: "Cultural Village Tour",
    description: "Visit local villages and learn about Ethiopian traditions",
    category: "activities",
    points: 3300,
    image:
      "https://images.unsplash.com/photo-1504150558091-0b082d115f97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
  },
  {
    id: "stays-1",
    title: "Free Night Stay",
    description: "One complimentary night in a standard room",
    category: "stays",
    points: 8000,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "stays-2",
    title: "Room Upgrade",
    description: "Upgrade to a premium lake view room during your stay",
    category: "stays",
    points: 5000,
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: "stays-3",
    title: "Late Checkout",
    description: "Extend your stay with a 4pm checkout time",
    category: "stays",
    points: 3000,
    image:
      "https://images.unsplash.com/photo-1551516594-56cb78394645?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1216&q=80",
  },
]

export default function RewardsCatalog({ userPoints, onRedeemReward }: RewardsCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false)

  const filteredRewards = rewards.filter(
    (reward) =>
      reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward)
    setIsRedemptionModalOpen(true)
  }

  const handleRedemptionConfirm = () => {
    if (selectedReward) {
      onRedeemReward(selectedReward, () => {
        setIsRedemptionModalOpen(false)
        setSelectedReward(null)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full md:w-80 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
            <Gift className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium">
              Your Points: <span className="text-amber-600">{userPoints.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Minimum Redemption: 3,000 Points</h3>
            <p className="text-sm text-amber-700">
              All rewards require a minimum of 3,000 points to redeem. See our "Ways to Earn" section to quickly
              accumulate points!
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Rewards</TabsTrigger>
          <TabsTrigger value="spa">Spa</TabsTrigger>
          <TabsTrigger value="dining">Dining</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="stays">Stays</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                canRedeem={userPoints >= reward.points}
                onRedeem={() => handleRedeemClick(reward)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="spa" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards
              .filter((reward) => reward.category === "spa")
              .map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canRedeem={userPoints >= reward.points}
                  onRedeem={() => handleRedeemClick(reward)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="dining" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards
              .filter((reward) => reward.category === "dining")
              .map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canRedeem={userPoints >= reward.points}
                  onRedeem={() => handleRedeemClick(reward)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards
              .filter((reward) => reward.category === "activities")
              .map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canRedeem={userPoints >= reward.points}
                  onRedeem={() => handleRedeemClick(reward)}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="stays" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRewards
              .filter((reward) => reward.category === "stays")
              .map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canRedeem={userPoints >= reward.points}
                  onRedeem={() => handleRedeemClick(reward)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedReward && (
        <RedemptionModal
          isOpen={isRedemptionModalOpen}
          onClose={() => setIsRedemptionModalOpen(false)}
          reward={selectedReward}
          userPoints={userPoints}
          onConfirm={handleRedemptionConfirm}
        />
      )}
    </div>
  )
}

function RewardCard({
  reward,
  canRedeem,
  onRedeem,
}: {
  reward: Reward
  canRedeem: boolean
  onRedeem: () => void
}) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image src={reward.image || "/placeholder.svg"} alt={reward.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge
            className={
              reward.category === "spa"
                ? "bg-pink-600"
                : reward.category === "dining"
                  ? "bg-amber-600"
                  : reward.category === "activities"
                    ? "bg-emerald-600"
                    : "bg-blue-600"
            }
          >
            {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-1">{reward.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-medium text-amber-600">{reward.points.toLocaleString()} points</span>
          <Button
            size="sm"
            disabled={!canRedeem}
            onClick={onRedeem}
            className={canRedeem ? "bg-amber-600 hover:bg-amber-700" : "bg-gray-300"}
          >
            {canRedeem ? "Redeem" : "Not Enough Points"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
