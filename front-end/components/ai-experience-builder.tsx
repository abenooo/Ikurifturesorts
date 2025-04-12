"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"
import Image from "next/image"

interface Preference {
  id: string
  label: string
}

interface RewardExperience {
  title: string
  description: string
  points: number
  image: string
}

const preferences: Preference[] = [
  { id: "spa", label: "Spa Lover" },
  { id: "adventure", label: "Adventure Seeker" },
  { id: "culture", label: "Cultural Explorer" },
  { id: "food", label: "Food Enthusiast" },
  { id: "nature", label: "Nature Enthusiast" },
  { id: "luxury", label: "Luxury Experience" },
]

// Mock AI response data
const rewardExperiences: Record<string, RewardExperience> = {
  spa: {
    title: "Lakeside Spa Retreat",
    description:
      "Enjoy a full day of pampering with our signature treatments overlooking Lake Koriftu, followed by a private dinner on the shore.",
    points: 1500,
    image: "/images/spa-experience.jpg",
  },
  adventure: {
    title: "Sunset Kayak Tour + Lakeside Dinner",
    description:
      "Paddle across the serene waters of Lake Koriftu at sunset, followed by an exclusive lakeside dinner under the stars.",
    points: 2000,
    image: "/images/adventure-experience.jpg",
  },
  culture: {
    title: "Ethiopian Coffee Ceremony & Cultural Tour",
    description:
      "Experience the traditional Ethiopian coffee ceremony and explore local cultural sites with a private guide.",
    points: 1200,
    image: "/images/culture-experience.jpg",
  },
  food: {
    title: "Chef's Table Culinary Experience",
    description:
      "Join our executive chef for a private cooking class featuring Ethiopian cuisine, followed by a multi-course tasting menu.",
    points: 1800,
    image: "/images/food-experience.jpg",
  },
  nature: {
    title: "Bird Watching Expedition & Eco Tour",
    description:
      "Explore the rich biodiversity around Lake Koriftu with our expert naturalist, spotting rare bird species and learning about local conservation efforts.",
    points: 1000,
    image: "/images/nature-experience.jpg",
  },
  luxury: {
    title: "Private Villa Upgrade & Butler Service",
    description:
      "Upgrade to our exclusive lakeside villa with personal butler service and customized amenities for the duration of your stay.",
    points: 3000,
    image: "/images/luxury-experience.jpg",
  },
}

export default function AiExperienceBuilder() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedExperience, setGeneratedExperience] = useState<RewardExperience | null>(null)

  const handlePreferenceChange = (preferenceId: string, checked: boolean) => {
    if (checked) {
      setSelectedPreferences([...selectedPreferences, preferenceId])
    } else {
      setSelectedPreferences(selectedPreferences.filter((id) => id !== preferenceId))
    }
  }

  const generateExperience = () => {
    if (selectedPreferences.length === 0) return

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, just use the first selected preference
      const primaryPreference = selectedPreferences[0]
      setGeneratedExperience(rewardExperiences[primaryPreference])
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 md:p-8 bg-stone-50">
            <h3 className="text-xl font-semibold mb-4">Select Your Preferences</h3>
            <p className="text-gray-600 mb-6">
              Tell us what you love, and our AI will craft the perfect reward experience just for you.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {preferences.map((preference) => (
                <div key={preference.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={preference.id}
                    checked={selectedPreferences.includes(preference.id)}
                    onCheckedChange={(checked) => handlePreferenceChange(preference.id, checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor={preference.id} className="cursor-pointer">
                    {preference.label}
                  </Label>
                </div>
              ))}
            </div>

            <Button
              onClick={generateExperience}
              disabled={selectedPreferences.length === 0 || isGenerating}
              className="mt-8 w-full bg-amber-600 hover:bg-amber-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate My Perfect Experience
                </>
              )}
            </Button>
          </div>

          <div className="p-6 md:p-8 bg-white">
            <h3 className="text-xl font-semibold mb-4">Your Perfect Reward</h3>

            {generatedExperience ? (
              <Card className="overflow-hidden border-amber-200">
                <div className="relative h-48 w-full">
                  <Image
                    src={generatedExperience.image || "/placeholder.svg"}
                    alt={generatedExperience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">{generatedExperience.title}</h4>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-sm font-medium">
                      {generatedExperience?.points?.toLocaleString() || '0'} pts
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{generatedExperience.description}</p>
                  <Button className="w-full mt-4 bg-amber-600 hover:bg-amber-700">Save to Wishlist</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                <Sparkles className="h-12 w-12 text-amber-400 mb-4" />
                <p className="text-gray-500">
                  Select your preferences and click "Generate" to see your personalized reward experience.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
