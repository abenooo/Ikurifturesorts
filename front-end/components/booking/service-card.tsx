import { ServiceDetails } from '@/types/booking'
import Image from 'next/image'

interface ServiceCardProps {
  service: ServiceDetails
}

export function ServiceCard({ service }: ServiceCardProps) {
  const defaultImage = '/images/placeholder-service.jpg' // Fallback image

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative w-full h-[300px]">
        <Image
          src={service.images?.[0] || defaultImage}
          alt={service.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
        <p className="mt-2 text-gray-600">{service.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Duration:</span>
            <span className="ml-2">{service.duration}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Max Guests:</span>
            <span className="ml-2">{service.maxGuests}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Base Price:</span>
            <span className="ml-2">${service.basePrice}</span>
          </div>
          <div className="flex items-center text-sm text-green-600">
            <span className="font-medium">Reward Points:</span>
            <span className="ml-2">{service.rewardPoints} points</span>
          </div>
        </div>
      </div>
    </div>
  )
} 