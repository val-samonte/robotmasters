import { PublicKey } from '@solana/web3.js'
import {
  InitializeNewWorld,
  AddEntity,
  InitializeComponent,
  ApplySystem,
  Program,
} from '@magicblock-labs/bolt-sdk'
import { expect } from 'chai'
import * as anchor from '@coral-xyz/anchor'
import { GameState } from '../target/types/game_state'
import { CreateGame } from '../target/types/create_game'

describe('robotmasters', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  // Constants used to test the program.
  let worldPda: PublicKey
  let entityShardA: PublicKey
  let entityShardB: PublicKey
  let entityShardC: PublicKey
  let gameStateShardA: PublicKey
  let gameStateShardB: PublicKey
  let gameStateShardC: PublicKey

  const gameStateComponent = anchor.workspace.GameState as Program<GameState>
  const createGameSystem = anchor.workspace.CreateGame as Program<CreateGame>

  it('InitializeNewWorld', async () => {
    const initNewWorld = await InitializeNewWorld({
      payer: provider.wallet.publicKey,
      connection: provider.connection,
    })
    const txSign = await provider.sendAndConfirm(initNewWorld.transaction)
    worldPda = initNewWorld.worldPda
    console.log(
      `Initialized a new world (ID=${worldPda}). Initialization signature: ${txSign}`
    )
  })

  it('Add entity shard A', async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    })
    await provider.sendAndConfirm(addEntity.transaction)
    entityShardA = addEntity.entityPda
  })

  it('Add entity shard B', async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    })
    await provider.sendAndConfirm(addEntity.transaction)
    entityShardB = addEntity.entityPda
  })

  it('Add entity shard C', async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    })
    await provider.sendAndConfirm(addEntity.transaction)
    entityShardC = addEntity.entityPda
  })

  it('Add shard A', async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityShardA,
      componentId: gameStateComponent.programId,
    })
    await provider.sendAndConfirm(initializeComponent.transaction)
    gameStateShardA = initializeComponent.componentPda
  })

  it('Add shard B', async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityShardB,
      componentId: gameStateComponent.programId,
    })
    await provider.sendAndConfirm(initializeComponent.transaction)
    gameStateShardB = initializeComponent.componentPda
  })

  it('Add shard C', async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityShardC,
      componentId: gameStateComponent.programId,
    })
    await provider.sendAndConfirm(initializeComponent.transaction)
    gameStateShardC = initializeComponent.componentPda
  })

  it('Apply a system', async () => {
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: createGameSystem.programId,
      world: worldPda,
      entities: [
        {
          entity: entityShardA,
          components: [{ componentId: gameStateComponent.programId }],
        },
        {
          entity: entityShardB,
          components: [{ componentId: gameStateComponent.programId }],
        },
        {
          entity: entityShardC,
          components: [{ componentId: gameStateComponent.programId }],
        },
      ],
    })
    const txSign = await provider.sendAndConfirm(applySystem.transaction)
    console.log(`Applied a system. Signature: ${txSign}`)
  })
})
