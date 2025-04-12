"use client"

import { useState, useEffect } from "react"
import { SpadeIcon as Spa, Utensils, Compass, Zap, Users, Award, ArrowRight, Leaf, Gift, Share2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUserStore } from "@/store/userStore"
import { toast } from "sonner"
import { QRCodeSVG } from "qrcode.react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface Tier {
  name: string
  points: number
  benefits: {
    title: string
    description: string
    icon: string
  }[]
  specialPerk?: string
}

const mockTiers: Tier[] = [
  {
    name: "Bronze",
    points: 0,
    benefits: [
      {
        title: "Spa Discount",
        description: "10% off all spa treatments",
        icon: "spa"
      },
      {
        title: "Dining Reward",
        description: "Free welcome drink with dinner",
        icon: "dining"
      },
      {
        title: "Activities",
        description: "Access to standard resort activities",
        icon: "activities"
      }
    ],
    specialPerk: "Early check-in when available"
  },
  {
    name: "Silver",
    points: 1000,
    benefits: [
      {
        title: "Spa Discount",
        description: "15% off all spa treatments",
        icon: "spa"
      },
      {
        title: "Dining Reward",
        description: "Free dessert with any meal",
        icon: "dining"
      },
      {
        title: "Activities",
        description: "One free standard activity per stay",
        icon: "activities"
      }
    ],
    specialPerk: "Room upgrade when available"
  },
  {
    name: "Gold",
    points: 2500,
    benefits: [
      {
        title: "Spa Discount",
        description: "25% off all spa treatments",
        icon: "spa"
      },
      {
        title: "Dining Reward",
        description: "One free dinner per stay",
        icon: "dining"
      },
      {
        title: "Activities",
        description: "Two free premium activities per stay",
        icon: "activities"
      }
    ],
    specialPerk: "Private tour with Brilliant Ethiopia"
  },
  {
    name: "Platinum",
    points: 5000,
    benefits: [
      {
        title: "Spa Discount",
        description: "50% off all spa treatments",
        icon: "spa"
      },
      {
        title: "Dining Reward",
        description: "Daily complimentary breakfast and dinner",
        icon: "dining"
      },
      {
        title: "Activities",
        description: "Unlimited premium activities",
        icon: "activities"
      }
    ],
    specialPerk: "Private Omo Valley tour with Brilliant Ethiopia"
  }
]

