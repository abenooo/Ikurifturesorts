"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface GuestSelectorProps {
  guests: number
  setGuests: (guests: number) => void
  maxGuests: number
}

export function GuestSelector({ guests, setGuests, maxGuests }: GuestSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Number of Guests</Label>
      <Input
        type="number"
        min={1}
        max={maxGuests}
        value={guests}
        onChange={(e) => {
          const value = Number.parseInt(e.target.value)
          if (!isNaN(value) && value >= 1 && value <= maxGuests) {
            setGuests(value)
          }
        }}
      />
      <p className="text-xs text-muted-foreground">Maximum {maxGuests} guests allowed</p>
    </div>
  )
}
