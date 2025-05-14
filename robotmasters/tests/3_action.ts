import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { expect } from 'chai'
import { deriveComponentPda } from './utils'
import { actionControlPda, actionPda, itemAuthority } from './0_init'

describe('Action', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>

  it('Create a Action', async () => {
    await program.methods
      .createAction({
        energyCost: 5,
        interval: 2,
        duration: 0,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        spawns: [],
      })
      .accounts({
        authority: program.provider.publicKey,
        action: actionPda,
        control: actionControlPda,
      })
      .rpc()

    const actionData = await program.account.action.fetch(actionPda)

    expect(actionData.energyCost).eq(5)
    expect(actionData.interval).eq(2)
    expect(actionData.duration).eq(0)

    const actionControlData = await program.account.componentControl.fetch(
      actionControlPda
    )

    expect(actionControlData.counter).eq(0)
    expect(program.provider.publicKey.equals(actionControlData.owner)).eq(true)
  })

  it('Update a draft state Action', async () => {
    await program.methods
      .updateAction({
        energyCost: 5,
        interval: 5,
        duration: 0,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        spawns: [],
        state: { draft: {} },
      })
      .accounts({
        action: actionPda,
        control: actionControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()

    const actionData = await program.account.action.fetch(actionPda)

    expect(actionData.energyCost).eq(5)
    expect(actionData.interval).eq(5)
    expect(actionData.duration).eq(0)
  })

  it('Update the action to pending state', async () => {
    await program.methods
      .updateAction({
        energyCost: 5,
        interval: 5,
        duration: 0,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        spawns: [],
        state: { pending: {} },
      })
      .accounts({
        action: actionPda,
        control: actionControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()
    const actionData = await program.account.action.fetch(actionPda)
    expect(typeof actionData.state.pending).eq('object')
  })

  it('Should not update a Action when not in Draft state', async () => {
    try {
      await program.methods
        .updateAction({
          energyCost: 2,
          interval: 2,
          duration: 0,
          args: [0, 0, 0, 0],
          script: Buffer.from([]),
          spawns: [],
          state: { pending: {} },
        })
        .accounts({
          action: actionPda,
          control: actionControlPda,
          signer: program.provider.publicKey,
        })
        .rpc()
      expect.fail('--')
    } catch (e) {
      expect(e.message).to.not.eq('--')
    }
  })

  it('Admin should be able to transition Action to other state', async () => {
    await program.methods
      .updateAction({
        energyCost: 5,
        interval: 5,
        duration: 0,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        spawns: [],
        state: { published: {} },
      })
      .accounts({
        action: actionPda,
        control: actionControlPda,
        signer: itemAuthority.publicKey,
      })
      .signers([itemAuthority])
      .rpc()
    const actionData = await program.account.action.fetch(actionPda)
    expect(typeof actionData.state.published).eq('object')
  })

  it('Should be able to make a version of the Action', async () => {
    const [newActionPda] = deriveComponentPda(program.programId, 'action', 0, 1)

    await program.methods
      .versionAction({
        energyCost: 5,
        interval: 5,
        duration: 0,
        args: [0, 0, 0, 0],
        spawns: [],
        script: Buffer.from([]),
      })
      .accounts({
        oldAction: actionPda,
        newAction: newActionPda,
        control: actionControlPda,
        signer: program.provider.wallet.publicKey,
      })
      .rpc()

    const actionControlData = await program.account.componentControl.fetch(
      actionControlPda
    )

    expect(actionControlData.counter).eq(1)

    const actionData = await program.account.action.fetch(newActionPda)
    expect(actionData.version).eq(actionControlData.counter)
  })
})
