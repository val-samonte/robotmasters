export interface CharacterPreviewProps {
  body: string
  head: string
  legs: string
  weapon: string
}

export function CharacterPreview({
  body,
  head,
  legs,
  weapon,
}: CharacterPreviewProps) {
  const weapon_type = weapon.split('_')[0]
  const arm = [weapon_type, body].join('_')

  return (
    <div className="relative w-[4rem] h-[4rem] overflow-hidden">
      <img
        src={`/skins/body_${body}.png`}
        className="absolute w-[12rem] h-[12rem] max-w-none"
        draggable="false"
      />
      <img
        src={`/skins/legs_${legs}.png`}
        className="absolute w-[12rem] h-[12rem] max-w-none"
        draggable="false"
      />
      <img
        src={`/skins/head_${head}.png`}
        className="absolute w-[12rem] h-[12rem] max-w-none"
        draggable="false"
      />
      <img
        src={`/skins/${weapon}.png`}
        className="absolute w-[12rem] h-[12rem] max-w-none"
        draggable="false"
      />
      <img
        src={`/skins/arms_${arm}.png`}
        className="absolute w-[12rem] h-[12rem] max-w-none"
        draggable="false"
      />
    </div>
  )
}
