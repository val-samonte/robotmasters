import { Link } from 'react-router'
import { SpriteText } from '../components/SpriteText'

export function MainScreen() {
  return (
    <div className="flex gap-[2rem] flex-col items-center justify-center h-full">
      <img
        src="/logo.png"
        alt="logo"
        style={{ imageRendering: 'pixelated' }}
        className="h-[8rem] w-[28rem] flex-none"
      />
      <div className="flex flex-col mt-[3em] gap-y-[1.5em] items-center">
        <SpriteText color="#707070">CONTINUE</SpriteText>
        <Link to={'/create'}>
          <SpriteText>NEW GAME</SpriteText>
        </Link>
        <SpriteText color="#707070">LOAD GAME</SpriteText>
      </div>
    </div>
  )
}
