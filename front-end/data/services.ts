import { ServiceDetails } from "@/types/booking"

export const serviceDetails: Record<string, ServiceDetails> = {
  spa: {
    id: "spa",
    title: "Spa & Wellness",
    description: "Relax and rejuvenate with our signature spa treatments",
    basePrice: 80,
    image: "/spa-image.jpg",
    rewardPoints: 800,
    duration: "60 mins",
    maxGuests: 2,
    variants: [
      {
        name: "Essential",
        description: "Classic massage treatment",
        priceMultiplier: 1,
        bonusPoints: 0,
      },
      {
        name: "Premium",
        description: "Enhanced treatment with aromatherapy",
        priceMultiplier: 1.5,
        bonusPoints: 200,
      },
      {
        name: "Luxury",
        description: "VIP treatment with private suite",
        priceMultiplier: 2,
        bonusPoints: 500,
      },
    ],
  },
  // Add other services here...
} 