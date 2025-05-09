import { userBlueprintsAtom } from '@/atoms/userBlueprintsAtom'
import { useUserWallet } from '@/atoms/userWalletAtom'
import { BlueprintsGrid } from '@/components/BlueprintGrid'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export function Blueprints() {
  const wallet = useUserWallet()
  const [blueprintIds, loadIds] = useAtom(
    userBlueprintsAtom(wallet?.publicKey?.toBase58() ?? '')
  )

  useEffect(() => {
    if (wallet?.publicKey) {
      loadIds()
    }
  }, [wallet, loadIds])

  return (
    <>
      <PageHeader title="Blueprints" breadcrumbs={[]}>
        <Button asChild>
          <a
            href="https://itembox.app/blueprints"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create Blueprint
          </a>
        </Button>
      </PageHeader>
      <div className="pb-5">
        <BlueprintsGrid
          ids={blueprintIds}
          whenEmpty={
            <div className="flex flex-col gap-10 items-center justify-center text-center">
              <span className="opacity-50 text-lg">
                You do not have any Blueprints yet!
              </span>
            </div>
          }
        />
      </div>
    </>
  )
}
