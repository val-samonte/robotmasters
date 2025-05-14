import { atom } from 'jotai'
import { Program } from '@coral-xyz/anchor'
import { anchorProviderAtom } from './anchorProviderAtom'
import type { Itembox } from '../sdk/itembox'
import idl from '../sdk/itembox.json'
import { PublicKey } from '@solana/web3.js'

const itemBoxIdl = idl as Itembox
export const ITEMBOX_PROGRAM_ID = new PublicKey(itemBoxIdl.address)

export const itemboxProgramAtom = atom((get) => {
  const provider = get(anchorProviderAtom)

  return new Program<Itembox>(itemBoxIdl, provider)
})
