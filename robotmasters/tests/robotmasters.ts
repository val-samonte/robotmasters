import {
  PublicKey,
  sendAndConfirmRawTransaction,
  SendTransactionError,
  Signer,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js'
import { Program } from '@coral-xyz/anchor'
import * as anchor from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'
import {
  DELEGATION_PROGRAM_ID,
  GetCommitmentSignature,
} from '@magicblock-labs/ephemeral-rollups-sdk'
import { ConfirmOptionsWithBlockhash } from '@coral-xyz/anchor/dist/cjs/provider'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'

const GAME_PDA = 'game3'

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

  console.log('PDA: ', pda.toBase58())

  xit('Creates a game', async () => {
    await program.methods
      .createGame()
      .accounts({
        authority: program.provider.publicKey,
      })
      .rpc()
  })

  xit('Delegate the game to ER', async () => {
    const accountInfo = await provider.connection.getAccountInfo(pda)
    if (accountInfo.owner.toBase58() == DELEGATION_PROGRAM_ID.toBase58()) {
      console.log('Account is locked by the delegation program')
      return
    }

    // await new Promise((resolve) => {
    //   setInterval(async () => {
    //     try {
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

    const txSig = await sendAndConfirm(provider, tx, [], {
      skipPreflight: true,
      commitment: 'confirmed',
    })

    console.log(txSig)

    // await provider.sendAndConfirm(tx, [], {
    //   skipPreflight: true,
    //   commitment: 'confirmed',
    // })

    //       resolve(true)
    //     } catch (e) {
    //       console.log(e)
    //     }
    //   }, 500)
    // })
  })

  it('Run the delegated game', async () => {
    const accountInfo = await provider.connection.getAccountInfo(pda)
    if (accountInfo.owner.toBase58() != DELEGATION_PROGRAM_ID.toBase58()) {
      console.log('Account is not delegated')
      return
    }

    let prevFrame = -1
    let confirmCounter = 0
    let id1: NodeJS.Timeout
    let id2: NodeJS.Timeout

    await new Promise((resolve, reject) => {
      id1 = setInterval(async () => {
        try {
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
          await providerEphemeralRollup.sendAndConfirm(tx, [], {
            skipPreflight: true,
          })
        } catch (e) {
          clearInterval(id1)
          clearInterval(id2)
          reject(e)
        }
      }, 10)

      id2 = setInterval(async () => {
        try {
          const state = await erProgram.account.gameState.fetch(
            pda,
            'processed'
          )
          console.log('frame', state.frame, 'size', state.len)
          if (state.frame !== prevFrame) {
            prevFrame = state.frame
          } else {
            confirmCounter++
            if (confirmCounter > 200) {
              console.log('Final frame: ', state.frame)
              clearInterval(id1)
              clearInterval(id2)
              resolve(true)
            }
          }
        } catch (e) {
          console.log(e)
        }
      }, 1000)
    })
    console.log(4)
  })

  xit('Undelegate and commit game', async () => {
    const accountInfo = await provider.connection.getAccountInfo(pda)
    if (accountInfo.owner.toBase58() != DELEGATION_PROGRAM_ID.toBase58()) {
      console.log('Account is not delegated')
      return
    }

    let tx = await program.methods
      .undelegateGameGame()
      .accounts({
        payer: providerEphemeralRollup.wallet.publicKey,
        // @ts-ignore
        game_state: pda,
      })
      .transaction()
    tx.feePayer = provider.wallet.publicKey
    tx.recentBlockhash = (
      await providerEphemeralRollup.connection.getLatestBlockhash()
    ).blockhash
    tx = await providerEphemeralRollup.wallet.signTransaction(tx)

    await providerEphemeralRollup.sendAndConfirm(tx)

    const counterAccountInfo = await provider.connection.getAccountInfo(pda)
    console.log(counterAccountInfo.owner.toString())

    const gameState = await erProgram.account.gameState.fetch(pda)
    console.log('Game State final frame: ', gameState.frame, gameState)
  })
})

export const isVersionedTransaction = (
  tx: Transaction | VersionedTransaction
): tx is VersionedTransaction => {
  return 'version' in tx
}

class ConfirmError extends Error {
  constructor(message?: string) {
    super(message)
  }
}

async function sendAndConfirm(
  provider: anchor.AnchorProvider,
  tx: Transaction | VersionedTransaction,
  signers?: Signer[],
  opts?: ConfirmOptionsWithBlockhash
): Promise<TransactionSignature> {
  if (opts === undefined) {
    opts = provider.opts
  }

  if (isVersionedTransaction(tx)) {
    if (signers) {
      tx.sign(signers)
    }
  } else {
    tx.feePayer = tx.feePayer ?? provider.wallet.publicKey
    tx.recentBlockhash = (
      await provider.connection.getLatestBlockhash(opts.preflightCommitment)
    ).blockhash

    if (signers) {
      for (const signer of signers) {
        tx.partialSign(signer)
      }
    }
  }
  tx = await provider.wallet.signTransaction(tx)
  const rawTx = tx.serialize()

  try {
    return await sendAndConfirmRawTransaction(
      provider.connection,
      rawTx as Buffer<ArrayBufferLike>,
      opts
    )
  } catch (err) {
    // thrown if the underlying 'confirmTransaction' encounters a failed tx
    // the 'confirmTransaction' error does not return logs so we make another rpc call to get them
    if (err instanceof ConfirmError) {
      // choose the shortest available commitment for 'getTransaction'
      // (the json RPC does not support any shorter than "confirmed" for 'getTransaction')
      // because that will see the tx sent with `sendAndConfirmRawTransaction` no matter which
      // commitment `sendAndConfirmRawTransaction` used
      const txSig = bs58.encode(
        isVersionedTransaction(tx)
          ? tx.signatures?.[0] || new Uint8Array()
          : tx.signature ?? new Uint8Array()
      )
      const maxVer = isVersionedTransaction(tx) ? 0 : undefined
      const failedTx = await provider.connection.getTransaction(txSig, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: maxVer,
      })
      if (!failedTx) {
        throw err
      } else {
        const logs = failedTx.meta?.logMessages
        console.log(logs)
        throw err
      }
    } else {
      throw err
    }
  }
}
