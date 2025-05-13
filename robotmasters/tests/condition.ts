import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { expect } from 'chai'
import { deriveComponentPda } from './utils'
import { condControlPda, condPda, itemAuthority } from './0_init'

describe('Condition', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>

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
        control: condControlPda,
      })
      .rpc()

    const condData = await program.account.condition.fetch(condPda)

    expect(condData.energyMulNum).eq(100)
    expect(condData.energyMulDen).eq(100)

    const condControlData = await program.account.componentControl.fetch(
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
        control: condControlPda,
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
        control: condControlPda,
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
          control: condControlPda,
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
        control: condControlPda,
        signer: itemAuthority.publicKey,
      })
      .signers([itemAuthority])
      .rpc()
    const condData = await program.account.condition.fetch(condPda)
    expect(typeof condData.state.published).eq('object')
  })

  it('Should be able to make a version of the Condition', async () => {
    const [newCondPda] = deriveComponentPda(program.programId, 'cond', 0, 1)

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
        control: condControlPda,
        signer: program.provider.wallet.publicKey,
      })
      .rpc()

    const condControlData = await program.account.componentControl.fetch(
      condControlPda
    )

    expect(condControlData.counter).eq(1)

    const condData = await program.account.condition.fetch(newCondPda)
    expect(condData.version).eq(condControlData.counter)
  })
})
