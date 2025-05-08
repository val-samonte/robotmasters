import { ScriptHelper } from '@/components/ScriptHelper'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { splitScriptToSegments } from '@/utils/splitScriptToSegments'
import { useState } from 'react'
import { Link, useParams } from 'react-router'

// #[derive(Serialize, Deserialize)]
// pub struct Condition {
//     pub id: ConditionId,
//     pub energy_mul: Fixed,
//     pub args: [u8; 4],   // arguments for the script to use
//     pub script: Vec<u8>, // if size is 1, use standard lookup
// }

const sampleAction = splitScriptToSegments([
  19, 0, 45, 17, 0, 0, 0, 23, 0, 0, 0, 20, 27, 0, 19, 0, 35, 19, 1, 36, 21, 3,
  2, 34, 2, 0, 1, 71, 2, 2, 3, 17, 2, 97, 0, 0, 21, 4, 0, 21, 5, 3, 21, 6, 1,
  19, 7, 38, 19, 0, 47, 19, 1, 11, 32, 2, 0, 1, 71, 2, 2, 5, 17, 2, 96, 20, 13,
  4, 0, 1, 19, 0, 13, 74, 0, 0, 6, 20, 13, 0, 73, 2, 0, 7, 32, 2, 2, 4, 17, 2,
  0, 1, 19, 0, 35, 19, 1, 36, 19, 2, 37, 69, 0, 0, 2, 81, 0, 0, 1, 20, 35, 0, 0,
  1,
])

export function EditCondition() {
  const { id } = useParams()
  const [script, setScript] = useState<(number | null)[][]>(sampleAction)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/conditions">Conditions</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {id?.toLowerCase() === 'new' ? 'New' : id}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="pr-4">
          <Button asChild>
            <Link to="/conditions/new">Save</Link>
          </Button>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <ScriptHelper segments={script} onChange={setScript} />
      </div>
    </>
  )
}
