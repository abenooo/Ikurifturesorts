"use client"

import { useParams } from "next/navigation"
import { ServiceCard } from "@/components/booking/service-card"
import { BookingForm } from "@/components/booking/booking-form"
import { serviceDetails } from "@/data/services" // You'll need to create this

export default function BookingPage() {
  const params = useParams()
  const serviceId = params.serviceId as string
  const service = serviceDetails[serviceId]
  const userPoints = 1500 // This would come from your user context/state

  if (!service) {
    return <div>Service not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ServiceCard service={service} />
        <BookingForm service={service} userPoints={userPoints} />
      </div>
    </div>
  )
} 