"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Award, Calendar, ChevronRight, Leaf, Sparkles, ArrowUpRight, ArrowDownRight } from "lucide-react"
import RewardsCatalog, { type Reward } from "@/components/rewards-catalog"

interface PointActivity {
  id: string
  type: "earned" | "redeemed"
  amount: number
  description: string
  date: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState<PointActivity[]>([])

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("kuriftuUser")

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)

      // Initialize activities
      const initialActivities: PointActivity[] = [
        {
          id: "welcome",
          type: "earned",
          amount: 500,
          description: "Welcome Bonus",
          date: parsedUser.joinDate,
        },
      ]
      setActivities(initialActivities)
    } else {
      // Redirect to home if not logged in
      router.push("/")
    }

    setIsLoading(false)
  }, [router])

  const handleEarnPoints = (amount: number, description: string) => {
    if (!userData) return

    // Update user points
    const updatedUserData = {
      ...userData,
      points: userData.points + amount,
    }

    // Add activity
    const newActivity: PointActivity = {
      id: Date.now().toString(),
      type: "earned",
      amount,
      description,
      date: new Date().toLocaleDateString(),
    }

    // Update state and localStorage
    setUserData(updatedUserData)
    setActivities([newActivity, ...activities])
    localStorage.setItem("kuriftuUser", JSON.stringify(updatedUserData))
  }

  const handleRedeemReward = (reward: Reward, onSuccess: () => void) => {
    if (!userData || userData.points < reward.points) return

    // Update user points
    const updatedUserData = {
      ...userData,
      points: userData.points - reward.points,
    }

    // Add activity
    const newActivity: PointActivity = {
      id: Date.now().toString(),
      type: "redeemed",
      amount: reward.points,
      description: reward.title,
      date: new Date().toLocaleDateString(),
    }

    // Update state and localStorage
    setUserData(updatedUserData)
    setActivities([newActivity, ...activities])
    localStorage.setItem("kuriftuUser", JSON.stringify(updatedUserData))

    // Call success callback
    onSuccess()
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("kuriftuUser")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">Please log in again to access your dashboard.</p>
          <Button onClick={() => router.push("/")} className="bg-amber-600 hover:bg-amber-700">
            Return to Home
          </Button>
        </div>
      </div>
    )
  }

  // Calculate progress to next tier
  const currentTier = userData.tier
  const currentPoints = userData.points
  let nextTier = ""
  let pointsToNextTier = 0
  let progress = 0

  switch (currentTier) {
    case "Bronze":
      nextTier = "Silver"
      pointsToNextTier = 1000 - currentPoints
      progress = (currentPoints / 1000) * 100
      break
    case "Silver":
      nextTier = "Gold"
      pointsToNextTier = 2500 - currentPoints
      progress = ((currentPoints - 1000) / 1500) * 100
      break
    case "Gold":
      nextTier = "Platinum"
      pointsToNextTier = 5000 - currentPoints
      progress = ((currentPoints - 2500) / 2500) * 100
      break
    case "Platinum":
      nextTier = "Diamond" // Imaginary next tier
      pointsToNextTier = 10000 - currentPoints
      progress = ((currentPoints - 5000) / 5000) * 100
      break
    default:
      nextTier = "Silver"
      pointsToNextTier = 1000 - currentPoints
      progress = (currentPoints / 1000) * 100
  }

  // Get recommended experience from user data
  const recommendedExperience = userData.recommendedExperience

  return (
    <main className="min-h-screen bg-stone-50 pt-20">
      <div className="container px-4 md:px-6 py-8">
        {/* User Overview */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {userData.name}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600">{userData.tier} Member</Badge>
                <span className="text-gray-500 text-sm">Member since {userData.joinDate}</span>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="mt-4 md:mt-0">
              Logout
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Available Points</p>
                    <p className="text-2xl font-bold text-amber-600">{userData?.points?.toLocaleString() || '0'}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Tier</p>
                    <p className="text-2xl font-bold">{userData.tier}</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4">
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Green Points</p>
                    <p className="text-2xl font-bold text-emerald-600">120</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Tier Progress */}
        {currentTier !== "Platinum" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Progress to {nextTier}</CardTitle>
              <CardDescription>
                Earn {pointsToNextTier?.toLocaleString() || '0'} more points to reach {nextTier} tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>{currentTier}</span>
                  <span>
                    {userData?.points?.toLocaleString() || '0'} /{" "}
                    {currentTier === "Bronze"
                      ? "1,000"
                      : currentTier === "Silver"
                        ? "2,500"
                        : currentTier === "Gold"
                          ? "5,000"
                          : "10,000"}{" "}
                    points
                  </span>
                  <span>{nextTier}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Tabs */}
        <Tabs defaultValue="rewards" className="mb-8">
          <TabsList className="grid grid-cols-2 md:w-[400px] mb-6">
            <TabsTrigger value="rewards">Rewards Catalog</TabsTrigger>
            <TabsTrigger value="activity">Point Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="rewards">
            <RewardsCatalog userPoints={userData.points} onRedeemReward={handleRedeemReward} />
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Point Activity</CardTitle>
                <CardDescription>Track your points earned and redeemed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="border-b pb-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <Badge className={activity.type === "earned" ? "bg-emerald-600" : "bg-amber-600"}>
                              {activity.type === "earned" ? "Earned" : "Redeemed"}
                            </Badge>
                            <span className="font-medium">{activity.description}</span>
                          </div>
                          <span
                            className={`font-medium ${activity.type === "earned" ? "text-emerald-600" : "text-amber-600"}`}
                          >
                            {activity.type === "earned" ? (
                              <span className="flex items-center">
                                <ArrowUpRight className="h-3 w-3 mr-1" />+{activity?.amount?.toLocaleString() || '0'} points
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <ArrowDownRight className="h-3 w-3 mr-1" />-{activity?.amount?.toLocaleString() || '0'} points
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{activity.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No activity yet. Start earning and redeeming points!
                    </div>
                  )}
                </div>
              </CardContent>
              {activities.length > 5 && (
                <CardFooter className="border-t">
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-1">
                    View All Activity <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Personalized Recommendations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Recommended for You
          </h2>

          {recommendedExperience ? (
            <div className="mb-6">
              <Card className="overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src={recommendedExperience.image || "/placeholder.svg"}
                    alt={recommendedExperience.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-600">Based on Your Preferences</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{recommendedExperience.title}</h3>
                  <p className="text-gray-600 mb-4">{recommendedExperience.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-amber-600">
                      {recommendedExperience?.points?.toLocaleString() || '0'} points
                    </span>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700"
                      disabled={userData.points < (recommendedExperience?.points || 0)}
                      onClick={() => {
                        if (userData.points >= (recommendedExperience?.points || 0)) {
                          handleRedeemReward(recommendedExperience as Reward, () => {})
                        }
                      }}
                    >
                      {userData.points >= (recommendedExperience?.points || 0) ? "Redeem Now" : "Not Enough Points"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Spa treatment"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">Lakeside Spa Retreat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Perfectly matches your preferences for relaxation and wellness.
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-600">3,500 points</span>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Chef's dinner"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">Chef's Table Experience</h3>
                <p className="text-sm text-gray-600 mb-4">A culinary journey featuring Ethiopian delicacies.</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-600">4,500 points</span>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1516939884455-1445c8652f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                  alt="Sunset kayaking"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">Sunset Kayak Tour</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Paddle across Lake Koriftu while enjoying a breathtaking sunset.
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-amber-600">3,200 points</span>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
