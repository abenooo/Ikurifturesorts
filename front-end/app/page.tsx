"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import MembershipTiers from "@/components/membership-tiers"
import AiExperienceBuilder from "@/components/ai-experience-builder"
import SustainabilityRewards from "@/components/sustainability-rewards"
import ServicesShowcase from "@/components/services-showcase"
import WaitlistForm from "@/components/waitlist-form"
import AuthModal from "@/components/auth-modal"
import { useUserStore, rehydrateStore } from "@/store/userStore"
import type { UserData } from "@/store/userStore"
import { useRouter } from "next/navigation"
import WaysToEarn from "@/components/ways-to-earn"
import ChatbaseEmbed from "@/components/chat/bot"
import backgroundImage from "../images/background.jpg"

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const router = useRouter()
  const { user, token, setUser } = useUserStore()

  useEffect(() => {
    // Rehydrate store on mount
    rehydrateStore()
  }, [])

  const handleLogin = (userData: any) => {
    // Store user data in localStorage for persistence
    console.log('---------------',userData)
    localStorage.setItem("kuriftuUser", JSON.stringify(userData))
    setUser(userData.user, userData.token)
  }

  const handleEarnPoints = (amount: number, description: string) => {
    if (!user) {
      setIsAuthModalOpen(true)
      return
    }
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen">
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleLogin} />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
             src={backgroundImage}
              alt="Kuriftu Resort"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
          </div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Kuriftu Rewards: Where Every Stay Becomes an African Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Earn points for spa treatments, cultural tours, and eco-friendly stays—redeem for unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-all"
            >
              Join Now <ArrowRight size={18} />
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold py-3 px-8 rounded-full flex items-center justify-center gap-2 transition-all">
              Demo Video <Play size={18} />
            </button>
          </div>

          <div className="mt-16 bg-black/30 backdrop-blur-sm p-6 rounded-xl max-w-xl mx-auto">
            <div className="text-2xl font-semibold mb-2">Rewards at a Glance</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="text-amber-400 text-2xl font-bold">500 pts</div>
                <div>Free Spa Treatment</div>
              </div>
              <div className="p-3">
                <div className="text-amber-400 text-2xl font-bold">1,000 pts</div>
                <div>Cultural Dinner Experience</div>
              </div>
              <div className="p-3">
                <div className="text-amber-400 text-2xl font-bold">2,500 pts</div>
                <div>Free Night Stay</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Tiers Section */}
      <section id="services" className="py-16 bg-stone-100">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Services</h2>
          <ServicesShowcase />
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section id="membership-tiers" className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Membership Tiers</h2>
          <MembershipTiers />
        </div>
      </section>

      {/* AI Experience Builder Section */}
      <section id="ai-experience" className="py-16 bg-stone-100">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">AI Experience Builder</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell us what you love, and our AI will craft the perfect reward experience just for you.
          </p>
          <AiExperienceBuilder />
        </div>
      </section>

      {/* Sustainability Rewards Section */}
      <section id="sustainability" className="py-16 bg-emerald-50">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Sustainability Rewards</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Make eco-friendly choices during your stay and earn Green Points towards meaningful rewards.
          </p>
          <SustainabilityRewards />
        </div>
      </section>

      {/* Ways to Earn Section */}
      <section id="ways-to-earn" className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Ways to Earn Points</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover all the ways you can earn points and unlock amazing rewards at Kuriftu Resorts.
          </p>
          <WaysToEarn onEarnPoints={handleEarnPoints} />
        </div>
      </section>

      {/* Footer & Waitlist Section */}
      <section id="join-now" className="py-16 bg-stone-900 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Stays?</h2>
            <p className="text-xl text-stone-300 max-w-2xl mx-auto">
              Join our waitlist to be the first to experience Kuriftu's revolutionary loyalty program.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <WaitlistForm />
          </div>

          <div className="mt-12 text-center text-stone-400">
            <p>Hackathon prototype. Coming 2025!</p>
            <p className="mt-4">© 2025 Kuriftu Resorts. All rights reserved.</p>
          </div>
        </div>
      </section>
      <ChatbaseEmbed />
    </main>
  )
}
