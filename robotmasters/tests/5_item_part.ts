import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'

import { expect } from 'chai'
import { deriveComponentPda } from './utils'
import {
  itemPartControlPda,
  itemPartPda,
  itemAuthority,
  blueprint,
} from './0_init'

describe('ItemPart', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>

  it('Create a ItemPart', async () => {
    await program.methods
      .createItemPart({
        itemType: { head: {} },
        itemTypeVariation: 0,
        health: 20,
        weight: 10,
        power: 5,
        energy: 0,
        energyRegen: 0,
        energyRate: 0,
        armor: [100, 100, 100, 100, 100, 100, 100, 100],
        conditions: [],
        actions: [],
        spawns: [],
        effects: [],
      })
      .accounts({
        authority: program.provider.publicKey,
        itemPart: itemPartPda,
        control: itemPartControlPda,
        blueprint: blueprint.publicKey,
      })
      .rpc()

    const itemPartData = await program.account.itemPart.fetch(itemPartPda)

    expect(itemPartData.health).eq(20)
    expect(itemPartData.power).eq(5)

    const itemPartControlData = await program.account.componentControl.fetch(
      itemPartControlPda
    )

    expect(itemPartControlData.counter).eq(0)
    expect(program.provider.publicKey.equals(itemPartControlData.owner)).eq(
      true
    )

    const [linkPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('item_blueprint_link'), blueprint.publicKey.toBuffer()],
      program.programId
    )

    // should established a link with Blueprint address
    const linkData = await program.account.itemBlueprintLink.fetch(linkPda)

    expect(linkData.blueprint.equals(blueprint.publicKey)).eq(true)
  })

  it('Update a draft state ItemPart', async () => {
    await program.methods
      .updateItemPart({
        state: { draft: {} },
        itemTypeVariation: 0,
        health: 10,
        weight: 10,
        power: 5,
        energy: 0,
        energyRegen: 0,
        energyRate: 0,
        armor: [100, 100, 100, 100, 100, 100, 100, 100],
        conditions: [],
        actions: [],
        spawns: [],
        effects: [],
      })
      .accounts({
        itemPart: itemPartPda,
        control: itemPartControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()

    const itemPartData = await program.account.itemPart.fetch(itemPartPda)

    expect(itemPartData.health).eq(10)
    expect(itemPartData.power).eq(5)
  })

  it('Update the itemPart to pending state', async () => {
    await program.methods
      .updateItemPart({
        state: { pending: {} },
        itemTypeVariation: 0,
        health: 20,
        weight: 10,
        power: 5,
        energy: 0,
        energyRegen: 0,
        energyRate: 0,
        armor: [100, 100, 100, 100, 100, 100, 100, 100],
        conditions: [],
        actions: [],
        spawns: [],
        effects: [],
      })
      .accounts({
        itemPart: itemPartPda,
        control: itemPartControlPda,
        signer: program.provider.publicKey,
      })
      .rpc()
    const itemPartData = await program.account.itemPart.fetch(itemPartPda)
    expect(typeof itemPartData.state.pending).eq('object')
  })

  it('Should not update a ItemPart when not in Draft state', async () => {
    try {
      await program.methods
        .updateItemPart({
          state: { pending: {} },
          itemTypeVariation: 0,
          health: 20,
          weight: 10,
          power: 5,
          energy: 0,
          energyRegen: 0,
          energyRate: 0,
          armor: [100, 100, 100, 100, 100, 100, 100, 100],
          conditions: [],
          actions: [],
          spawns: [],
          effects: [],
        })
        .accounts({
          itemPart: itemPartPda,
          control: itemPartControlPda,
          signer: program.provider.publicKey,
        })
        .rpc()
      expect.fail('--')
    } catch (e) {
      expect(e.message).to.not.eq('--')
    }
  })

  it('Admin should be able to transition ItemPart to other state', async () => {
    await program.methods
      .updateItemPart({
        state: { published: {} },
        itemTypeVariation: 0,
        health: 20,
        weight: 10,
        power: 5,
        energy: 0,
        energyRegen: 0,
        energyRate: 0,
        armor: [100, 100, 100, 100, 100, 100, 100, 100],
        conditions: [],
        actions: [],
        spawns: [],
        effects: [],
      })
      .accounts({
        itemPart: itemPartPda,
        control: itemPartControlPda,
        signer: itemAuthority.publicKey,
      })
      .signers([itemAuthority])
      .rpc()
    const itemPartData = await program.account.itemPart.fetch(itemPartPda)
    expect(typeof itemPartData.state.published).eq('object')
  })

  it('Should be able to make a version of the ItemPart', async () => {
    const [newItemPartPda] = deriveComponentPda(
      program.programId,
      'item_part',
      0,
      1
    )

    await program.methods
      .versionItemPart({
        itemTypeVariation: 0,
        health: 20,
        weight: 10,
        power: 5,
        energy: 0,
        energyRegen: 0,
        energyRate: 0,
        armor: [100, 100, 100, 100, 100, 100, 100, 100],
        conditions: [],
        actions: [],
        spawns: [],
        effects: [],
      })
      .accounts({
        oldItemPart: itemPartPda,
        newItemPart: newItemPartPda,
        control: itemPartControlPda,
        signer: program.provider.wallet.publicKey,
      })
      .rpc()

    const itemPartControlData = await program.account.componentControl.fetch(
      itemPartControlPda
    )

    expect(itemPartControlData.counter).eq(1)

    const itemPartData = await program.account.itemPart.fetch(newItemPartPda)
    expect(itemPartData.version).eq(itemPartControlData.counter)
  })
})
