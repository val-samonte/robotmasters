import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { Keypair } from '@solana/web3.js'
import { expect } from 'chai'
import { deriveComponentControlPda, deriveComponentPda } from './utils'

export let program: Program<Robotmasters>

export const itemAuthority = Keypair.generate()
export const treasury = Keypair.generate()

export let adminPda: anchor.web3.PublicKey
export let matchCounterPda: anchor.web3.PublicKey
export let itemManagerPda: anchor.web3.PublicKey
export let condPda: anchor.web3.PublicKey
export let condControlPda: anchor.web3.PublicKey
export let actionPda: anchor.web3.PublicKey
export let actionControlPda: anchor.web3.PublicKey
export let spawnPda: anchor.web3.PublicKey
export let spawnControlPda: anchor.web3.PublicKey

describe('Init', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  anchor.workspace.Robotmasters as Program<Robotmasters>
  program = anchor.workspace.Robotmasters as Program<Robotmasters>

  before(() => {
    adminPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('admin')],
      program.programId
    )[0]

    matchCounterPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('match_counter')],
      program.programId
    )[0]

    itemManagerPda = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('item_manager')],
      program.programId
    )[0]

    condPda = deriveComponentPda(program.programId, 'cond', 0, 0)[0]
    condControlPda = deriveComponentControlPda(
      program.programId,
      'cond_control',
      0
    )[0]

    actionPda = deriveComponentPda(program.programId, 'action', 0, 0)[0]
    actionControlPda = deriveComponentControlPda(
      program.programId,
      'action_control',
      0
    )[0]

    spawnPda = deriveComponentPda(program.programId, 'spawn', 0, 0)[0]
    spawnControlPda = deriveComponentControlPda(
      program.programId,
      'spawn_control',
      0
    )[0]
  })

  it('Initializes program', async () => {
    await program.methods
      .init({
        itemAuthority: itemAuthority.publicKey,
        treasury: treasury.publicKey,
      })
      .accounts({
        payer: program.provider.publicKey,
      })
      .rpc()

    const admin = await program.account.admin.fetch(adminPda)

    expect(
      admin.itemAuthority.equals(itemAuthority.publicKey),
      'Item authority is incorrect'
    ).eq(true)

    expect(
      admin.treasury.equals(treasury.publicKey),
      'Treasury is incorrect'
    ).eq(true)

    const matchCounter = await program.account.matchCounter.fetch(
      matchCounterPda
    )

    expect(matchCounter.band.length).eq(64)

    const itemManger = await program.account.componentManager.fetch(
      itemManagerPda
    )

    expect(itemManger.counter).eq(0)
  })
})
