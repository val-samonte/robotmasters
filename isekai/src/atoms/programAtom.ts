import { atom } from 'jotai'
import { Program } from '@coral-xyz/anchor'
import { anchorProviderAtom } from './anchorProviderAtom'
import type { Robotmasters } from '../sdk/robotmasters'
import idl from '../sdk/robotmasters.json'
import { PublicKey } from '@solana/web3.js'

const robotmastersIdl = idl as Robotmasters
export const PROGRAM_ID = new PublicKey(robotmastersIdl.address)

export const programAtom = atom((get) => {
  const provider = get(anchorProviderAtom)

  return new Program<Robotmasters>(robotmastersIdl, provider)
})
