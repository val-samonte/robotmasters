import { blueprintAtom } from '@/atoms/blueprintAtom'
import { BlueprintTab } from '@/components/BlueprintTab'
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
import { LoaderCircle } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { useParams } from 'react-router'

function WithData({ id }: { id: string }) {
  const data = useAtomValue(blueprintAtom(id))
  const [part, setPart] = useState('weapon')

  if (!data) return null

  return (
    <>
      <PageHeader
        title={`Integrate ${data.name}`}
        breadcrumbs={[
          {
            label: 'Blueprints',
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
      <div className="flex flex-1 flex-col gap-6 p-4 pt-0 max-w-7xl">
        <div className="flex justify-between gap-4">
          <div className="flex gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <img
                src={data.image}
                alt={data.name}
                className="object-contain w-24 h-24 aspect-square"
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl">{data.name}</h1>
              <div className="text-sm text-muted-foreground">{id}</div>
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

        <Tabs defaultValue="details" className="w-full gap-6">
          <TabsList className="w-full">
            <TabsTrigger value="blueprint">Blueprint</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {part === 'head' && <TabsTrigger value="cpu">CPU</TabsTrigger>}
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="armor">Armor</TabsTrigger>
          </TabsList>
          <TabsContent value="blueprint">
            <BlueprintTab id={id} />
          </TabsContent>
          <TabsContent value="details"></TabsContent>
          {part === 'head' && <TabsContent value="cpu"></TabsContent>}
          <TabsContent value="actions"></TabsContent>
          <TabsContent value="armor"></TabsContent>
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
