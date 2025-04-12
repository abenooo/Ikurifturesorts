'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceDetails, BookingFormData } from '@/types/booking'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface BookingFormProps {
  service: ServiceDetails
  userPoints: number
}

export default function BookingForm({ service, userPoints }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [guests, setGuests] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(service.variants[0].name)
  const [totalPrice, setTotalPrice] = useState(service.basePrice)
  const [totalPoints, setTotalPoints] = useState(service.rewardPoints)

  // Calculate available times for the selected date
  const getAvailableTimes = (date: Date) => {
    // TODO: Implement actual availability check from backend
    return ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
  }

  // Update total price and points when form values change
  useEffect(() => {
    const variant = service.variants.find(v => v.name === selectedVariant)
    if (variant) {
      const basePrice = service.basePrice * guests
      const finalPrice = basePrice * variant.priceMultiplier
      const finalPoints = service.rewardPoints + variant.bonusPoints

      setTotalPrice(finalPrice)
      setTotalPoints(finalPoints)
    }
  }, [guests, selectedVariant, service])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time')
      return
    }

    const bookingData: BookingFormData = {
      startDate: selectedDate,
      endDate: selectedDate,
      time: selectedTime,
      guests,
      variant: selectedVariant,
      totalPrice,
      totalPoints
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/bookings/${result.bookingId}`)
      } else {
        alert(result.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('An error occurred while creating your booking')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          minDate={new Date()}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholderText="Select date"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Time</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          disabled={!selectedDate}
        >
          <option value="">Select time</option>
          {selectedDate && getAvailableTimes(selectedDate).map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Guests</label>
        <input
          type="number"
          min={1}
          max={service.maxGuests}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Service Type</label>
        <select
          value={selectedVariant}
          onChange={(e) => setSelectedVariant(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {service.variants.map(variant => (
            <option key={variant.name} value={variant.name}>
              {variant.name} - {variant.description}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Price:</span>
          <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-700">Points to Earn:</span>
          <span className="text-lg font-semibold text-green-600">{totalPoints} points</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-medium text-gray-700">Your Current Points:</span>
          <span className="text-lg font-semibold text-blue-600">{userPoints} points</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Confirm Booking
      </button>
    </form>
  )
} 