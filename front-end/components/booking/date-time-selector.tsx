import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DateTimeSelectorProps {
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
}

export function DateTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: DateTimeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          disabled={(date) => date < new Date()}
        />
      </div>

      <div className="space-y-2">
        <Label>Select Time</Label>
        <Select onValueChange={setSelectedTime}>
          <SelectTrigger>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="09:00">09:00 AM</SelectItem>
            <SelectItem value="11:00">11:00 AM</SelectItem>
            <SelectItem value="14:00">02:00 PM</SelectItem>
            <SelectItem value="16:00">04:00 PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 