import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
const FormSchema = z.object({
  health: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  weight: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  power: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  energy: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  energy_regen: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  energy_rate: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
})

export function DetailsTab({ part }: { part: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      health: 0,
      weight: 0,
      power: 0,
      energy: 0,
      energy_rate: 0,
      energy_regen: 0,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <div className="space-y-6">
          <div
            className={cn(
              part === 'weapon' ? 'grid-cols-1' : 'grid-cols-2',
              'grid  portrait:grid-cols-1 gap-4 items-start'
            )}
          >
            {part !== 'weapon' && (
              <FormField
                control={form.control}
                name="health"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Health</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {part === 'body' && (
            <>
              <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="energy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Energy</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="power"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Power</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="energy_regen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Energy Regeneration Amount</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        How much energy to gain per tick.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="energy_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Energy Regeneration Rate</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        How many frames for a tick. 60 frames is 1 second.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  )
}
