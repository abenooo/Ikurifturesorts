"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { ServiceCard } from "@/components/booking/service-card"
import { BookingForm } from "@/components/booking/booking-form"
import { ServiceDetails } from "@/types/booking"

const API_URL = 'http://localhost:5000'

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState<ServiceDetails | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceId = params.serviceId as string
        const response = await fetch(`${API_URL}/api/services/${serviceId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch service details')
        }
        const data = await response.json()
        setService(data)

        // Fetch user points from localStorage
        const userData = localStorage.getItem('userData')
        if (userData) {
          const { points } = JSON.parse(userData)
          setUserPoints(points || 0)
        }
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
          <BookingForm service={service} userPoints={userPoints} />
        </div>
      </div>
    </div>
  )
} 