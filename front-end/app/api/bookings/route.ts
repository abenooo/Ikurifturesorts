import { NextResponse } from 'next/server'
import { BookingFormData, BookingResponse, TimeSlot } from '@/types/booking'

// Helper function to generate time slots
function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const startHour = 9 // 9 AM
  const endHour = 17 // 5 PM
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Skip 12-13 for lunch break
    if (hour !== 12) {
      const time = `${hour.toString().padStart(2, '0')}:00`
      // Randomly set availability for demo purposes
      // In production, this should check against actual bookings
      slots.push({
        time,
        available: Math.random() > 0.3
      })
    }
  }
  
  return slots
}

export async function POST(request: Request) {
  try {
    const bookingData: BookingFormData = await request.json()

    // Validate required fields
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.time || !bookingData.variant || !bookingData.userId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      } as BookingResponse, { status: 400 })
    }

    // Validate number of guests
    if (bookingData.guests < 1) {
      return NextResponse.json({
        success: false,
        error: 'Invalid number of guests'
      } as BookingResponse, { status: 400 })
    }

    // Validate date range
    const startDate = new Date(bookingData.startDate)
    const endDate = new Date(bookingData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (startDate < today) {
      return NextResponse.json({
        success: false,
        error: 'Start date cannot be in the past'
      } as BookingResponse, { status: 400 })
    }

    if (endDate <= startDate) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date'
      } as BookingResponse, { status: 400 })
    }

    // TODO: In production:
    // 1. Verify all dates in the range are available
    // 2. Check if user has any conflicting bookings
    // 3. Validate the price calculation
    // 4. Process payment if required
    // 5. Store booking in database
    // 6. Send confirmation email
    // 7. Update user's points balance

    // Generate a unique booking ID
    const bookingId = `BK${Date.now()}`

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId
    } as BookingResponse)

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process booking'
    } as BookingResponse, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateStr = searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({
        success: false,
        error: 'Date parameter is required'
      }, { status: 400 })
    }

    const date = new Date(dateStr)
    const timeSlots = generateTimeSlots(date)

    return NextResponse.json({
      success: true,
      timeSlots
    })

  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch time slots'
    }, { status: 500 })
  }
} 