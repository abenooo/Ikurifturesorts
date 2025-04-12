"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { SpadeIcon as Spa, Utensils, Compass, Zap, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type TierType = "bronze" | "silver" | "gold" | "platinum"

interface TierProps {
  name: string
  color: string
  points: string
  perks: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
  specialPerk?: string
}

const tiers: Record<TierType, TierProps> = {
  bronze: {
    name: "Bronze",
    color: "bg-amber-700",
    points: "0-999",
    perks: [
      {
        icon: <Spa className="h-5 w-5" />,
        title: "Spa Discount",
        description: "10% off all spa treatments",
      },
      {
        icon: <Utensils className="h-5 w-5" />,
        title: "Dining Reward",
        description: "Free welcome drink with dinner",
      },
      {
        icon: <Compass className="h-5 w-5" />,
        title: "Activities",
        description: "Access to standard resort activities",
      },
    ],
  },
  silver: {
    name: "Silver",
    color: "bg-gray-400",
    points: "1,000-2,499",
    perks: [
      {
        icon: <Spa className="h-5 w-5" />,
        title: "Spa Discount",
        description: "15% off all spa treatments",
      },
      {
        icon: <Utensils className="h-5 w-5" />,
        title: "Dining Reward",
        description: "Free dessert with any meal",
      },
      {
        icon: <Compass className="h-5 w-5" />,
        title: "Activities",
        description: "One free standard activity per stay",
      },
    ],
    specialPerk: "Early check-in when available",
  },
  gold: {
    name: "Gold",
    color: "bg-amber-500",
    points: "2,500-4,999",
    perks: [
      {
        icon: <Spa className="h-5 w-5" />,
        title: "Spa Discount",
        description: "25% off all spa treatments",
      },
      {
        icon: <Utensils className="h-5 w-5" />,
        title: "Dining Reward",
        description: "One free dinner per stay",
      },
      {
        icon: <Compass className="h-5 w-5" />,
        title: "Activities",
        description: "Two free premium activities per stay",
      },
    ],
    specialPerk: "Room upgrade when available",
  },
  platinum: {
    name: "Platinum",
    color: "bg-gray-800",
    points: "5,000+",
    perks: [
      {
        icon: <Spa className="h-5 w-5" />,
        title: "Spa Discount",
        description: "50% off all spa treatments",
      },
      {
        icon: <Utensils className="h-5 w-5" />,
        title: "Dining Reward",
        description: "Daily complimentary breakfast and dinner",
      },
      {
        icon: <Compass className="h-5 w-5" />,
        title: "Activities",
        description: "Unlimited premium activities",
      },
    ],
    specialPerk: "Private Omo Valley tour with Brilliant Ethiopia",
  },
}

export default function MembershipTiers() {
  const [activeTier, setActiveTier] = useState<TierType>("bronze")
  const [showQR, setShowQR] = useState(false)

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
        {(Object.keys(tiers) as TierType[]).map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className={`px-3 py-2 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-all ${
              activeTier === tier ? `${tiers[tier].color} text-white` : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tiers[tier].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className={`w-full h-1 ${tiers[activeTier].color} rounded-full mb-4`}></div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className={`inline-block w-4 h-4 rounded-full ${tiers[activeTier].color}`}></span>
                {tiers[activeTier].name} Tier
              </CardTitle>
              <CardDescription>{tiers[activeTier].points} points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers[activeTier].perks.map((perk, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-amber-600">{perk.icon}</div>
                      <h3 className="font-medium">{perk.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{perk.description}</p>
                  </div>
                ))}
              </div>

              {tiers[activeTier].specialPerk && (
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    <h3 className="font-medium">Special Perk</h3>
                  </div>
                  <p className="text-amber-800">{tiers[activeTier].specialPerk}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setShowQR(!showQR)}>
                {showQR ? "Hide AR Experience" : "Unlock AR Experience"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Tier Benefits</CardTitle>
              <CardDescription>How to earn and use your points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium">Earn Points</h4>
                  <p className="text-sm text-gray-600">1 USD = 10 points on all stays and purchases</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-amber-600" />
                <div>
                  <h4 className="font-medium">Refer Friends</h4>
                  <p className="text-sm text-gray-600">Earn 500 bonus points for each referral</p>
                </div>
              </div>

              {showQR && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-3">Scan this QR code to experience AR benefits</p>
                  <div className="relative h-48 w-48 mx-auto">
                    <Image src="/images/ar-qr-code.png" alt="AR QR Code" fill className="object-contain" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Demo purposes only</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
