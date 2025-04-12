export interface ServiceVariant {
  id: string
  name: string
  description: string
  basePrice: number
  pointsPerGuest: number
  maxGuests: number
  priceMultiplier: number
  bonusPoints: number
}

export interface ServiceDetails {
  id: string
  title: string
  description: string
  images?: string[]
  duration: string
  basePrice: number
  maxGuests: number
  rewardPoints: number
  variants: ServiceVariant[]
}

export interface BookingFormData {
  startDate: Date | null
  endDate: Date | null
  time: string
  guests: number
  variant: string
  totalPrice: number
  totalPoints: number
  notes?: string
  userId?: string
}

export interface BookingResponse {
  success: boolean
  message?: string
  error?: string
  bookingId?: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Booking extends BookingFormData {
  id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
} 