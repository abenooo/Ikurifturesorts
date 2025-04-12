"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Award, Calendar, ChevronRight, Leaf, Sparkles, ArrowUpRight, ArrowDownRight, Hotel, Ticket, Clock } from "lucide-react"
import RewardsCatalog, { type Reward } from "@/components/rewards-catalog"
import WaysToEarn from "@/components/ways-to-earn"
import { useUserStore } from "@/store/userStore"
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { toast } from "sonner"

interface PointActivity {
  id: string
  type: "earned" | "redeemed"
  amount: number
  description: string
  date: string
}

interface Booking {
  id: string
  service: string
  date: string
  time?: string
  image?: string
  status: "upcoming" | "completed" | "cancelled"
  pointsEarned: number
}

interface Redemption {
  id: string;
  reward: {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
  };
  pointsSpent: number;
  date: string;
  status: 'active' | 'used' | 'expired';
  expiryDate?: string;
}

interface Activity {
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
  const [activities, setActivities] = useState<Activity[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [greenPoints, setGreenPoints] = useState(0)
  const { user, token, setUser, clearUser } = useUserStore()
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)
  const [isLoadingRedemptions, setIsLoadingRedemptions] = useState(true)

  const fetchActivities = async () => {
    try {
      if (!token) return;
      
      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/users/activities",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      
      const data = await response.json();
      setActivities(data.activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const createActivity = async (type: 'earned' | 'redeemed', amount: number, description: string) => {
    if (!token) {
      console.error("No token available");
      return;
    }

    try {
      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/users/activities",
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type,
            amount,
            description
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create activity');
      }

      // Refresh activities after creating a new one
      fetchActivities();
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to record activity");
    }
  };

  const fetchBookings = async () => {
    try {
      if (!token) return;
      
      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const fetchRedemptions = async () => {
    try {
      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/rewards/my-rewards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch redemptions');
      }
      
      const data = await response.json();
      const transformedRedemptions = data.map((userReward: any) => ({
        id: userReward._id,
        reward: {
          id: userReward.reward._id,
          name: userReward.reward.title,
          description: userReward.reward.description,
          image: userReward.reward.image,
          category: userReward.reward.category
        },
        pointsSpent: userReward.pointsSpent,
        date: userReward.createdAt,
        status: userReward.status.toLowerCase(),
        expiryDate: userReward.expiryDate
      }));
      setRedemptions(transformedRedemptions);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
      toast.error("Failed to load redemptions");
    } finally {
      setIsLoadingRedemptions(false);
    }
  };

  const fetchGreenPoints = async () => {
    try {
      if (!token) {
        console.log("No token available");
        return;
      }
      
      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/green-points/my-points",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch green points');
      }
      
      const data = await response.json();
      console.log("Green points data:", data);
      setGreenPoints(data.totalPoints || 0);
    } catch (error: any) {
      console.error("Error fetching green points:", error);
      toast.error(error?.message || "Failed to load green points");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("kuriftuUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      
      // Only create welcome activity if we have a valid token
      if (token && !parsedUser.hasSeenWelcome) {
        createActivity('earned', 1000, 'Welcome Bonus').then(() => {
          const updatedUser = {
            ...parsedUser,
            hasSeenWelcome: true,
            loyaltyPoints: (parsedUser.loyaltyPoints || 0) + 1000
          };
          setUserData(updatedUser);
          localStorage.setItem("kuriftuUser", JSON.stringify(updatedUser));
        });
      }
    } else {
      router.push("/");
    }

    setIsLoading(false);
  }, [router, token]);

  useEffect(() => {
    if (token) {
      console.log("fetching activities",token);
      fetchActivities();
      fetchBookings();
      fetchRedemptions();
      fetchGreenPoints();
    }
  }, [token]);

  const handleEarnPoints = async (amount: number, description: string) => {
    if (!userData) return;

    try {
      // Update user points
      const updatedUserData = {
        ...userData,
        points: userData.points + amount,
      };

      // Create activity record
      await createActivity('earned', amount, description);

      // Update state and localStorage
      setUserData(updatedUserData);
      localStorage.setItem("kuriftuUser", JSON.stringify(updatedUserData));
    } catch (error) {
      console.error("Error earning points:", error);
      toast.error("Failed to earn points");
    }
  };

  const handleRedeemReward = async (reward: Reward, onSuccess: () => void) => {
    try {
      if (!user || !token) {
        toast.error("Please log in to redeem rewards");
        return;
      }

      if (user.loyaltyPoints < reward.points) {
        toast.error("Insufficient points");
        return;
      }

      const response = await fetch(
        "https://i-kuriftu.onrender.com/api/rewards/redeem",
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ 
            rewardId: reward.id,
            pointsCost: reward.points
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error redeeming reward');
      }

      const data = await response.json();
      
      // Update user points in the store
      setUser({
        ...user,
        loyaltyPoints: user.loyaltyPoints - reward.points,
      }, token);

      // Create activity for the redemption
      await createActivity('redeemed', reward.points, `Redeemed ${reward.title}`);

      // Refresh redemptions list after a short delay to ensure backend has processed the redemption
      setTimeout(() => {
        fetchRedemptions();
      }, 500);
      
      toast.success("Reward redeemed successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error redeeming reward:", error);
      toast.error(error.message || "Failed to redeem reward");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("kuriftuUser")
    setUserData(null)
    setUser(null, null)
    clearUser()
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
  const currentTier = user?.membershipTier || "Bronze"
  const currentPoints = user?.loyaltyPoints || 0
  let nextTier = ""
  let pointsToNextTier = 0
  let progress = 0

  // Format membership date
  const membershipDate = user?.membershipSince ? parseISO(user.membershipSince) : new Date()
  const formattedMembershipDate = format(membershipDate, 'MMMM d, yyyy')
  const membershipDuration = formatDistanceToNow(membershipDate, { addSuffix: true })

  console.log('currrrrrenntttt tier', currentTier)
  switch (currentTier) {
    case "Bronze":
      nextTier = "Silver"
      pointsToNextTier = Math.max(0, 1000 - currentPoints)
      progress = Math.min(100, (currentPoints / 1000) * 100)
      break
    case "Silver":
      nextTier = "Gold"
      pointsToNextTier = Math.max(0, 2500 - currentPoints)
      progress = Math.min(100, ((currentPoints - 1000) / 1500) * 100)
      break
    case "Gold":
      nextTier = "Platinum"
      pointsToNextTier = Math.max(0, 5000 - currentPoints)
      progress = Math.min(100, ((currentPoints - 2500) / 2500) * 100)
      break
    case "Platinum":
      nextTier = "Diamond"
      pointsToNextTier = Math.max(0, 10000 - currentPoints)
      progress = Math.min(100, ((currentPoints - 5000) / 5000) * 100)
      break
    default:
      nextTier = "Silver"
      pointsToNextTier = Math.max(0, 1000 - currentPoints)
      progress = Math.min(100, (currentPoints / 1000) * 100)
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
              <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName} {user?.lastName}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600">{user?.membershipTier} Member</Badge>
                <span className="text-gray-500 text-sm">
                  Member since {formattedMembershipDate} ({membershipDuration})
                </span>
              </div>
            </div>
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
                    <p className="text-2xl font-bold text-amber-600">{user?.loyaltyPoints?.toLocaleString() || '0'}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Membership Status</p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Badge 
                        className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                          user?.membershipTier === 'Bronze' 
                            ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/20' 
                            : user?.membershipTier === 'Silver'
                            ? 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 text-white shadow-lg shadow-gray-400/20'
                            : user?.membershipTier === 'Gold'
                            ? 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-white shadow-lg shadow-yellow-400/20'
                            : 'bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 text-white shadow-lg shadow-purple-500/20'
                        }`}
                      >
                        {user?.membershipTier}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400">Points</span>
                          <span className="text-lg font-bold text-gray-800">{user?.loyaltyPoints?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-100 p-4 rounded-lg shadow-sm border flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Green Points</p>
                    <p className="text-2xl font-bold text-emerald-600">{greenPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Tier Progress */}
        {currentTier !== "Platinum" && (
          <Card className="mb-8 bg-gradient-to-br from-background to-secondary/10 border-none shadow-lg overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  {currentTier} → {nextTier}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sm font-medium">
                    {user?.loyaltyPoints?.toLocaleString() || '0'} Points
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-base">
                <span className="font-semibold text-primary">{pointsToNextTier?.toLocaleString() || '0'}</span> points away from unlocking {nextTier} benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="relative">
                  {/* Background track with gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
                  
                  {/* Animated progress bar */}
                  <div 
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{
                      background: `linear-gradient(90deg, var(--primary) 0%, var(--primary) ${progress}%, transparent ${progress}%)`
                    } as React.CSSProperties}
                  >
                    {/* Animated sparkles effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_0%,transparent_50%)] animate-pulse" />
                    </div>
                    
                    {/* Progress indicator with glow effect */}
                    <div 
                      className="absolute top-1/2 left-[var(--progress)] transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${progress}%` } as React.CSSProperties}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary shadow-lg shadow-primary/50 flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-bold">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tier milestones with icons */}
                <div className="flex justify-between items-center pt-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-sm font-medium text-primary">{currentTier}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Current</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                      <span className="text-sm font-semibold">
                        {currentTier === "Bronze"
                          ? "1,000"
                          : currentTier === "Silver"
                            ? "2,500"
                            : currentTier === "Gold"
                              ? "5,000"
                              : "10,000"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Target</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <span className="text-sm font-medium text-primary">{nextTier}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Next Tier</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Tabs */}
        <Tabs defaultValue="rewards" className="mb-8">
          <div className="relative">
            <TabsList className="grid grid-cols-4 md:w-[800px] mb-6 bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              <TabsTrigger 
                value="rewards" 
                className="relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5"
              >
                <div className="flex items-center gap-2 p-2">
                  <Gift className="h-4 w-4" />
                  <span>Rewards Catalog</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5"
              >
                <div className="flex items-center gap-2 p-2">
                  <Calendar className="h-4 w-4" />
                  <span>Point Activity</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="bookings" 
                className="relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5"
              >
                <div className="flex items-center gap-2 p-2">
                  <Hotel className="h-4 w-4" />
                  <span>My Bookings</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="redemptions" 
                className="relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5"
              >
                <div className="flex items-center gap-2 p-2">
                  <Ticket className="h-4 w-4" />
                  <span>My Redemptions</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="rewards" className="mt-6">
            <Card className="border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Available Rewards</CardTitle>
                <CardDescription className="text-white/70">
                  Browse and redeem your points for exclusive rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RewardsCatalog userPoints={user?.loyaltyPoints} onRedeemReward={handleRedeemReward} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">Point Activity</CardTitle>
                <CardDescription className="text-gray-600">
                  Track your points earned and redeemed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity) => {
                        const activityDate = activity.date ? parseISO(activity.date) : new Date()
                        return (
                          <div 
                            key={activity.id} 
                            className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-gray-200 p-4 transition-all duration-300 hover:bg-white/10 hover:border-gray-300"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex items-start gap-4">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === "earned" 
                                  ? "bg-emerald-500/20 text-emerald-600" 
                                  : "bg-amber-500/20 text-amber-600"
                              }`}>
                                {activity.type === "earned" ? (
                                  <ArrowUpRight className="h-5 w-5" />
                                ) : (
                                  <ArrowDownRight className="h-5 w-5" />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h3 className="font-medium text-gray-800 truncate">
                                    {activity.description}
                                  </h3>
                                  <span className={`font-semibold whitespace-nowrap ${
                                    activity.type === "earned" 
                                      ? "text-emerald-600" 
                                      : "text-amber-600"
                                  }`}>
                                    {activity.type === "earned" ? "+" : "-"}
                                    {activity.amount.toLocaleString()} points
                                  </span>
                                </div>
                                
                                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="h-4 w-4" />
                                  <span>{format(activityDate, 'MMM d, yyyy')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Gift className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No Activity Yet</h3>
                        <p className="text-gray-600 max-w-sm mx-auto">
                          Start earning and redeeming points to see your activity history here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              {activities.length > 5 && (
                <CardFooter className="border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="w-full flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100"
                  >
                    View All Activity
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="mt-6">
            <Card className="border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">My Bookings</CardTitle>
                <CardDescription className="text-gray-600">
                  View and manage your upcoming and past bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings && bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <div 
                          key={booking.id}
                          className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-4 transition-all duration-300 hover:shadow-md"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Service Image */}
                            <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
                              <Image
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.service}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1">
                              <div className="flex flex-col h-full">
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {booking.service}
                                  </h3>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <Calendar className="h-4 w-4" />
                                      <span>Booked for {format(parseISO(booking.date), 'MMM d, yyyy')}</span>
                                    </div>
                                    {booking.time && (
                                      <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        <span>Time: {booking.time}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      variant={booking.status === 'upcoming' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'}
                                      className="text-sm"
                                    >
                                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Gift className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-600">
                                      +{booking.pointsEarned.toLocaleString()} points
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Hotel className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No Bookings Yet</h3>
                        <p className="text-gray-600 max-w-sm mx-auto">
                          Your upcoming and past bookings will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redemptions" className="mt-6">
            <Card className="border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800">My Redemptions</CardTitle>
                <CardDescription className="text-gray-600">
                  Track your reward redemptions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {redemptions.length > 0 ? (
                    redemptions.map((redemption) => (
                      <div 
                        key={redemption.id}
                        className="group relative overflow-hidden rounded-xl bg-white border border-gray-200 p-4 transition-all duration-300 hover:shadow-md"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Reward Image */}
                          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
                            <Image
                              src={redemption.reward.image}
                              alt={redemption.reward.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge
                                className={`${
                                  redemption.reward.category === "spa"
                                    ? "bg-pink-100 text-pink-800 border-pink-200"
                                    : redemption.reward.category === "dining"
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : redemption.reward.category === "activities"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }`}
                              >
                                {redemption.reward.category.charAt(0).toUpperCase() + redemption.reward.category.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          {/* Reward Details */}
                          <div className="flex-1">
                            <div className="flex flex-col h-full">
                              <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                  {redemption.reward.name}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                  {redemption.reward.description}
                                </p>
                              </div>

                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Redeemed on {format(parseISO(redemption.date), 'MMM d, yyyy')}</span>
                                  </div>
                                  {redemption.expiryDate && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <Clock className="h-4 w-4" />
                                      <span>Expires on {format(parseISO(redemption.expiryDate), 'MMM d, yyyy')}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center gap-4">
                                  <Badge 
                                    variant={redemption.status === 'active' ? 'default' : redemption.status === 'used' ? 'secondary' : 'destructive'}
                                    className="text-sm"
                                  >
                                    {redemption.status.charAt(0).toUpperCase() + redemption.status.slice(1)}
                                  </Badge>
                                  <div className="flex items-center gap-2">
                                    <Gift className="h-4 w-4 text-amber-600" />
                                    <span className="text-sm font-medium text-amber-600">
                                      -{redemption.pointsSpent.toLocaleString()} points
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Ticket className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No Redemptions Yet</h3>
                      <p className="text-gray-600 max-w-sm mx-auto">
                        Your reward redemptions will appear here.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
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
