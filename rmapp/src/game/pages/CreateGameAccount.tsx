import { useEffect, useState } from 'react'
import { generateKeyPair, getAddressFromPublicKey } from '@solana/kit'
import { install } from '@solana/webcrypto-ed25519-polyfill'
import { Slice9 } from '../components/Slice9'
import { SpriteText } from '../components/SpriteText'

install()

export function CreateGameAccount() {
  const [kp, setKp] = useState<CryptoKeyPair | null>(null)
  const [address, setAddress] = useState('')
  useEffect(() => {
    const gen = async () => {
      const kp = await generateKeyPair()
      setKp(kp)
      const address = await getAddressFromPublicKey(kp.publicKey)

      setAddress(address)
    }
    gen()
  }, [])

  // airdrop sol
  // create on-chain account
  return (
    <div className="w-full h-full items-center justify-center p-[1rem] flex flex-col">
      <Slice9>
        <div className="p-[1rem]">
          {address ? (
            <SpriteText>{address}</SpriteText>
          ) : (
            <SpriteText>GENERATING GAME KEYPAIR</SpriteText>
          )}
        </div>
      </Slice9>
    </div>
  )
}
