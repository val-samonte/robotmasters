import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { expect } from 'chai'
import { deriveComponentPda } from './utils'
import { spawnControlPda, spawnPda, itemAuthority } from './0_init'

describe('Spawn', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>

  it('Create a Spawn', async () => {
    await program.methods
      .createSpawn({
        healthCap: 1,
        duration: 120,
        critChance: 100,
        critMultiplier: 100,
        damageBase: 5,
        damageRange: 10,
        destroyOnCollision: true,
        element: 1,
        height: 3,
        width: 6,
        outputX: 14,
        outputY: 8,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
      })
      .accounts({
        authority: program.provider.publicKey,
        spawn: spawnPda,
        control: spawnControlPda,
      })
      .rpc()

    const spawnData = await program.account.spawn.fetch(spawnPda)

    expect(typeof spawnData.element.punct).eq('object')

    const spawnControlData = await program.account.componentControl.fetch(
      spawnControlPda
    )

    expect(spawnControlData.counter).eq(0)
    expect(program.provider.publicKey.equals(spawnControlData.owner)).eq(true)
  })

  it('Update a draft state Spawn', async () => {
    await program.methods
      .updateSpawn({
        healthCap: 1,
        duration: 120,
        critChance: 100,
        critMultiplier: 100,
        damageBase: 5,
        damageRange: 10,
        destroyOnCollision: true,
        element: 2,
        height: 3,
        width: 6,
        outputX: 14,
        outputY: 8,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        state: { draft: {} },
      })
      .accounts({
        spawn: spawnPda,
        control: spawnControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()

    const spawnData = await program.account.spawn.fetch(spawnPda)

    expect(typeof spawnData.element.blast).eq('object')
  })

  it('Update the spawn to pending state', async () => {
    await program.methods
      .updateSpawn({
        healthCap: 1,
        duration: 120,
        critChance: 100,
        critMultiplier: 100,
        damageBase: 5,
        damageRange: 10,
        destroyOnCollision: true,
        element: 2,
        height: 3,
        width: 6,
        outputX: 14,
        outputY: 8,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        state: { pending: {} },
      })
      .accounts({
        spawn: spawnPda,
        control: spawnControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()
    const spawnData = await program.account.spawn.fetch(spawnPda)
    expect(typeof spawnData.state.pending).eq('object')
  })

  it('Should not update a Spawn when not in Draft state', async () => {
    try {
      await program.methods
        .updateSpawn({
          healthCap: 10,
          duration: 120,
          critChance: 100,
          critMultiplier: 100,
          damageBase: 5,
          damageRange: 10,
          destroyOnCollision: true,
          element: 2,
          height: 3,
          width: 6,
          outputX: 14,
          outputY: 8,
          args: [0, 0, 0, 0],
          script: Buffer.from([]),
          state: { pending: {} },
        })
        .accounts({
          spawn: spawnPda,
          control: spawnControlPda,
          signer: program.provider.publicKey,
        })
        .rpc()
      expect.fail('--')
    } catch (e) {
      expect(e.message).to.not.eq('--')
    }
  })

  it('Admin should be able to transition Spawn to other state', async () => {
    await program.methods
      .updateSpawn({
        healthCap: 1,
        duration: 120,
        critChance: 100,
        critMultiplier: 100,
        damageBase: 5,
        damageRange: 10,
        destroyOnCollision: true,
        element: 2,
        height: 3,
        width: 6,
        outputX: 14,
        outputY: 8,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
        state: { published: {} },
      })
      .accounts({
        spawn: spawnPda,
        control: spawnControlPda,
        signer: itemAuthority.publicKey,
      })
      .signers([itemAuthority])
      .rpc()
    const spawnData = await program.account.spawn.fetch(spawnPda)
    expect(typeof spawnData.state.published).eq('object')
  })

  it('Should be able to make a version of the Spawn', async () => {
    const [newSpawnPda] = deriveComponentPda(program.programId, 'spawn', 0, 1)

    await program.methods
      .versionSpawn({
        healthCap: 1,
        duration: 120,
        critChance: 100,
        critMultiplier: 100,
        damageBase: 5,
        damageRange: 10,
        destroyOnCollision: true,
        element: 1,
        height: 3,
        width: 6,
        outputX: 14,
        outputY: 8,
        args: [0, 0, 0, 0],
        script: Buffer.from([]),
      })
      .accounts({
        oldSpawn: spawnPda,
        newSpawn: newSpawnPda,
        control: spawnControlPda,
        signer: program.provider.wallet.publicKey,
      })
      .rpc()

    const spawnControlData = await program.account.componentControl.fetch(
      spawnControlPda
    )

    expect(spawnControlData.counter).eq(1)

    const spawnData = await program.account.spawn.fetch(newSpawnPda)
    expect(spawnData.version).eq(spawnControlData.counter)
  })
})
