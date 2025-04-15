"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ServiceCard } from "@/components/booking/service-card"
import { BookingForm } from "@/components/booking/booking-form"
import { ServiceDetails } from "@/types/booking"
import { useUserStore } from '@/store/userStore'


export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<ServiceDetails | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const { user, token, setUser, clearUser } = useUserStore()

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceId = params.serviceId as string
        console.log('sssssrrrrr',)
        const response = await fetch(`https://i-kuriftu.onrender.com/api/services/${serviceId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch service details')
        }
        const data = await response.json()
        
        // Transform the response to match ServiceDetails type
        const transformedService: ServiceDetails = {
          id: data._id,
          name: data.name,
          description: data.description,
          images: data.images,
          duration: data.duration,
          basePrice: data.price,
          maxGuests: data.maxGuests,
          rewardPoints: data.rewardPoints,
          variants: data.variants?.map((variant: any) => ({
            id: variant._id,
            name: variant.name,
            description: variant.description,
            basePrice: variant.basePrice,
            pointsPerGuest: variant.pointsPerGuest,
            maxGuests: variant.maxGuests,
            priceMultiplier: variant.priceMultiplier,
            bonusPoints: variant.bonusPoints
          })) || []
        }
        
        setService(transformedService)

        // Fetch user points from localStorage
        const storedUser = localStorage.getItem("kuriftuUser")
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUserData(parsedUser)
            // Access the nested user object
            const actualUser = parsedUser.state?.user?.user || parsedUser.user || parsedUser
            const actualToken = parsedUser.state?.user?.token || parsedUser.token
            console.log(actualUser)
            if (actualUser) {
              setUser(actualUser, actualToken)
            }
          } catch (e) {
            console.error("Failed to parse user data", e)
          }
        }
        // const userData = localStorage.getItem('kuriftuUser')
        // if (userData) {
        //   const { points } = JSON.parse(userData)
        //   console.log(points)
        //   setUserPoints(points || 0)
        // }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchService()
  }, [params.serviceId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <p className="mt-2 text-gray-600">{error}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Go back
        </button>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Service Not Found</h2>
        <p className="mt-2 text-gray-600">The requested service could not be found.</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Go back
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-stone-50">
      <div className="container px-4 md:px-6">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <ServiceCard service={service} />
          <BookingForm service={service} userPoints={user?.loyaltyPoints} />
        </div>
      </div>
    </div>
  )
} 