'use client'

import { atom, useAtomValue } from 'jotai'
import type { WalletContextState } from '@solana/wallet-adapter-react'

export const userWalletAtom = atom<WalletContextState | null>(null)
export const useUserWallet = () => useAtomValue(userWalletAtom)
