import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { Keypair } from '@solana/web3.js'
import { expect } from 'chai'
import { deriveControlPda, derivePda } from './utils'

describe('Condition', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  anchor.workspace.Robotmasters as Program<Robotmasters>

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>

  const itemAuthority = Keypair.generate()
  const treasury = Keypair.generate()

  const [adminPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('admin')],
    program.programId
  )

  const [matchCounterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('match_counter')],
    program.programId
  )

  const [itemManagerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('item_manager')],
    program.programId
  )

  const [condPda] = derivePda(program.programId, 'cond', 0, 0)
  const [condControlPda] = deriveControlPda(
    program.programId,
    'cond_control',
    0
  )

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

    const itemManger = await program.account.itemManager.fetch(itemManagerPda)

    expect(itemManger.counter).eq(0)
  })

  it('Create a Condition', async () => {
    await program.methods
      .createCond({
        energyMulNum: 100,
        energyMulDen: 100,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
      })
      .accounts({
        authority: program.provider.publicKey,
        cond: condPda,
        condControl: condControlPda,
      })
      .rpc()

    const condData = await program.account.condition.fetch(condPda)

    expect(condData.energyMulNum).eq(100)
    expect(condData.energyMulDen).eq(100)

    const condControlData = await program.account.conditionControl.fetch(
      condControlPda
    )

    expect(condControlData.counter).eq(0)
    expect(program.provider.publicKey.equals(condControlData.owner)).eq(true)
  })

  it('Update a draft state Condition', async () => {
    await program.methods
      .updateCond({
        args: [0, 0, 0, 0],
        energyMulDen: 120,
        energyMulNum: 100,
        script: Buffer.from([]),
        state: { draft: {} },
      })
      .accounts({
        cond: condPda,
        condControl: condControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()

    const condData = await program.account.condition.fetch(condPda)

    expect(condData.energyMulNum).eq(100)
    expect(condData.energyMulDen).eq(120)
  })

  it('Update the condition to pending state', async () => {
    await program.methods
      .updateCond({
        args: [0, 0, 0, 0],
        energyMulDen: 120,
        energyMulNum: 100,
        script: Buffer.from([]),
        state: { pending: {} },
      })
      .accounts({
        cond: condPda,
        condControl: condControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()
    const condData = await program.account.condition.fetch(condPda)
    expect(typeof condData.state.pending).eq('object')
  })

  it('Should not update a Condition when not in Draft state', async () => {
    try {
      await program.methods
        .updateCond({
          args: [0, 0, 0, 0],
          energyMulDen: 120,
          energyMulNum: 120,
          script: Buffer.from([]),
          state: { pending: {} },
        })
        .accounts({
          cond: condPda,
          condControl: condControlPda,
          signer: program.provider.publicKey,
        })
        .rpc()
      expect.fail('--')
    } catch (e) {
      expect(e.message).to.not.eq('--')
    }
  })

  it('Admin should be able to transition Condition to other state', async () => {
    await program.methods
      .updateCond({
        args: [0, 0, 0, 0],
        energyMulDen: 100,
        energyMulNum: 120,
        script: Buffer.from([]),
        state: { published: {} },
      })
      .accounts({
        cond: condPda,
        condControl: condControlPda,
        signer: itemAuthority.publicKey,
      })
      .signers([itemAuthority])
      .rpc()
    const condData = await program.account.condition.fetch(condPda)
    expect(typeof condData.state.published).eq('object')
  })

  it('Should be able to make a version of the Condition', async () => {
    const [newCondPda] = derivePda(program.programId, 'cond', 0, 1)

    await program.methods
      .versionCond({
        args: [0, 0, 0, 0],
        energyMulDen: 100,
        energyMulNum: 120,
        script: Buffer.from([]),
      })
      .accounts({
        oldCond: condPda,
        newCond: newCondPda,
        condControl: condControlPda,
        signer: program.provider.wallet.publicKey,
      })
      .rpc()

    const condControlData = await program.account.conditionControl.fetch(
      condControlPda
    )

    expect(condControlData.counter).eq(1)

    const condData = await program.account.condition.fetch(newCondPda)
    expect(condData.version).eq(condControlData.counter)
  })
})
