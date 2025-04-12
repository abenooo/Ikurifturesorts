export interface ServiceDetails {
  id: string
  title: string
  description: string
  basePrice: number
  image: string
  rewardPoints: number
  duration: string
  maxGuests: number
  variants: {
    name: string
    description: string
    priceMultiplier: number
    bonusPoints: number
  }[]
} 