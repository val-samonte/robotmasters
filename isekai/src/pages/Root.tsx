import { Button } from '@/components/ui/button'
import { Outlet } from 'react-router'

export function Root() {
  return (
    <div>
      <Button variant={'destructive'}>Test</Button>
      <Outlet></Outlet>
    </div>
  )
}
