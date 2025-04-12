import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceDetails } from "@/types/booking"

interface VariantSelectorProps {
  variants: ServiceDetails["variants"]
  onSelect: (variant: ServiceDetails["variants"][0]) => void
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Experience Level</Label>
      <Select onValueChange={(value) => onSelect(variants.find(v => v.name === value)!)}>
        <SelectTrigger>
          <SelectValue placeholder="Select experience" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant.name} value={variant.name}>
              {variant.name} - {variant.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 