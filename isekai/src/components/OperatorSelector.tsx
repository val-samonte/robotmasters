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
import { operators, type OpKey } from '@/constants/operators'
import { isNumber } from '@/utils/isNumber'

export function OperatorSelector({
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
            ? operators[value as unknown as OpKey].name
            : 'Select Operator'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            if (
              operators[value as unknown as OpKey].name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
              return 1
            return 0
          }}
        >
          <CommandInput placeholder="Search Operator" className="h-9" />
          <CommandList>
            <CommandEmpty>No operator found.</CommandEmpty>
            <CommandGroup>
              {Object.entries(operators).map(([operator, info]) => (
                <CommandItem
                  key={operator}
                  value={operator}
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
                      value + '' === operator ? 'opacity-100' : 'opacity-0'
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
