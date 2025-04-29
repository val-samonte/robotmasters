import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { RobotMasters } from '../target/types/robot_masters'

describe('robot-masters', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.RobotMasters as Program<RobotMasters>
  const [gameAddress] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from('game')],
    program.programId
  )

  it('Create game', async () => {
    // Add your test here.
    await program.methods
      .createGame()
      .accounts({
        authority: program.provider.publicKey,
      })
      .rpc()
  })

  it('Runs the game', async () => {
    let prevFrame = -1
    let i = 0

    while (i < 400) {
      await program.methods
        .runGame()
        .accounts({
          authority: program.provider.publicKey,
        })
        .rpc({ commitment: 'processed' })

      const state = await program.account.gameState.fetch(
        gameAddress,
        'confirmed'
      )
      console.log('frame', state.frame, 'size', state.len)
      if (state.frame !== prevFrame) {
        prevFrame = state.frame
      } else {
        break
      }
      i++
    }
  })
})
