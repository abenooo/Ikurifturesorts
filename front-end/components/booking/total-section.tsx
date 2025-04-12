import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TotalSectionProps {
  total: number
  isLoading: boolean
  onBook: () => void
  disabled: boolean
}

export function TotalSection({ total, isLoading, onBook, disabled }: TotalSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Total</span>
        <span className="text-2xl font-bold">${total.toFixed(2)}</span>
      </div>
      <Button
        className="w-full bg-amber-600 hover:bg-amber-700"
        onClick={onBook}
        disabled={isLoading || disabled}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Booking"
        )}
      </Button>
    </div>
  )
} 