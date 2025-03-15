import { SpriteText, SpriteTextProps } from './SpriteText'

export interface IconProps extends SpriteTextProps {}

export function Icon({ spriteUrl, ...restProps }: IconProps) {
  return <SpriteText spriteUrl="/icons.png" {...restProps} />
}
