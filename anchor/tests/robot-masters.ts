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
    await program.methods.runGame().rpc()

    const state = await program.account.gameState.fetch(gameAddress)

    console.log(state)
  })
})
