import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Robotmasters } from '../target/types/robotmasters'
import idl from '../target/idl/robotmasters.json'
import { PublicKey, Connection } from '@solana/web3.js'
import { KeypairWallet, loadKeypair } from './utils'

const main = async () => {
  const authority = loadKeypair('~/.config/solana/id.json')
  const wallet = new KeypairWallet(authority)
  const provider = new AnchorProvider(
    new Connection(
      'https://devnet.helius-rpc.com/?api-key=4a2c2cc6-845d-4608-93b6-0c8b19e415ff',
      'confirmed'
    ),
    wallet,
    {
      skipPreflight: true,
      commitment: 'confirmed',
    }
  )

  const rmIdl = idl as Robotmasters
  const program = new Program<Robotmasters>(rmIdl, provider)

  try {
    await program.methods
      .init({
        itemAuthority: new PublicKey(
          'Dt29kEgXxKtBBmKBHgRuXMEuMMtHhTBDBGVrt9UYwzHC'
        ),
        treasury: new PublicKey('Dt29kEgXxKtBBmKBHgRuXMEuMMtHhTBDBGVrt9UYwzHC'),
      })
      .accounts({
        payer: program.provider.publicKey,
      })
      .rpc()
  } catch (e) {
    console.error(e)
  }
}

main()
