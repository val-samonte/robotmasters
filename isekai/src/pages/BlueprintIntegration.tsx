import { blueprintAtom } from '@/atoms/blueprintAtom'
import { ArmorTab } from '@/components/ArmorTab'
import { BlueprintTab } from '@/components/BlueprintTab'
import { CpuTab } from '@/components/CpuTab'
import { DetailsTab } from '@/components/DetailsTab'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAtomValue, useSetAtom } from 'jotai'
import { LoaderCircle, SquareArrowOutUpRight } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router'

function WithData({ id }: { id: string }) {
  const data = useAtomValue(blueprintAtom(id))
  const [part, setPart] = useState('weapon')

  if (!data) return null

  return (
    <>
      <PageHeader
        title={`${data.name}`}
        breadcrumbs={[
          {
            label: 'Integrate',
            link: '/',
          },
        ]}
      >
        <Button asChild>
          <a
            href="https://itembox.app/blueprints"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create Entry
          </a>
        </Button>
      </PageHeader>
      <div className="flex flex-1 flex-col gap-6 px-4 pb-20 pt-0 max-w-7xl">
        <div className="flex justify-between gap-4">
          <div className="flex portrait:flex-col gap-4 w-full">
            <div className="p-4 bg-muted rounded-lg flex-none flex items-center justify-center">
              <img
                src={data.image}
                alt={data.name}
                className="object-contain w-24 h-24 portrait:w-full portrait:h-auto portrait:max-w-xs aspect-square"
              />
            </div>
            <div className="flex flex-col gap-2 flex-auto">
              <div className="flex justify-between">
                <h1 className="text-2xl text-wrap">{data.name}</h1>
                <Button variant={'link'} asChild>
                  <a
                    href={`https://itembox.app/blueprints/${data.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SquareArrowOutUpRight />
                  </a>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground text-wrap break-all">
                {id}
              </div>
              <div className="flex gap-2 items-center mt-auto">
                <div>Integrate as</div>
                <Select onValueChange={setPart} defaultValue={part}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weapon">Weapon</SelectItem>
                    <SelectItem value="head">Head Part</SelectItem>
                    <SelectItem value="body">Body Part</SelectItem>
                    <SelectItem value="legs">Legs Part</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="blueprint" className="w-full gap-6">
          <TabsList className="w-full">
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {part === 'head' && <TabsTrigger value="cpu">CPU</TabsTrigger>}
            <TabsTrigger value="actions">Actions</TabsTrigger>
            {part !== 'weapon' && (
              <TabsTrigger value="armor">Armor</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="blueprint">
            <BlueprintTab id={id} />
          </TabsContent>
          <TabsContent value="details">
            <DetailsTab part={part} />
          </TabsContent>
          {part === 'head' && (
            <TabsContent value="cpu">
              <CpuTab />
            </TabsContent>
          )}
          <TabsContent value="actions"></TabsContent>
          {part !== 'weapon' && (
            <TabsContent value="armor">
              <ArmorTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  )
}

export function BlueprintIntegration() {
  const { id } = useParams()
  const reload = useSetAtom(blueprintAtom(id ?? ''))

  useEffect(() => {
    reload()
  }, [id])

  if (!id) return null
  return (
    <Suspense fallback={<Skeleton />}>
      <WithData id={id} />
    </Suspense>
  )
}

function Skeleton() {
  return (
    <div className="flex items-center justify-center px-5 h-[30vh]">
      <div className="flex flex-col gap-10 items-center justify-center text-center">
        <LoaderCircle size={64} className="opacity-10 animate-spin" />
      </div>
    </div>
  )
}
