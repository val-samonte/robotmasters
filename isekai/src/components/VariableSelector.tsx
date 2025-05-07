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

const options = [
  'vars[0]',
  'vars[1]',
  'vars[2]',
  'vars[3]',
  'vars[4]',
  'vars[5]',
  'vars[6]',
  'vars[7]',
  'fixed[0]',
  'fixed[1]',
  'fixed[2]',
  'fixed[3]',
]

export function VariableSelector({
  id,
  type,
  value,
  setValue,
}: {
  id?: string
  type: number
  value: number | null
  setValue: (val: number | null) => void
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
          {isNumber(value) ? (
            options[value!]
          ) : (
            <span className="opacity-20">Select Variable</span>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            const i = parseInt(value)
            if (i !== null && options[i].includes(search)) return 1
            return 0
          }}
        >
          <CommandInput placeholder="Search Variable" className="h-9" />
          <CommandList>
            <CommandEmpty>No variable found.</CommandEmpty>
            <CommandGroup>
              {options.map((label, i) => {
                if (type === 1 && i >= 8) return null
                if (type === 2 && i < 8) return null
                return (
                  <CommandItem
                    key={label}
                    value={i + ''}
                    onSelect={(currentValue) => {
                      const current = parseInt(currentValue)
                      setValue(current === value ? null : current)
                      setOpen(false)
                    }}
                  >
                    {label}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === i ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
