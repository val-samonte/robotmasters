import { atom } from 'jotai'

export const helpTipAtom = atom<{
  title?: string
  message: string
} | null>(null)
