import { useMemo, useState } from 'react'
import { ConditionSelector } from './ConditionSelector'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import {
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useSortable } from '@dnd-kit/sortable'
import { GripVertical, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu'

interface Cond {
  id: number
  name: string
  mul: number
}

const DragHandle = ({ id }: { id: number }) => {
  const { attributes, listeners } = useSortable({
    id,
  })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="cursor-grab size-7 text-muted-foreground hover:bg-transparent"
    >
      <GripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const DraggableRow = ({ row }: { row: Row<Cond> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <tr
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      data-slot="table-row"
      ref={setNodeRef}
      className={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        'relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80'
      )}
      style={{
        transform: transform ? CSS.Transform.toString(transform) : 'none',
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </tr>
  )
}

export function CpuTab() {
  const [selection, setSelection] = useState<number | null>(null)

  const columns = useMemo<ColumnDef<Cond>[]>(
    () => [
      {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        accessorKey: 'slot',
        header: 'Slot',
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'mul',
        header: () => 'Mul',
      },
      {
        accessorKey: 'name',
        header: () => 'Condition Name',
      },
      {
        id: 'actions',
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-end">
                <Button
                  variant="ghost"
                  className="cursor-pointer flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                  size="icon"
                >
                  <MoreVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem>Remove</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )

  const [data, setData] = useState<Cond[]>([
    {
      id: 0x01,
      mul: 1,
      name: 'Always',
    },
    {
      id: 0x02,
      mul: 1,
      name: 'Grounded',
    },
  ])

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id),
    [data]
  )

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(), //required because row indexes will change
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>

      <div className="flex gap-2 items-center mt-auto">
        <ConditionSelector setValue={setSelection} value={selection} />
        <Button>Add Condition</Button>
      </div>
    </div>
  )
}
