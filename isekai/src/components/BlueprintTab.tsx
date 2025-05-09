import { blueprintAtom } from '@/atoms/blueprintAtom'
import { useAtomValue } from 'jotai'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function BlueprintTab({ id }: { id: string }) {
  const data = useAtomValue(blueprintAtom(id))

  if (!data) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 portrait:grid-cols-1 gap-4 items-start">
        <div className="grid gap-2">
          <Label>Owner</Label>
          <Input value={data.authority} readOnly />
        </div>
        <div className="grid gap-2">
          <Label>Mint Authority</Label>
          <Input value={data.mintAuthority} readOnly />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Input value={data.description} readOnly />
      </div>
    </div>
  )
}
