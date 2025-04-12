"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServiceVariant } from "@/types/booking"

interface VariantSelectorProps {
  variants: ServiceVariant[]
  onSelect: (variant: ServiceVariant) => void
}

export function VariantSelector({ variants, onSelect }: VariantSelectorProps) {
  // Safety check - if no variants, don't render
  if (!variants || variants.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      <Label>Experience Level</Label>
      <Select
        defaultValue={variants[0].name}
        onValueChange={(value) => {
          const selected = variants.find((v) => v.name === value)
          if (selected) onSelect(selected)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select experience" />
        </SelectTrigger>
        <SelectContent>
          {variants.map((variant) => (
            <SelectItem key={variant.name} value={variant.name}>
              <div>
                <div className="font-medium">{variant.name}</div>
                <div className="text-sm text-gray-500">{variant.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
