import { useEffect, useRef, useState } from 'react'
import { generateKeyPair, getAddressFromPublicKey } from '@solana/kit'
import { install } from '@solana/webcrypto-ed25519-polyfill'
import { Slice9 } from '../components/Slice9'
import { SpriteText } from '../components/SpriteText'
import bs58 from 'bs58'

install()

export function CreateGameAccount() {
  const started = useRef(false)
  const [status, setStatus] = useState('GENERATING GAME KEYPAIR')
  const [kp, setKp] = useState<CryptoKeyPair | null>(null)
  // const [address, setAddress] = useState('')

  useEffect(() => {
    if (started.current) return
    started.current = true
    const gen = async () => {
      const kp = await generateKeyPair()
      setKp(kp)
      const address = await getAddressFromPublicKey(kp.publicKey)

      setStatus('AUTHENTICATING')

      // get nonce
      const nonceResponse = await fetch(
        `${import.meta.env.VITE_WORKER_URL}/auth?public_key=${address}`
      )
      const nonceJSON = await nonceResponse.json()
      const { nonce } = nonceJSON

      // get access token
      const nonceBytes = new TextEncoder().encode(nonce)
      const signature = await crypto.subtle.sign(
        'Ed25519',
        kp.privateKey,
        nonceBytes
      )
      const signatureBase58 = bs58.encode(new Uint8Array(signature))

      const tokenResponse = await fetch(
        `${import.meta.env.VITE_WORKER_URL}/auth?public_key=${address}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature: signatureBase58, nonce }),
        }
      )
      const tokenJson = await tokenResponse.json()
      const { token } = tokenJson

      setStatus('AWAITING SOL AIRDROP')

      // setStatus('CREATING ON-CHAIN GAME ACCOUNT')
    }
    gen()
  }, [])

  // airdrop sol
  // create on-chain account
  return (
    <div className="w-full h-full items-center justify-center p-[1rem] flex flex-col">
      <Slice9>
        <div className="p-[1rem]">
          <SpriteText>{status}</SpriteText>
        </div>
      </Slice9>
    </div>
  )
}

// import { generateKeyPair } from '@solana/kit';

// const keypair = await generateKeyPair();
// const nonceBytes = new TextEncoder().encode(nonce);
// const signature = await crypto.subtle.sign('Ed25519', keypair.privateKey, nonceBytes);
// const signatureBase58 = bs58.encode(signature);

// const postResponse = await fetch(`${import.meta.env.VITE_WORKER_URL}/session?public_key=${publicKey}`, {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ signature: signatureBase58, nonce }),
// });
// const { token } = await postResponse.json();
