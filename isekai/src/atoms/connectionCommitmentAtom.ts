import { atom } from 'jotai'
import type { Commitment } from '@solana/web3.js'

export const connectionCommitmentAtom = atom<Commitment>('confirmed')
