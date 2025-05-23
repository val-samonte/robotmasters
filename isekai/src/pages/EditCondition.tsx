import { ScriptHelper } from '@/components/ScriptHelper'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useParams } from 'react-router'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/PageHeader'

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(12, { message: 'Name must be less than or equal to 12 characters.' }),
  energy_mul: z
    .number()
    .min(0, {
      message: 'Multiplier must be positive.',
    })
    .max(1000, { message: 'Must be below 1000.' }),
  args0: z
    .number()
    .min(0, {
      message: 'Must be positive number.',
    })
    .max(255, { message: 'Must be below 256.' }),
  args1: z
    .number()
    .min(0, {
      message: 'Must be positive number.',
    })
    .max(255, { message: 'Must be below 256.' }),
  args2: z
    .number()
    .min(0, {
      message: 'Must be positive number.',
    })
    .max(255, { message: 'Must be below 256.' }),
  args3: z
    .number()
    .min(0, {
      message: 'Must be positive number.',
    })
    .max(255, { message: 'Must be below 256.' }),
})

export function EditCondition() {
  const { id } = useParams()
  const [script, setScript] = useState<(number | null)[][]>([[]])
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      energy_mul: 100,
      args0: 0,
      args1: 0,
      args2: 0,
      args3: 0,
    },
  })

  // function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <>
      <PageHeader
        breadcrumbs={[
          {
            label: 'Conditions',
            link: '/conditions',
          },
        ]}
        title={id?.toLowerCase() === 'new' ? 'New' : id ?? ''}
      >
        <Button asChild>
          <Link to="/conditions/new">Create Condition</Link>
        </Button>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-7xl">
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="energy_mul"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Cost Multiplier</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    In percentage, so 100 is 1 unit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-4 portrait:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="args0"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>args0</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="args1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>args1</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="args2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>args2</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="args3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>args3</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
        <Separator />
        <div className="flex flex-col gap-4">
          <Label>Script</Label>
          <ScriptHelper segments={script} onChange={setScript} />
        </div>
      </div>
    </>
  )
}
