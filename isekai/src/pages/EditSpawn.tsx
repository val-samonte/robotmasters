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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { elements } from '@/constants/elements'

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(12, { message: 'Name must be less than or equal to 12 characters.' }),
  health_cap: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  duration: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(3840, { message: 'Must be below 3840.' }),
  damage_base: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  damage_range: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  crit_chance: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(100, { message: 'Must be below or equal 100.' }),
  crit_multiplier: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  element: z.number().min(1).max(8),
  destroy_on_collision: z.boolean(),
  width: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  height: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  output_x: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
  output_y: z
    .number()
    .min(0, {
      message: 'Must be positive.',
    })
    .max(255, { message: 'Must be below 256.' }),
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

export function EditSpawn() {
  const { id } = useParams()
  const [behaviorScript, setBehaviorScript] = useState<(number | null)[][]>([
    [],
  ])
  const [collisionScript, setCollisionScript] = useState<(number | null)[][]>([
    [],
  ])
  const [despawnScript, setDespawnScript] = useState<(number | null)[][]>([[]])
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      health_cap: 1,
      duration: 0,
      damage_base: 0,
      damage_range: 0,
      crit_chance: 0,
      crit_multiplier: 100,
      destroy_on_collision: false,
      element: 1,
      width: 4,
      height: 4,
      output_x: 0,
      output_y: 0,
      args0: 0,
      args1: 0,
      args2: 0,
      args3: 0,
    },
  })

  const showCrit = form.watch('element') === 4

  // function onSubmit(data: z.infer<typeof FormSchema>) {}

  return (
    <>
      <PageHeader
        breadcrumbs={[
          {
            label: 'Spawns',
            link: '/spawns',
          },
        ]}
        title={id?.toLowerCase() === 'new' ? 'New' : id ?? ''}
      >
        <Button asChild>
          <Link to="/spawns/new">Create Spawn</Link>
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
                  <FormLabel>Spawn Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="health_cap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Health</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 space-y-4 items-center">
              <FormField
                control={form.control}
                name="destroy_on_collision"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Destroy on collision</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="element"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Element</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(parseInt(val) + 1)}
                      defaultValue={field.value - 1 + ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {elements.map((name, i) => (
                          <SelectItem key={i} value={i + ''}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="damage_base"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Damage</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="damage_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Damage Range</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Bonus random value on top of Base Damage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {showCrit && (
              <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="damage_base"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critical Chance</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        In percentage, 0 to 100.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="damage_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Critical Multiplier</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        In percentage, just provide the additional bonus damage
                        (ie. 20 for 120%).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
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
                name="output_x"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output X</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="output_y"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Output Y</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
          <Label>Behavior Script</Label>
          <ScriptHelper
            segments={behaviorScript}
            onChange={setBehaviorScript}
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <Label>Collision Script</Label>
          <ScriptHelper
            segments={collisionScript}
            onChange={setCollisionScript}
          />
        </div>
        <Separator />
        <div className="flex flex-col gap-4">
          <Label>Despawn Script</Label>
          <ScriptHelper segments={despawnScript} onChange={setDespawnScript} />
        </div>
      </div>
    </>
  )
}
