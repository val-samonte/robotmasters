import { PublicKey } from '@solana/web3.js'
import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'
import {
  DELEGATION_PROGRAM_ID,
  GetCommitmentSignature,
} from '@magicblock-labs/ephemeral-rollups-sdk'

const GAME_PDA = 'game1'

describe('robotmasters', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  anchor.workspace.Robotmasters as Program<Robotmasters>

  const providerEphemeralRollup = new anchor.AnchorProvider(
    new anchor.web3.Connection(
      'https://devnet.magicblock.app/', // 'http://localhost:8899',
      {
        wsEndpoint: 'wss://devnet.magicblock.app/', // 'ws://localhost:8900',
      }
    ),
    anchor.Wallet.local()
  )

  const program = anchor.workspace.Robotmasters as Program<Robotmasters>
  const erProgram = new Program(
    program.idl,
    providerEphemeralRollup
  ) as Program<Robotmasters>
  const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(GAME_PDA)],
    program.programId
  )

  xit('Creates a game', async () => {
    await program.methods
      .createGame()
      .accounts({
        authority: program.provider.publicKey,
      })
      .rpc()
  })

  it('Delegate the game to ER', async () => {
    let tx = await program.methods
      .delegateGame()
      .accounts({
        payer: provider.wallet.publicKey,
        pda: pda,
      })
      .transaction()

    tx.feePayer = provider.wallet.publicKey
    tx.recentBlockhash = (
      await provider.connection.getLatestBlockhash()
    ).blockhash

    tx = await providerEphemeralRollup.wallet.signTransaction(tx)

    await provider.sendAndConfirm(tx, [], {
      skipPreflight: true,
      commitment: 'confirmed',
    })
  })

  it('Run the delegated game', async () => {
    const counterAccountInfo = await provider.connection.getAccountInfo(pda)
    console.log(
      counterAccountInfo.owner.toString(),
      DELEGATION_PROGRAM_ID.toBase58()
    )

    return

    let prevFrame = -1

    await new Promise((resolve) => {
      setInterval(async () => {
        let tx = await program.methods
          .runGame()
          .accounts({
            authority: program.provider.publicKey,
          })
          .transaction()
        tx.feePayer = providerEphemeralRollup.wallet.publicKey
        tx.recentBlockhash = (
          await providerEphemeralRollup.connection.getLatestBlockhash()
        ).blockhash
        tx = await providerEphemeralRollup.wallet.signTransaction(tx)
        providerEphemeralRollup.sendAndConfirm(tx)
      }, 10)

      setInterval(async () => {
        const state = await erProgram.account.gameState.fetch(pda, 'processed')
        console.log('frame', state.frame, 'size', state.len)
        if (state.frame !== prevFrame) {
          prevFrame = state.frame
        } else {
          console.log('Final frame: ', state.frame)
          resolve(true)
        }
      }, 1000)
    })

    // let i = 0
    // while (i <= 640) {
    //   let tx = await program.methods
    //     .runGame()
    //     .accounts({
    //       authority: program.provider.publicKey,
    //     })
    //     .transaction()
    //   tx.feePayer = providerEphemeralRollup.wallet.publicKey
    //   tx.recentBlockhash = (
    //     await providerEphemeralRollup.connection.getLatestBlockhash()
    //   ).blockhash
    //   tx = await providerEphemeralRollup.wallet.signTransaction(tx)
    //   await providerEphemeralRollup.sendAndConfirm(tx)
    //   const state = await erProgram.account.gameState.fetch(pda, 'processed')
    //   console.log('frame', state.frame, 'size', state.len)
    //   if (state.frame !== prevFrame) {
    //     prevFrame = state.frame
    //   } else {
    //     console.log('Final frame: ', state.frame)
    //     break
    //   }
    //   i++
    // }
  })

  xit('Undelegate and commit game', async () => {
    // let tx = await program.methods
    //   .undelegateGameGame()
    //   .accounts({
    //     payer: providerEphemeralRollup.wallet.publicKey,
    //     // @ts-ignore
    //     game_state: pda,
    //   })
    //   .transaction()
    // tx.feePayer = provider.wallet.publicKey
    // tx.recentBlockhash = (
    //   await providerEphemeralRollup.connection.getLatestBlockhash()
    // ).blockhash
    // tx = await providerEphemeralRollup.wallet.signTransaction(tx)

    // await providerEphemeralRollup.sendAndConfirm(tx)

    const counterAccountInfo = await provider.connection.getAccountInfo(pda)
    console.log(counterAccountInfo.owner.toString())

    // const gameState = await erProgram.account.gameState.fetch(pda)
    // console.log('Game State final frame: ', gameState.frame, gameState)
  })
})
