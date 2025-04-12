"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, Recycle, Sun, AlertCircle, CheckCircle2 } from "lucide-react"

interface EcoAction {
  id: string
  icon: React.ReactNode
  title: string
  points: number
  description: string
}

const ecoActions: EcoAction[] = [
  {
    id: "towels",
    icon: <Droplets className="h-5 w-5" />,
    title: "Reuse Towels",
    points: 50,
    description: "Hang your towels to reuse them during your stay",
  },
  {
    id: "housekeeping",
    icon: <Recycle className="h-5 w-5" />,
    title: "Skip Housekeeping",
    points: 100,
    description: "Opt out of daily housekeeping service",
  },
  {
    id: "solar",
    icon: <Sun className="h-5 w-5" />,
    title: "Solar-Powered Boat Tour",
    points: 75,
    description: "Choose our eco-friendly solar boat tour option",
  },
  {
    id: "local",
    icon: <Leaf className="h-5 w-5" />,
    title: "Local Food Options",
    points: 60,
    description: "Choose meals prepared with locally-sourced ingredients",
  },
]

export default function SustainabilityRewards() {
  const [points, setPoints] = useState(0)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleActionToggle = (actionId: string) => {
    if (selectedActions.includes(actionId)) {
      // Remove action and subtract points
      const action = ecoActions.find((a) => a.id === actionId)
      if (action) {
        setPoints(points - action.points)
      }
      setSelectedActions(selectedActions.filter((id) => id !== actionId))
    } else {
      // Add action and add points
      const action = ecoActions.find((a) => a.id === actionId)
      if (action) {
        setPoints(points + action.points)
      }
      setSelectedActions([...selectedActions, actionId])
    }
  }

  const handleLinkStay = () => {
    setShowAuthPopup(true)
  }

  const handleAuthSubmit = () => {
    // Simulate authentication
    setIsAuthenticated(true)
    setShowAuthPopup(false)
  }

  const progressPercentage = Math.min((points / 500) * 100, 100)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Green Points Counter */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-semibold flex items-center">
                <Leaf className="h-5 w-5 text-emerald-600 mr-2" />
                Green Points
              </h3>
              <span className="text-2xl font-bold text-emerald-600">{points}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Points</span>
                <span>Goal: 500 pts</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-emerald-100" />
              <p className="text-sm text-gray-600">
                {points >= 500 ? (
                  <span className="text-emerald-600 font-medium flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Congratulations! You've earned enough points to plant a tree in Ethiopia.
                  </span>
                ) : (
                  `Collect ${500 - points} more points to plant a tree in Ethiopia.`
                )}
              </p>
            </div>
          </div>

          {/* Eco Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {ecoActions.map((action) => (
              <div
                key={action.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedActions.includes(action.id)
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-300"
                }`}
                onClick={() => handleActionToggle(action.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`text-emerald-600 ${selectedActions.includes(action.id) ? "opacity-100" : "opacity-70"}`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{action.title}</h4>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-xs font-medium">
                        +{action.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            {isAuthenticated ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-800 font-medium mb-2">Your stay is linked!</p>
                <p className="text-sm text-gray-600">
                  Your eco-friendly choices during your stay will automatically earn Green Points.
                </p>
              </div>
            ) : (
              <Button onClick={handleLinkStay} className="bg-emerald-600 hover:bg-emerald-700">
                Link Your Stay to Earn Now
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      {showAuthPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Link Your Stay</h3>
              <button onClick={() => setShowAuthPopup(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Enter your reservation details to start earning Green Points during your stay.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reservation Number</label>
                  <input
                    type="text"
                    placeholder="KR12345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Your last name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500">This is a demo. No actual reservation data is required.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAuthPopup(false)}>
                Cancel
              </Button>
              <Button onClick={handleAuthSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                Link Stay
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
