"use client"

import MembershipTiers from "@/components/membership-tiers"

export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Membership Tiers</h1>
          <MembershipTiers />
        </div>
      </div>
    </main>
  )
}