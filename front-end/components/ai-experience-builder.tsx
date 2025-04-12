"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Wand2, Heart, Share2, ArrowRight } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Preference {
  id: string
  label: string
  icon: string
  description: string
}

interface RewardExperience {
  title: string
  description: string
  points: number
  image: string
  category: string
  duration: string
  location: string
}

const preferences: Preference[] = [
  { 
    id: "spa", 
    label: "Spa Lover",
    icon: "spa",
    description: "Relaxation and wellness experiences"
  },
  { 
    id: "adventure", 
    label: "Adventure Seeker",
    icon: "adventure",
    description: "Thrilling outdoor activities"
  },
  { 
    id: "culture", 
    label: "Cultural Explorer",
    icon: "culture",
    description: "Local traditions and heritage"
  },
  { 
    id: "food", 
    label: "Food Enthusiast",
    icon: "food",
    description: "Culinary experiences and dining"
  },
  { 
    id: "nature", 
    label: "Nature Enthusiast",
    icon: "nature",
    description: "Wildlife and natural beauty"
  },
  { 
    id: "luxury", 
    label: "Luxury Experience",
    icon: "luxury",
    description: "Premium and exclusive services"
  },
]

// Mock AI response data
const rewardExperiences: Record<string, RewardExperience> = {
  spa: {
    title: "Lakeside Spa Retreat",
    description: "Enjoy a full day of pampering with our signature treatments overlooking Lake Koriftu, followed by a private dinner on the shore.",
    points: 1500,
    image: "/images/spa-experience.jpg",
    category: "Wellness",
    duration: "Full Day",
    location: "Lakeside Spa"
  },
  adventure: {
    title: "Sunset Kayak Tour + Lakeside Dinner",
    description: "Paddle across the serene waters of Lake Koriftu at sunset, followed by an exclusive lakeside dinner under the stars.",
    points: 2000,
    image: "/images/adventure-experience.jpg",
    category: "Adventure",
    duration: "Evening",
    location: "Lake Koriftu"
  },
  culture: {
    title: "Ethiopian Coffee Ceremony & Cultural Tour",
    description: "Experience the traditional Ethiopian coffee ceremony and explore local cultural sites with a private guide.",
    points: 1200,
    image: "/images/culture-experience.jpg",
    category: "Culture",
    duration: "Half Day",
    location: "Cultural Center"
  },
  food: {
    title: "Chef's Table Culinary Experience",
    description: "Join our executive chef for a private cooking class featuring Ethiopian cuisine, followed by a multi-course tasting menu.",
    points: 1800,
    image: "/images/food-experience.jpg",
    category: "Culinary",
    duration: "Evening",
    location: "Main Restaurant"
  },
  nature: {
    title: "Bird Watching Expedition & Eco Tour",
    description: "Explore the rich biodiversity around Lake Koriftu with our expert naturalist, spotting rare bird species and learning about local conservation efforts.",
    points: 1000,
    image: "/images/nature-experience.jpg",
    category: "Nature",
    duration: "Morning",
    location: "Nature Reserve"
  },
  luxury: {
    title: "Private Villa Upgrade & Butler Service",
    description: "Upgrade to our exclusive lakeside villa with personal butler service and customized amenities for the duration of your stay.",
    points: 3000,
    image: "/images/luxury-experience.jpg",
    category: "Luxury",
    duration: "Overnight",
    location: "Lakeside Villa"
  },
}

export default function AiExperienceBuilder() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedExperience, setGeneratedExperience] = useState<RewardExperience | null>(null)
  const [isSaved, setIsSaved] = useState(false)

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
    setIsSaved(false)

    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, just use the first selected preference
      const primaryPreference = selectedPreferences[0]
      setGeneratedExperience(rewardExperiences[primaryPreference])
      setIsGenerating(false)
    }, 1500)
  }

  const handleSave = () => {
    setIsSaved(true)
    // Here you would typically make an API call to save the experience
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-background to-secondary/10 rounded-2xl shadow-xl overflow-hidden border border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Preferences Section */}
          <div className="p-8 lg:p-12 bg-gradient-to-br from-background to-secondary/5">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  AI Experience Builder
                </h2>
                <p className="text-muted-foreground">
                  Tell us what you love, and our AI will craft the perfect reward experience just for you.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {preferences.map((preference) => (
                  <motion.div
                    key={preference.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative"
                  >
                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      selectedPreferences.includes(preference.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={preference.id}
                          checked={selectedPreferences.includes(preference.id)}
                          onCheckedChange={(checked) => handlePreferenceChange(preference.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={preference.id} className="cursor-pointer font-medium">
                            {preference.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {preference.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={generateExperience}
                disabled={selectedPreferences.length === 0 || isGenerating}
                className="w-full bg-gradient-to-r from-primary to-primary-foreground hover:from-primary-foreground hover:to-primary transition-all duration-300"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Experience...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate My Perfect Experience
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-8 lg:p-12 bg-gradient-to-br from-secondary/5 to-background">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  Your Perfect Reward
                </h2>
                <p className="text-muted-foreground">
                  Based on your preferences, we've crafted a unique experience just for you.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {generatedExperience ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-none bg-gradient-to-br from-background to-secondary/10 shadow-lg">
                      <div className="relative h-64">
                        <Image
                          src={generatedExperience.image || "/placeholder.svg"}
                          alt={generatedExperience.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <h3 className="text-2xl font-bold text-white">
                                {generatedExperience.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-primary/20 text-primary text-sm rounded-full">
                                  {generatedExperience.category}
                                </span>
                                <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground text-sm rounded-full">
                                  {generatedExperience.duration}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10"
                                onClick={handleSave}
                              >
                                <Heart className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : ""}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/10"
                              >
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <p className="text-muted-foreground">
                          {generatedExperience.description}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Location: {generatedExperience.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              {generatedExperience.points.toLocaleString()} pts
                            </span>
                            <Button variant="outline" className="gap-2">
                              View Details
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-[400px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border rounded-xl"
                  >
                    <Sparkles className="h-12 w-12 text-primary/50 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Experience Generated Yet</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Select your preferences and click "Generate" to see your personalized reward experience.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
