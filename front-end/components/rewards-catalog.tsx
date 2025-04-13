"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon, Filter, Gift, AlertCircle, ArrowUpRight, X, Plus } from "lucide-react"
import RedemptionModal from "@/components/redemption-modal"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useUserStore } from "@/store/userStore"
import { toast } from "sonner"

interface RewardsCatalogProps {
  userPoints: number | undefined
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

export default function RewardsCatalog({ userPoints, onRedeemReward }: RewardsCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null)
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [selectedPointsRange, setSelectedPointsRange] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useUserStore()

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch(
          "https://i-kuriftu.onrender.com/api/rewards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch rewards');
        }

        const data = await response.json();
        // Transform the backend data to match our frontend interface
        const transformedRewards = data.map((reward: any) => ({
          id: reward._id,
          title: reward.name,
          description: reward.description,
          category: reward.category.toLowerCase() as "spa" | "dining" | "activities" | "stays",
          points: reward.pointsCost,
          image: reward.image
        }));
        setRewards(transformedRewards);
      } catch (error) {
        console.error("Error fetching rewards:", error);
        // toast.error("Failed to load rewards");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchRewards();
    }
  }, [token]);

  const filteredRewards = rewards.filter((reward) => {
    const matchesCategory = activeCategory === "all" || reward.category === activeCategory
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAvailability = !showAvailableOnly || (userPoints ?? 0) >= reward.points
    const matchesPointsRange = selectedPointsRange === "all" || 
      (selectedPointsRange === "low" && reward.points <= 3000) ||
      (selectedPointsRange === "medium" && reward.points > 3000 && reward.points <= 6000) ||
      (selectedPointsRange === "high" && reward.points > 6000)
    
    return matchesCategory && matchesSearch && matchesAvailability && matchesPointsRange
  })

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen} direction="left">
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full w-[300px]">
              <div className="h-full flex flex-col">
                <DrawerHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <DrawerTitle>Filter Rewards</DrawerTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create
                    </Button>
                  </div>
                </DrawerHeader>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Show available rewards only</span>
                        <Switch
                          checked={showAvailableOnly}
                          onCheckedChange={setShowAvailableOnly}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Points Range</Label>
                      <RadioGroup
                        value={selectedPointsRange}
                        onValueChange={setSelectedPointsRange}
                        className="grid grid-cols-1 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="all" id="all" />
                          <Label htmlFor="all">All</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="low" />
                          <Label htmlFor="low">Low (≤3,000)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium (3,001-6,000)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="high" />
                          <Label htmlFor="high">High ({'>'}6,000)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </ScrollArea>
                <div className="p-4 border-t">
                  <DrawerClose asChild>
                    <Button className="w-full">Apply Filters</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
            <Gift className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-gray-900">
              {userPoints?.toLocaleString() || '0'} points
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeCategory === "all"
              ? "bg-amber-600 text-white shadow-md"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          All Rewards
        </button>
        {["spa", "dining", "activities", "stays"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? "bg-amber-600 text-white shadow-md"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Reward Image */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={reward.image}
                alt={reward.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge
                  className={`${
                    reward.category === "spa"
                      ? "bg-pink-100 text-pink-800 border-pink-200"
                      : reward.category === "dining"
                      ? "bg-amber-100 text-amber-800 border-amber-200"
                      : reward.category === "activities"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  {reward.category.charAt(0).toUpperCase() + reward.category.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Reward Content */}
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {reward.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {reward.description}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-amber-600">
                    {reward.points.toLocaleString()} points
                  </span>
                </div>
                <Button
                  variant={userPoints ?? 0 >= reward.points ? "default" : "outline"}
                  className={userPoints ?? 0 >= reward.points ? "bg-amber-600 hover:bg-amber-700" : "border-gray-200 text-gray-500"}
                  disabled={(userPoints ?? 0) < reward.points}
                  onClick={() => handleRedeemClick(reward)}
                >
                  {(userPoints ?? 0) >= reward.points ? (
                    <span className="flex items-center gap-2">
                      Redeem Now
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  ) : (
                    "Not Enough Points"
                  )}
                </Button>
              </div>

              {/* Points Required Message */}
              {(userPoints ?? 0) < reward.points && (
                <div className="mt-2 text-sm text-gray-500">
                  {reward.points - (userPoints ?? 0)} more points needed
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedReward && (
        <RedemptionModal
          isOpen={isRedemptionModalOpen}
          onClose={() => setIsRedemptionModalOpen(false)}
          reward={selectedReward}
          userPoints={userPoints ?? 0}
          onConfirm={handleRedemptionConfirm}
        />
      )}
    </div>
  )
}
