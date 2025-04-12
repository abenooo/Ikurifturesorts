import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, Users, Star } from "lucide-react"
import { ServiceDetails } from "@/types/booking"

interface ServiceCardProps {
  service: ServiceDetails
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{service.title}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm">{service.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-amber-600" />
            <span className="text-sm">Max {service.maxGuests}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-600" />
            <span className="text-sm">+{service.rewardPoints} pts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 