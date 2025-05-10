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
import { isNumber } from '@/utils/isNumber'

const data = {
  0x02: {
    name: 'Ground',
    mul: 1,
  },
  0x03: {
    name: 'W.Lean',
    mul: 1,
  },
  0x04: {
    name: 'W.Slide',
    mul: 1,
  },

  0x05: {
    name: 'Rand5',
    mul: 1,
  },
  0x06: {
    name: 'Rand10',
    mul: 1,
  },
  0x07: {
    name: 'Rand15',
    mul: 1,
  },
  0x08: {
    name: 'Rand20',
    mul: 1,
  },
  0x09: {
    name: 'Rand25',
    mul: 1,
  },
  0x0a: {
    name: 'Battery5',
    mul: 1,
  },
  0x0b: {
    name: 'Battery10',
    mul: 1,
  },
  0x0c: {
    name: 'Battery15',
    mul: 1,
  },
  0x0d: {
    name: 'Battery20',
    mul: 1,
  },
  0x0e: {
    name: 'Battery25',
    mul: 1,
  },
  0x01: {
    name: 'Always',
    mul: 1,
  },
}

type Key = keyof typeof data

export function ConditionSelector({
  id,
  value,
  setValue,
}: {
  id?: string
  value: number | null
  setValue: (value: number | null) => void
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
          className="w-[200px] justify-between"
        >
          {isNumber(value)
            ? data[value as unknown as Key].name
            : 'Select Condition'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            if (
              data[value as unknown as Key].name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
              return 1
            return 0
          }}
        >
          <CommandInput placeholder="Search Condition" className="h-9" />
          <CommandList>
            <CommandEmpty>No condition found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(data).map(([condition, info]) => (
                <CommandItem
                  key={condition}
                  value={condition}
                  onSelect={(currentValue) => {
                    const op = parseInt(currentValue)
                    setValue(isNumber(op) ? op : null)
                    setOpen(false)
                  }}
                >
                  {info.name}
                  <Check
                    className={cn(
                      'ml-auto',
                      value + '' === condition ? 'opacity-100' : 'opacity-0'
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
