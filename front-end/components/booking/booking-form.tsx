'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Gift } from 'lucide-react'
import { ServiceDetails, ServiceVariant } from '@/types/booking'
import { DateRangePicker } from './date-range-picker'

// Default service variants
const DEFAULT_VARIANTS: ServiceVariant[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Regular booking',
    basePrice: 0, // Will be set based on service price
    pointsPerGuest: 100,
    maxGuests: 4
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Enhanced experience with special perks',
    basePrice: 0, // Will be set based on service price
    pointsPerGuest: 200,
    maxGuests: 6
  }
]

interface BookingFormProps {
  service: ServiceDetails
  userPoints: number
}

export function BookingForm({ service, userPoints }: BookingFormProps) {
  const router = useRouter()
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [selectedTime, setSelectedTime] = useState("")
  const [guests, setGuests] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ServiceVariant>({
    ...DEFAULT_VARIANTS[0],
    basePrice: service.basePrice
  })
  const [isLoading, setIsLoading] = useState(false)
  const [usePoints, setUsePoints] = useState(false)

  // Initialize variants with service price
  const variants: ServiceVariant[] = DEFAULT_VARIANTS.map(variant => ({
    ...variant,
    basePrice: variant.id === 'premium' ? service.basePrice * 1.5 : service.basePrice
  }))

  const calculateTotal = () => {
    if (!dateRange[0] || !dateRange[1]) return 0
    const nights = Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))
    const baseTotal = selectedVariant.basePrice * guests * nights
    if (usePoints) {
      const pointsDiscount = Math.min(userPoints, baseTotal * 0.2)
      return baseTotal - pointsDiscount
    }
    return baseTotal
  }

  const calculateRewardPoints = () => {
    if (!dateRange[0] || !dateRange[1]) return 0
    const nights = Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))
    return selectedVariant.pointsPerGuest * guests * nights
  }

  const handleBooking = async () => {
    if (!dateRange[0] || !selectedTime) {
      alert("Please select dates and time")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          startDate: dateRange[0],
          endDate: dateRange[1],
          time: selectedTime,
          guests,
          variant: selectedVariant.id,
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
        <div>
          <Label>Select Dates</Label>
          <div className="mt-2">
            <DateRangePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={setDateRange}
            />
          </div>
        </div>

        <div>
          <Label>Check-in Time</Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Number of Guests</Label>
          <Input
            type="number"
            min={1}
            max={selectedVariant.maxGuests}
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
          />
        </div>

        <div>
          <Label>Experience Type</Label>
          <Select
            value={selectedVariant.id}
            onValueChange={(value) => 
              setSelectedVariant(variants.find(v => v.id === value) || variants[0])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((variant) => (
                <SelectItem key={variant.id} value={variant.id}>
                  <div>
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-sm text-gray-500">{variant.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="usePoints"
            checked={usePoints}
            onChange={(e) => setUsePoints(e.target.checked)}
          />
          <Label htmlFor="usePoints" className="flex items-center space-x-2">
            <Gift className="h-4 w-4" />
            <span>Use {Math.min(userPoints, calculateTotal() * 0.2)} points for discount</span>
          </Label>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Total Price:</span>
            <span className="font-bold">${calculateTotal()}</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>Points to Earn:</span>
            <span>+{calculateRewardPoints()}</span>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleBooking}
          disabled={!dateRange[0] || !dateRange[1] || !selectedTime || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 