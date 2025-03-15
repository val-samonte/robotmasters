import { itemDetails } from '../itemList'
import { Slice9 } from './Slice9'

export interface ItemPreviewProps {
  id: string
  onClick: (id: string) => void
  selected?: boolean
}

export function ItemPreview({ id, selected, onClick }: ItemPreviewProps) {
  return (
    <button onClick={() => onClick(id)} className="cursor-pointer">
      <Slice9 frameUrl={selected ? '/select.png' : '/transparent.png'}>
        <img
          src={itemDetails[id].details.img}
          alt={itemDetails[id].name}
          className={
            itemDetails[id].type === 'weapon'
              ? 'w-[8rem] h-[4rem]'
              : 'w-[4rem] h-[4rem]'
          }
          draggable={false}
        />
      </Slice9>
    </button>
  )
}
