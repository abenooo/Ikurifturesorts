import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift } from "lucide-react"

interface RewardsSectionProps {
  userPoints: number
  usePoints: boolean
  setUsePoints: (use: boolean) => void
  earnedPoints: number
}

export function RewardsSection({
  userPoints,
  usePoints,
  setUsePoints,
  earnedPoints,
}: RewardsSectionProps) {
  return (
    <Card className="bg-amber-50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-medium">Rewards Available</p>
              <p className="text-sm text-amber-700">{userPoints} points available</p>
            </div>
          </div>
          <Button
            variant="outline"
            className={usePoints ? "bg-amber-600 text-white" : ""}
            onClick={() => setUsePoints(!usePoints)}
          >
            {usePoints ? "Points Applied" : "Use Points"}
          </Button>
        </div>
        <p className="text-sm text-amber-700">
          You'll earn {earnedPoints} points with this booking!
        </p>
      </CardContent>
    </Card>
  )
} 