import { Slice9 } from '../components/Slice9'
import { SpriteText } from '../components/SpriteText'

export function UnderConstruction() {
  return (
    <div className="w-full h-full items-center justify-center p-[1rem] flex flex-col">
      <Slice9>
        <div className="p-[1rem] flex flex-col items-center justify-center gap-[1rem] w-[50vw]">
          <SpriteText>UNDER CONSTRUCTION</SpriteText>
          <div className="flex flex-col justify-center items-center">
            <SpriteText>That's it for now!</SpriteText>
            <SpriteText>For more updates, join us on Telegram!</SpriteText>
          </div>
          <a
            href="https://t.me/+wJfd9xI0_vs1NWI1"
            target="_blank"
            rel="noreferrer noopener"
            className="cursor-pointer"
          >
            <Slice9 frameUrl={'/button.png'}>
              <div className="flex justify-center px-[0.125rem]">
                <SpriteText>JOIN TELEGRAM</SpriteText>
              </div>
            </Slice9>
          </a>
        </div>
      </Slice9>
    </div>
  )
}
