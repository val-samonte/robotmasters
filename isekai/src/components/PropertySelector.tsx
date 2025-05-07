import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { properties, type PropKey } from '@/constants/properties'

export function PropertySelector({
  id,
  value,
  setValue,
}: {
  id?: string
  value: string
  setValue: (val: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-72 justify-between"
        >
          {value
            ? properties[value as unknown as PropKey].name
            : 'Select Property'}

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command
          filter={(value, search) => {
            if (
              properties[value as unknown as PropKey].name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
              return 1
            return 0
          }}
        >
          <CommandInput placeholder="Search Property" className="h-9" />
          <CommandList>
            <CommandEmpty>No property found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(properties).map(([operand, info]) => (
                <CommandItem
                  key={operand}
                  value={operand}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                >
                  {info.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === operand ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
