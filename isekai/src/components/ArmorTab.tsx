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

const FormSchema = z.object({
  punct: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  blast: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  force: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  sever: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  heat: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  cryo: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  jolt: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
  virus: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(200, { message: 'Must be below or equal 200.' }),
})

export function ArmorTab() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      punct: 100,
      blast: 100,
      force: 100,
      sever: 100,
      heat: 100,
      cryo: 100,
      jolt: 100,
      virus: 100,
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        All values default to 100 (neutral, equivalent to 0). Positive values
        exceed 100, while negative values are below 100.
      </div>
      <Form {...form}>
        <div className="space-y-6">
          <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="punct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Punct</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Protection against piercing damage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blast</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Protection against "Area of Effect" damage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="force"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Force</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Protection against impact dealing damage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sever"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sever</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Protection against critical damage.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="heat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heat</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Resistance against damage over time debuff.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cryo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cryo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Resistance against frostbites and slow debuff.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
            <FormField
              control={form.control}
              name="jolt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jolt</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Resistance against energy disruption debuff.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="virus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virus</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Resistance against malware and CPU altering debuff.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </Form>
    </div>
  )
}