export default function MembershipTiers() {
  const [tiers, setTiers] = useState<Tier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, token } = useUserStore()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [guests, setGuests] = useState("1")
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false)
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false)
  const [referralCode, setReferralCode] = useState("KURIFTU2024")
  const [referralLink, setReferralLink] = useState("https://kurifturesorts.com/join?ref=KURIFTU2024")

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        // Temporarily using mock data until backend endpoint is ready
        setTiers(mockTiers)
      } catch (error) {
        console.error("Error fetching tiers:", error)
        toast.error("Failed to load membership tiers")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTiers()
  }, [])

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case "bronze": return "bg-amber-600"
      case "silver": return "bg-gray-400"
      case "gold": return "bg-amber-500"
      case "platinum": return "bg-gray-800"
      default: return "bg-amber-600"
    }
  }

  const getTierProgress = (tier: string) => {
    const currentPoints = user?.loyaltyPoints || 0
    switch (tier.toLowerCase()) {
      case "bronze": return 0
      case "silver": return Math.min(100, (currentPoints / 1000) * 100)
      case "gold": return Math.min(100, ((currentPoints - 1000) / 1500) * 100)
      case "platinum": return Math.min(100, ((currentPoints - 2500) / 2500) * 100)
      default: return 0
    }
  }

  const getNextTierPoints = (tier: string) => {
    const currentPoints = user?.loyaltyPoints || 0
    switch (tier.toLowerCase()) {
      case "bronze": return 1000 - currentPoints
      case "silver": return 2500 - currentPoints
      case "gold": return 5000 - currentPoints
      case "platinum": return 10000 - currentPoints
      default: return 0
    }
  }

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "spa": return <Spa className="h-5 w-5" />
      case "dining": return <Utensils className="h-5 w-5" />
      case "activities": return <Compass className="h-5 w-5" />
      default: return <Award className="h-5 w-5" />
    }
  }

  const handleBookNow = () => {
    setIsBookingModalOpen(true)
  }

  const handleBookingSubmit = () => {
    // Simulate booking process
    setTimeout(() => {
      setBookingSuccess(true)
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsBookingModalOpen(false)
        setBookingSuccess(false)
        setDate(new Date())
        setGuests("1")
      }, 3000)
    }, 1500)
  }

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied to clipboard!")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Join Membership Section */}
      {!user && (
        <Card className="border-none bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-amber-900 mb-2">Start Your Journey</h2>
                <p className="text-amber-800">Join Kuriftu Rewards today and start earning points towards amazing benefits</p>
              </div>
              <Button 
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => window.location.href = "/auth/signup"}
              >
                Join Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={user?.membershipTier || "Bronze"} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl p-1">
          {tiers.map((tier) => (
            <TabsTrigger 
              key={tier.name}
              value={tier.name}
              className={`relative z-10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-foreground data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-300 ease-in-out hover:bg-white/5`}
            >
              <div className="flex items-center gap-2 p-2">
                <span className={`inline-block w-2 h-2 rounded-full ${getTierColor(tier.name)}`}></span>
                <span>{tier.name}</span>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {tiers.map((tier) => (
          <TabsContent key={tier.name} value={tier.name} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="h-full border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
                  <CardHeader>
                    <div className={`w-full h-1 ${getTierColor(tier.name)} rounded-full mb-4`}></div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <span className={`inline-block w-4 h-4 rounded-full ${getTierColor(tier.name)}`}></span>
                      {tier.name} Tier
                    </CardTitle>
                    <CardDescription>
                      {tier.points.toLocaleString()} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Progress to Next Tier */}
                    {tier.name !== "Platinum" && (
                      <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">Progress to Next Tier</h3>
                          <span className="text-sm text-gray-600">{Math.round(getTierProgress(tier.name))}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getTierColor(tier.name)} transition-all duration-500`}
                            style={{ width: `${getTierProgress(tier.name)}%` }}
                          ></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {getNextTierPoints(tier.name).toLocaleString()} points needed for next tier
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-gray-200 p-4 transition-all duration-300 hover:bg-white/10 hover:border-gray-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-amber-600">{getIcon(benefit.icon)}</div>
                            <h3 className="font-medium text-gray-800">{benefit.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                      ))}
                    </div>

                    {tier.specialPerk && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="h-5 w-5 text-amber-600" />
                          <h3 className="font-medium text-amber-800">Special Perk</h3>
                        </div>
                        <p className="text-amber-800">{tier.specialPerk}</p>
                      </div>
                    )}

                    {/* Book Now Button */}
                    <div className="mt-6 flex justify-center">
                      <Button 
                        size="lg"
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={handleBookNow}
                      >
                        Book Now to Earn Points
                      </Button>
                    </div>

                    {/* Enhanced Card Content */}
                    <div className="mt-8 space-y-6">
                      {/* Progress Section */}
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-amber-900">Your Progress</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-amber-700">Current Points</span>
                            <span className="font-bold text-amber-900">{user?.loyaltyPoints?.toLocaleString() || '0'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-amber-800">
                            <span>Bronze</span>
                            <span>Silver</span>
                            <span>Gold</span>
                            <span>Platinum</span>
                          </div>
                          <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                              style={{ width: `${getTierProgress(tier.name)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                              <Gift className="h-5 w-5 text-amber-600" />
                            </div>
                            <h4 className="font-medium text-gray-800">Available Rewards</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Check out rewards you can redeem with your points</p>
                          <Button 
                            variant="ghost" 
                            className="w-full text-amber-600 hover:text-amber-700"
                            onClick={() => setIsRewardsModalOpen(true)}
                          >
                            View Rewards
                          </Button>
                        </div>

                        <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-amber-300 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                              <Users className="h-5 w-5 text-amber-600" />
                            </div>
                            <h4 className="font-medium text-gray-800">Refer Friends</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Earn 500 points for each friend who joins</p>
                          <Button 
                            variant="ghost" 
                            className="w-full text-amber-600 hover:text-amber-700"
                            onClick={() => setIsReferralModalOpen(true)}
                          >
                            Invite Friends
                          </Button>
                        </div>
                      </div>

                      {/* Upcoming Benefits */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Benefits</h3>
                        <div className="space-y-4">
                          {tier.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                {getIcon(benefit.icon)}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{benefit.title}</h4>
                                <p className="text-sm text-gray-600">{benefit.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="h-full border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">How to Earn Points</CardTitle>
                    <CardDescription>Ways to progress to {tier.name} tier</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-gray-800">Stay at Kuriftu</h4>
                        <p className="text-sm text-gray-600">Earn 100 points per night</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-amber-600 hover:text-amber-700"
                          onClick={() => window.location.href = "/book"}
                        >
                          Book a Stay
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-gray-800">Refer Friends</h4>
                        <p className="text-sm text-gray-600">Earn 500 points per referral</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-amber-600 hover:text-amber-700"
                          onClick={() => window.location.href = "/refer"}
                        >
                          Invite Friends
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-gray-800">Book Services</h4>
                        <p className="text-sm text-gray-600">Earn points on spa, dining, and activities</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-amber-600 hover:text-amber-700"
                          onClick={() => window.location.href = "/services"}
                        >
                          View Services
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Leaf className="h-5 w-5 text-amber-600" />
                      <div>
                        <h4 className="font-medium text-gray-800">Green Points</h4>
                        <p className="text-sm text-gray-600">Earn extra points for eco-friendly choices</p>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-amber-600 hover:text-amber-700"
                          onClick={() => window.location.href = "/sustainability"}
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm border border-gray-200 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-3">Scan to visit Kuriftu Resorts</p>
                      <div className="flex justify-center items-center p-4 bg-white rounded-lg">
                        <QRCodeSVG 
                          value="https://kurifturesorts.com" 
                          size={160}
                          level="H"
                          includeMargin={true}
                          bgColor="white"
                          fgColor="black"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        className="mt-4 text-amber-600 hover:text-amber-700"
                        onClick={() => window.open("https://kurifturesorts.com", "_blank")}
                      >
                        Visit Website <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Booking Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Your Stay</DialogTitle>
            <DialogDescription>
              Complete your booking to start earning points towards your next tier.
            </DialogDescription>
          </DialogHeader>
          
          {!bookingSuccess ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>

              <Button 
                className="mt-4 bg-amber-600 hover:bg-amber-700"
                onClick={handleBookingSubmit}
              >
                Complete Booking
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-emerald-600 mb-2">Booking Successful!</h3>
              <p className="text-center text-gray-600">
                You've earned 100 points towards your next tier. Check your dashboard for details.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rewards Modal */}
      <Dialog open={isRewardsModalOpen} onOpenChange={setIsRewardsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Available Rewards</DialogTitle>
            <DialogDescription>
              Redeem your points for exclusive experiences and benefits
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Spa className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Spa Treatment</h4>
                </div>
                <p className="text-sm text-amber-800 mb-2">60-minute massage session</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">1,000 points</span>
                  <Button size="sm" variant="outline" className="text-amber-600">
                    Redeem
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Utensils className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Dining Experience</h4>
                </div>
                <p className="text-sm text-amber-800 mb-2">Three-course dinner for two</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">1,500 points</span>
                  <Button size="sm" variant="outline" className="text-amber-600">
                    Redeem
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Compass className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Guided Tour</h4>
                </div>
                <p className="text-sm text-amber-800 mb-2">Private cultural tour</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">800 points</span>
                  <Button size="sm" variant="outline" className="text-amber-600">
                    Redeem
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="h-5 w-5 text-amber-600" />
                  <h4 className="font-medium text-amber-900">Room Upgrade</h4>
                </div>
                <p className="text-sm text-amber-800 mb-2">Upgrade to next room category</p>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600 font-semibold">2,000 points</span>
                  <Button size="sm" variant="outline" className="text-amber-600">
                    Redeem
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Referral Modal */}
      <Dialog open={isReferralModalOpen} onOpenChange={setIsReferralModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Invite Friends</DialogTitle>
            <DialogDescription>
              Share your referral code and earn 500 points for each friend who joins
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-amber-900">Your Referral Code</h4>
                  <p className="text-sm text-amber-800">Share this code with your friends</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Share2 className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white rounded-lg border border-amber-200">
                  <code className="text-amber-900 font-mono">{referralCode}</code>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-amber-600"
                  onClick={handleCopyReferral}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-medium text-amber-900 mb-2">Share Your Link</h4>
              <p className="text-sm text-amber-800 mb-4">Copy and share your unique referral link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-white rounded-lg border border-amber-200 overflow-hidden">
                  <p className="text-sm text-amber-900 truncate">{referralLink}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-amber-600"
                  onClick={handleCopyReferral}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Your friends will receive 100 bonus points when they join using your code
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
