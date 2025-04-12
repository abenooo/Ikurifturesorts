import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (dates: [Date | null, Date | null]) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)

  const handleDateSelect = (date: Date) => {
    if (!startDate || isSelectingEnd) {
      // If no start date or selecting end date, set both dates
      onChange([startDate || date, date])
      setIsSelectingEnd(false)
    } else {
      // If selecting start date
      if (date < startDate) {
        // If selected date is before current start date, make it the new start date
        onChange([date, null])
      } else {
        // Set start date and prepare to select end date
        onChange([startDate, null])
        setIsSelectingEnd(true)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Check-in Date</div>
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              if (date instanceof Date) {
                handleDateSelect(date)
              }
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            placeholderText="Select check-in date"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700 mb-1">Check-out Date</div>
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              if (date instanceof Date && startDate) {
                onChange([startDate, date])
                setIsSelectingEnd(false)
              }
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            placeholderText="Select check-out date"
            disabled={!startDate}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="relative">
        <DatePicker
          inline
          monthsShown={2}
          selected={isSelectingEnd ? endDate : startDate}
          onChange={(date) => {
            if (date instanceof Date) {
              handleDateSelect(date)
            }
          }}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          minDate={new Date()}
        />
        {isSelectingEnd && (
          <div className="absolute top-0 left-0 right-0 bg-indigo-100 bg-opacity-50 p-2 text-center text-sm font-medium text-indigo-800 rounded-t-md">
            Select your check-out date
          </div>
        )}
      </div>

      {startDate && !endDate && (
        <div className="text-sm text-indigo-600">
          Selected check-in: {startDate.toLocaleDateString()}
          {isSelectingEnd && " - Now select your check-out date"}
        </div>
      )}
      {startDate && endDate && (
        <div className="text-sm text-green-600">
          Stay duration: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} nights
        </div>
      )}
    </div>
  )
} 