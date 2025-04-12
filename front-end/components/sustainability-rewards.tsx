"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Leaf, Droplets, Recycle, Sun, AlertCircle, CheckCircle2, CloudCog, Loader2 } from "lucide-react"
import { useUserStore } from "@/store/userStore"
import { toast } from "sonner"

interface EcoAction {
  id: string
  icon: React.ReactNode
  title: string
  points: number
  description: string
}

const actionIcons = {
  towels: <Droplets className="h-5 w-5" />,
  housekeeping: <Recycle className="h-5 w-5" />,
  solar: <Sun className="h-5 w-5" />,
  local: <Leaf className="h-5 w-5" />
}

export default function SustainabilityRewards() {
  const [points, setPoints] = useState(0)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [ecoActions, setEcoActions] = useState<EcoAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, token } = useUserStore()

  useEffect(() => {
    const fetchGreenPoints = async () => {
      if (!token) return;

      try {
        const [actionsResponse, pointsResponse] = await Promise.all([
          fetch("https://i-kuriftu.onrender.com/api/green-points/actions", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }),
          fetch("https://i-kuriftu.onrender.com/api/green-points/my-points", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          })
        ]);

        if (!actionsResponse.ok || !pointsResponse.ok) {
          throw new Error('Failed to fetch green points data');
        }

        const actionsData = await actionsResponse.json();
        const pointsData = await pointsResponse.json();

        console.log('Actions Data:', actionsData);
        console.log('Points Data:', pointsData);

        // Transform actions data to include icons
        const transformedActions = actionsData.map((action: any) => ({
          ...action,
          icon: actionIcons[action.id as keyof typeof actionIcons]
        }));

        setEcoActions(transformedActions);
        // Ensure we're using the correct points value
        const totalPoints = pointsData.totalPoints || 0;
        setPoints(totalPoints);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error fetching green points:", error);
        toast.error("Failed to load green points data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGreenPoints();
  }, [token]);

  const handleActionToggle = (actionId: string) => {
    if (!token) {
      setShowAuthPopup(true);
      return;
    }

    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  }

  const handleLinkStay = async () => {
    if (!token) {
      setShowAuthPopup(true);
      return;
    }

    setIsSubmitting(true);
    try {
      let totalPointsEarned = 0;
      // Submit all selected actions
      for (const actionId of selectedActions) {
        const action = ecoActions.find((a) => a.id === actionId);
        if (!action) continue;

        const response = await fetch("https://i-kuriftu.onrender.com/api/green-points/submit", {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action: actionId,
            description: action.description
          })
        });

        if (!response.ok) {
          throw new Error('Failed to submit green action');
        }

        const data = await response.json();
        totalPointsEarned += action.points;
      }

      // Update points after all actions are submitted
      setPoints(prevPoints => prevPoints + totalPointsEarned);
      toast.success(`Successfully earned ${totalPointsEarned} green points!`);
      setSelectedActions([]);
      setIsAuthenticated(true);
      setShowAuthPopup(false);
    } catch (error) {
      console.error("Error submitting green actions:", error);
      toast.error("Failed to submit green actions");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleAuthSubmit = () => {
    // Simulate authentication
    setIsAuthenticated(true)
    setShowAuthPopup(false)
  }

  const progressPercentage = Math.min((points / 500) * 100, 100)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

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
            {selectedActions.length > 0 ? (
              <Button 
                onClick={handleLinkStay} 
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Linking Actions...
                  </>
                ) : (
                  `Link Selected Actions (${selectedActions.length})`
                )}
              </Button>
            ) : isAuthenticated ? (
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
