"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, SpadeIcon as Spa, Utensils, Waves, Dumbbell, Coffee, MapPin, Car, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Service {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}

export default function ServicesComponent() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const services: Service[] = [
    {
      icon: <Spa className="h-8 w-8" />,
      title: "Spa & Wellness",
      description: "Indulge in rejuvenating treatments and massages at our luxury spa facilities.",
      link: "#spa",
    },
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Fine Dining",
      description: "Experience exquisite cuisine with breathtaking views at our restaurants.",
      link: "#dining",
    },
    {
      icon: <Waves className="h-8 w-8" />,
      title: "Lakeside Activities",
      description: "Enjoy water sports and recreational activities on our pristine lakes.",
      link: "#activities",
    },
    {
      icon: <Dumbbell className="h-8 w-8" />,
      title: "Fitness Center",
      description: "Stay active in our fully-equipped fitness center with professional trainers.",
      link: "#fitness",
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Coffee Ceremonies",
      description: "Experience authentic Ethiopian coffee ceremonies in a traditional setting.",
      link: "#coffee",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Guided Tours",
      description: "Discover local attractions with our expert guides and curated experiences.",
      link: "#tours",
    },
    {
      icon: <Car className="h-8 w-8" />,
      title: "Airport Transfers",
      description: "Enjoy seamless transportation between the airport and our resorts.",
      link: "#transfers",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Event Spaces",
      description: "Host memorable events in our elegant venues with professional planning services.",
      link: "#events",
    },
  ]

  return (
    <section className="w-full py-12 bg-[#f5f2ea]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-medium tracking-tight">Our Services</h2>
          <p className="text-muted-foreground max-w-[700px]">
            Experience luxury and comfort with our premium resort services designed to make your stay unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className={cn(
                "bg-white border-none shadow-sm transition-all duration-200 group relative overflow-hidden",
                hoveredIndex === index ? "shadow-md" : "",
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardHeader className="pb-2">
                <div className="text-neutral-800 mb-2">{service.icon}</div>
                <CardTitle className="text-xl font-medium">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <CardDescription className="text-neutral-600">{service.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Link
                  href={service.link}
                  className="inline-flex items-center text-sm font-medium text-neutral-800 hover:text-neutral-600"
                >
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            className="border-neutral-800 text-neutral-800 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Book Your Stay <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
