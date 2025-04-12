"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, CheckCircle2, Mail, Lock, User, ArrowRight, ArrowLeft, Sparkles, Gift } from "lucide-react"

interface UserData {
  name: string
  email: string
  points: number
  tier: string
  joinDate: string
}

interface Preference {
  id: string
  label: string
  description: string
}

const preferences: Preference[] = [
  {
    id: "spa",
    label: "Spa Lover",
    description: "Relaxation and wellness treatments",
  },
  {
    id: "adventure",
    label: "Adventure Seeker",
    description: "Outdoor activities and exploration",
  },
  {
    id: "culture",
    label: "Cultural Explorer",
    description: "Local traditions and heritage experiences",
  },
  {
    id: "food",
    label: "Food Enthusiast",
    description: "Culinary experiences and tastings",
  },
  {
    id: "nature",
    label: "Nature Enthusiast",
    description: "Eco-friendly and wildlife activities",
  },
  {
    id: "luxury",
    label: "Luxury Experience",
    description: "Premium services and exclusive access",
  },
]

// Mock AI response data for recommendations
const rewardExperiences: Record<
  string,
  {
    title: string
    description: string
    points: number
    image: string
  }
> = {
  spa: {
    title: "Lakeside Spa Retreat",
    description:
      "Enjoy a full day of pampering with our signature treatments overlooking Lake Koriftu, followed by a private dinner on the shore.",
    points: 3500,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  adventure: {
    title: "Sunset Kayak Tour + Lakeside Dinner",
    description:
      "Paddle across the serene waters of Lake Koriftu at sunset, followed by an exclusive lakeside dinner under the stars.",
    points: 3200,
    image:
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
  },
  culture: {
    title: "Ethiopian Coffee Ceremony & Cultural Tour",
    description:
      "Experience the traditional Ethiopian coffee ceremony and explore local cultural sites with a private guide.",
    points: 3000,
    image:
      "https://images.unsplash.com/photo-1462919407465-b3dc132d800c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1207&q=80",
  },
  food: {
    title: "Chef's Table Culinary Experience",
    description:
      "Join our executive chef for a private cooking class featuring Ethiopian cuisine, followed by a multi-course tasting menu.",
    points: 4500,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  nature: {
    title: "Bird Watching Expedition & Eco Tour",
    description:
      "Explore the rich biodiversity around Lake Koriftu with our expert naturalist, spotting rare bird species and learning about local conservation efforts.",
    points: 3100,
    image:
      "https://images.unsplash.com/photo-1621494547928-9f90998fa061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  luxury: {
    title: "Private Villa Upgrade & Butler Service",
    description:
      "Upgrade to our exclusive lakeside villa with personal butler service and customized amenities for the duration of your stay.",
    points: 5000,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
}

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
}: {
  isOpen: boolean
  onClose: () => void
  onLogin: (userData: UserData) => void
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("login")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Register form state
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)

  if (!isOpen) return null

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }

    setIsLoggingIn(true)

    try {
      const response = await fetch(`https://i-kuriftu.onrender.com/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        throw new Error("Server returned non-JSON response")
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      onLogin(data)
      onClose()
      router.push("/dashboard")
    } catch (error: any) {
      setLoginError(error.message || "An error occurred during login")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    setIsRegistering(true)

    try {
      const response = await fetch('https://i-kuriftu.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword
        })
      })

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        throw new Error("Server returned non-JSON response")
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Auto login after successful registration
      onLogin(data)
      onClose()
      router.push("/dashboard")
    } catch (error: any) {
      setRegisterError(error.message || "An error occurred during registration")
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Welcome to Kuriftu Rewards</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-9"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {loginError && <div className="text-red-500 text-sm">{loginError}</div>}

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="pl-9"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="pl-9"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="pl-9"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {registerError && <div className="text-red-500 text-sm">{registerError}</div>}

              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isRegistering}>
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
