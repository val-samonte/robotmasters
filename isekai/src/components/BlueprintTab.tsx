import { blueprintAtom } from '@/atoms/blueprintAtom'
import { useAtom, useAtomValue } from 'jotai'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { recipesAtom } from '@/atoms/recipesAtom'
import { useEffect } from 'react'

export function BlueprintTab({ id }: { id: string }) {
  const data = useAtomValue(blueprintAtom(id))
  const [recipeIds, reloadRecipes] = useAtom(recipesAtom(data?.id ?? ''))

  useEffect(() => {
    if (data) {
      reloadRecipes()
    }
  }, [data])

  if (!data) return null

  return (
    <div className="flex flex-col gap-4">
      <div>
        {data.nonFungible ? (
          <span>
            <span className="text-blue-400 font-bold">Non-Fungible</span>.&nbsp;
          </span>
        ) : (
          <span>
            <span className="text-red-400 font-bold">
              Fungible - Cannot be used as an item part
            </span>
            .&nbsp;
          </span>
        )}
        {recipeIds.length > 0 && (
          <span>
            This Blueprint has{' '}
            <a
              href={`https://itembox.app/blueprints/${data.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 font-bold"
            >
              {recipeIds.length}
            </a>{' '}
            recipe(s).
          </span>
        )}
      </div>
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
