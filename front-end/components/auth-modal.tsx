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
  preferences: string[]
  recommendedExperience?: {
    title: string
    description: string
    points: number
    image: string
  }
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

  // Registration steps
  const [registrationStep, setRegistrationStep] = useState(1)

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
  const [isRegistered, setIsRegistered] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(3000) // Start with 3000 points

  // Preferences state
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [generatedExperience, setGeneratedExperience] = useState<{
    title: string
    description: string
    points: number
    image: string
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Basic validation
    if (!loginEmail || !loginPassword) {
      setLoginError("Please fill in all fields")
      return
    }

    setIsLoggingIn(true)

    // Simulate API call for login
    setTimeout(() => {
      setIsLoggingIn(false)

      // For demo, we'll accept any login
      const userData: UserData = {
        name: "Guest User",
        email: loginEmail,
        points: 3500,
        tier: "Silver",
        joinDate: new Date().toLocaleDateString(),
        preferences: ["spa", "culture"],
        recommendedExperience: rewardExperiences.spa,
      }

      onLogin(userData)
      onClose()
      router.push("/dashboard")
    }, 1500)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    // Basic validation
    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError("Please fill in all fields")
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters")
      return
    }

    setIsRegistering(true)

    // Move to preferences step
    setTimeout(() => {
      setIsRegistering(false)
      setRegistrationStep(2)
    }, 1000)
  }

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      setSelectedPreferences([...selectedPreferences, preferenceId])
      // Add 500 points for each preference selected (up to 3)
      if (selectedPreferences.length < 3) {
        setBonusPoints(bonusPoints + 500)
      }
    } else {
      setSelectedPreferences(selectedPreferences.filter((id) => id !== preferenceId))
      // Remove 500 points if preference is deselected
      if (selectedPreferences.length <= 3) {
        setBonusPoints(bonusPoints - 500)
      }
    }
  }

  const handlePreferencesSubmit = () => {
    if (selectedPreferences.length === 0) {
      return
    }

    setIsGenerating(true)

    // Simulate AI generating a recommendation
    setTimeout(() => {
      // Use the first preference for the recommendation
      const primaryPreference = selectedPreferences[0]
      setGeneratedExperience(rewardExperiences[primaryPreference])
      setIsGenerating(false)
      setRegistrationStep(3)
    }, 1500)
  }

  const completeRegistration = () => {
    setIsRegistered(true)

    // After successful registration, simulate automatic login
    setTimeout(() => {
      const userData: UserData = {
        name: registerName,
        email: registerEmail,
        // New users get bonus points
        points: bonusPoints,
        tier: bonusPoints >= 3000 ? "Silver" : "Bronze",
        joinDate: new Date().toLocaleDateString(),
        preferences: selectedPreferences,
        recommendedExperience: generatedExperience || undefined,
      }

      onLogin(userData)
      onClose()
      router.push("/dashboard")
    }, 2000)
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

        {isRegistered ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Registration Successful!</h3>
            <p className="text-gray-600 mb-4">
              Welcome to Kuriftu Rewards! You've earned{" "}
              <span className="font-bold text-amber-600">{bonusPoints.toLocaleString()} points</span> as a welcome gift.
            </p>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <p className="text-amber-800">Logging you in automatically...</p>
            </div>
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </div>
        ) : (
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

                <div className="text-center text-sm">
                  <p className="text-gray-500">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("register")
                        setRegistrationStep(1)
                      }}
                      className="text-amber-600 hover:underline"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              {/* Registration Step 1: Basic Info */}
              {registrationStep === 1 && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Step 1 of 3: Create Your Account</h3>
                      <span className="text-xs text-gray-500">1/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>

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

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          <span className="font-medium">Join now and get 3,000 points!</span> Plus earn 500 bonus points
                          for each preference you select.
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isRegistering}>
                      {isRegistering ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="text-center text-sm">
                      <p className="text-gray-500">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-amber-600 hover:underline"
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </form>
                </>
              )}

              {/* Registration Step 2: Preferences */}
              {registrationStep === 2 && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Step 2 of 3: Your Preferences</h3>
                      <span className="text-xs text-gray-500">2/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "66%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Select Your Preferences</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Tell us what you love, and our AI will craft the perfect reward experience just for you.
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-md mb-4">
                        <Gift className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          <span className="font-medium">Current points: {bonusPoints.toLocaleString()}</span> (+500 for
                          each preference)
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {preferences.map((preference) => (
                        <div
                          key={preference.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            selectedPreferences.includes(preference.id)
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200 hover:border-amber-300"
                          }`}
                          onClick={() =>
                            handlePreferenceChange(preference.id, !selectedPreferences.includes(preference.id))
                          }
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={preference.id}
                              checked={selectedPreferences.includes(preference.id)}
                              onCheckedChange={(checked) => handlePreferenceChange(preference.id, checked as boolean)}
                              className="mt-1"
                            />
                            <div>
                              <Label htmlFor={preference.id} className="font-medium cursor-pointer">
                                {preference.label}
                              </Label>
                              <p className="text-sm text-gray-600">{preference.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={() => setRegistrationStep(1)} className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      <Button
                        onClick={handlePreferencesSubmit}
                        disabled={selectedPreferences.length === 0 || isGenerating}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Registration Step 3: AI Recommendation */}
              {registrationStep === 3 && generatedExperience && (
                <>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Step 3 of 3: Your Personalized Experience</h3>
                      <span className="text-xs text-gray-500">3/3</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center mb-2">
                      <Sparkles className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <h3 className="text-lg font-medium">Your Perfect Reward Experience</h3>
                      <p className="text-gray-600 text-sm">
                        Based on your preferences, we've crafted this special experience just for you.
                      </p>
                    </div>

                    <div className="border border-amber-200 rounded-lg overflow-hidden">
                      <div className="relative h-48 w-full">
                        <img
                          src={generatedExperience.image || "/placeholder.svg"}
                          alt={generatedExperience.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">{generatedExperience.title}</h4>
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                            {generatedExperience.points.toLocaleString()} pts
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{generatedExperience.description}</p>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-amber-600" />
                            <div>
                              <p className="text-sm text-amber-800 font-medium">
                                You've earned {bonusPoints.toLocaleString()} points!
                              </p>
                              <p className="text-xs text-amber-700">
                                {bonusPoints >= generatedExperience.points
                                  ? "You have enough points to redeem this experience!"
                                  : `You need ${generatedExperience.points - bonusPoints} more points to redeem this experience.`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <Button variant="outline" onClick={() => setRegistrationStep(2)} className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      <Button onClick={completeRegistration} className="bg-amber-600 hover:bg-amber-700">
                        Complete Registration
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
