"use client"

import SustainabilityRewards from "@/components/sustainability-rewards"

export default function SustainabilityPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Sustainability Rewards</h1>
          <SustainabilityRewards />
        </div>
      </div>
    </main>
  )
}