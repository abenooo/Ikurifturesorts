"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface RewardsSectionProps {
  usePoints: boolean
  setUsePoints: (use: boolean) => void
  earnedPoints: number
  userPoints: number
  membershipTier: string
  pointsToUse: number
  maxPointsToUse: number
  onPointsChange: (points: number) => void
}

export function RewardsSection({
  usePoints,
  setUsePoints,
  earnedPoints,
  userPoints,
  membershipTier,
  pointsToUse,
  maxPointsToUse,
  onPointsChange,
}: RewardsSectionProps) {
  const handleSliderChange = (value: number[]) => {
    onPointsChange(value[0])
  }

  return (
    <Card className="bg-amber-50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Rewards Available</p>
              <p className="text-sm text-amber-700">{userPoints.toLocaleString()} points available</p>
              <p className="text-xs text-amber-600">{membershipTier} Member</p>
            </div>
          </div>
          <Button
            variant="outline"
            className={usePoints ? "bg-amber-600 text-white hover:bg-amber-700" : ""}
            onClick={() => setUsePoints(!usePoints)}
            disabled={userPoints === 0}
          >
            {usePoints ? "Points Applied" : "Use Points"}
          </Button>
        </div>

        {usePoints && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Points to use:</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={maxPointsToUse}
                  value={pointsToUse}
                  onChange={(e) => {
                    const value = Math.min(Number(e.target.value), maxPointsToUse)
                    onPointsChange(Math.max(0, value))
                  }}
                  className="w-24 h-8"
                />
                <span className="text-sm">/ {maxPointsToUse.toFixed(0)}</span>
              </div>
            </div>
            {maxPointsToUse > 0 && (
              <>
                <Slider
                  value={[pointsToUse]}
                  onValueChange={handleSliderChange}
                  max={maxPointsToUse}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-amber-600">
                  Using {pointsToUse} points (${pointsToUse.toFixed(2)} discount)
                </p>
              </>
            )}
          </div>
        )}

        {earnedPoints > 0 && (
          <p className="text-sm text-amber-700 mt-4">
            You'll earn {earnedPoints.toLocaleString()} points with this booking!
          </p>
        )}
      </CardContent>
    </Card>
  )
}