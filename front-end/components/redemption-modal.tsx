"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Calendar, MapPin, AlertCircle, Loader2 } from "lucide-react"
import type { Reward } from "@/components/rewards-catalog"

interface RedemptionModalProps {
  isOpen: boolean
  onClose: () => void
  reward: Reward
  userPoints: number
  onConfirm: () => void
}

export default function RedemptionModal({ isOpen, onClose, reward, userPoints, onConfirm }: RedemptionModalProps) {
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [isRedeemed, setIsRedeemed] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState("")

  if (!isOpen) return null

  const handleConfirm = () => {
    setIsRedeeming(true)

    // Simulate API call
    setTimeout(() => {
      setIsRedeeming(false)
      setIsRedeemed(true)

      // Generate a random confirmation code
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      setConfirmationCode(code)

      // Call the parent's onConfirm callback
      onConfirm()
    }, 1500)
  }

  const canRedeem = userPoints >= reward.points

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Redeem Reward</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {isRedeemed ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Redemption Successful!</h3>
            <p className="text-gray-600 mb-6">
              You've successfully redeemed <span className="font-bold">{reward.title}</span>
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-emerald-800 mb-2">Confirmation Details</h4>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Confirmation Code</p>
                    <p className="text-lg font-bold text-emerald-700">{confirmationCode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Valid Until</p>
                    <p className="text-sm">December 31, 2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 p-1.5 rounded-full">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Redeem At</p>
                    <p className="text-sm">Kuriftu Resort Reception or via the mobile app</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              A confirmation email has been sent to your registered email address.
            </p>

            <Button onClick={onClose} className="w-full bg-amber-600 hover:bg-amber-700">
              Done
            </Button>
          </div>
        ) : (
          <div className="p-6">
            <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
              <Image src={reward.image || "/placeholder.svg"} alt={reward.title} fill className="object-cover" />
            </div>

            <h3 className="text-xl font-semibold mb-2">{reward.title}</h3>
            <p className="text-gray-600 mb-4">{reward.description}</p>

            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200 mb-6">
              <div>
                <p className="text-sm text-gray-600">Reward Cost</p>
                <p className="text-lg font-bold text-amber-600">{reward?.points?.toLocaleString() || '0'} points</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Balance</p>
                <p className={`text-lg font-bold ${canRedeem ? "text-emerald-600" : "text-red-600"}`}>
                  {userPoints?.toLocaleString() || '0'} points
                </p>
              </div>
            </div>

            {!canRedeem && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200 mb-6">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Not Enough Points</p>
                  <p className="text-xs text-red-700">
                    You need {((reward?.points || 0) - (userPoints || 0)).toLocaleString()} more points to redeem this reward.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!canRedeem || isRedeeming}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isRedeeming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Redemption"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
