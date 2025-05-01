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
import { CreateGame } from '../target/types/create_game'
import { GameState } from '../target/types/game_state'

describe('robotmasters', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  // Constants used to test the program.
  let worldPda: PublicKey
  let entityPda: PublicKey
  let componentPda: PublicKey

  const gameStateComponent = anchor.workspace.GameState as Program<GameState>
  const systemCreateGame = anchor.workspace.CreateGame as Program<CreateGame>

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

  it('Add an entity', async () => {
    const addEntity = await AddEntity({
      payer: provider.wallet.publicKey,
      world: worldPda,
      connection: provider.connection,
    })
    const txSign = await provider.sendAndConfirm(addEntity.transaction)
    entityPda = addEntity.entityPda
  })

  it('Add a component', async () => {
    const initializeComponent = await InitializeComponent({
      payer: provider.wallet.publicKey,
      entity: entityPda,
      componentId: gameStateComponent.programId,
    })
    await provider.sendAndConfirm(initializeComponent.transaction)
    componentPda = initializeComponent.componentPda
  })

  it('Apply a system', async () => {
    // Run the movement system
    const applySystem = await ApplySystem({
      authority: provider.wallet.publicKey,
      systemId: systemCreateGame.programId,
      world: worldPda,
      entities: [
        {
          entity: entityPda,
          components: [{ componentId: gameStateComponent.programId }],
        },
      ],
    })
    await provider.sendAndConfirm(applySystem.transaction)
  })
})
