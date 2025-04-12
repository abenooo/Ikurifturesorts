import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Gift } from "lucide-react"
import { ServiceDetails } from "@/types/booking"
import { DateTimeSelector } from "./date-time-selector"
import { VariantSelector } from "./variant-selector"
import { GuestSelector } from "./guest-selector"
import { RewardsSection } from "./rewards-section"
import { TotalSection } from "./total-section"

interface BookingFormProps {
  service: ServiceDetails
  userPoints: number
}

export function BookingForm({ service, userPoints }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [guests, setGuests] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(service.variants[0])
  const [isLoading, setIsLoading] = useState(false)
  const [usePoints, setUsePoints] = useState(false)

  const calculateTotal = () => {
    const baseTotal = service.basePrice * selectedVariant.priceMultiplier * guests
    if (usePoints) {
      const pointsDiscount = Math.min(userPoints, baseTotal * 0.2)
      return baseTotal - pointsDiscount
    }
    return baseTotal
  }

  const calculateRewardPoints = () => {
    return (service.rewardPoints + selectedVariant.bonusPoints) * guests
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date: selectedDate,
          time: selectedTime,
          guests,
          variant: selectedVariant.name,
          usePoints,
          total: calculateTotal(),
          earnedPoints: calculateRewardPoints(),
        }),
      })

      if (!response.ok) throw new Error("Booking failed")
      router.push("/bookings/success")
    } catch (error) {
      alert("Failed to complete booking")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Your Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DateTimeSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />

        <VariantSelector
          variants={service.variants}
          onSelect={(variant: any) => setSelectedVariant(variant)}
        />

        <GuestSelector
          guests={guests}
          setGuests={setGuests}
          maxGuests={service.maxGuests}
        />

        <RewardsSection
          userPoints={userPoints}
          usePoints={usePoints}
          setUsePoints={setUsePoints}
          earnedPoints={calculateRewardPoints()}
        />

        <TotalSection
          total={calculateTotal()}
          isLoading={isLoading}
          onBook={handleBooking}
          disabled={!selectedDate || !selectedTime}
        />
      </CardContent>
    </Card>
  )
} 