"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Star } from "lucide-react"

interface Service {
  _id: string
  name: string
  description: string
  category: string
  price: number
  pointsMultiplier: number
  availability: boolean
  images: string[]
  duration: number
  capacity: number
  requirements: string[]
  specialOffers: any[]
}

export default function ServicesShowcase() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
        if (!response.ok) {
          throw new Error('Failed to fetch services')
        }
        const data = await response.json()
        setServices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours > 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="w-full py-16 bg-[#f5f2ea]">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-16 bg-[#f5f2ea]">
        <div className="container px-4 md:px-6">
          <div className="text-center text-red-600">
            <p>Error loading services: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="w-full py-16 bg-[#f5f2ea]">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="flex flex-col overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={service.images[0]}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-amber-600">
                    {service.category}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(service.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Up to {service.capacity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{service.pointsMultiplier}x Points</span>
                  </div>
                  {service.requirements.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Requirements:</h4>
                      <ul className="text-sm text-muted-foreground">
                        {service.requirements.slice(0, 2).map((req, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-neutral-800" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 pt-4">
                <div className="text-lg font-medium text-amber-600">
                  From ${service.price}
                </div>
                <Button 
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => window.location.href = `/book/${service._id}`}
                >
                  Book Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
