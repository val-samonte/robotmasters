import * as anchor from '@coral-xyz/anchor'

export function deriveComponentPda(
  programId: anchor.web3.PublicKey,
  name: string,
  componentManagerCounter: number,
  version: number = 0
): [anchor.web3.PublicKey, number] {
  const condSeed = Buffer.from(name)
  const idSeed = Buffer.alloc(4)
  idSeed.writeUIntLE(componentManagerCounter, 0, 4)
  const versionSeed = Buffer.alloc(4)
  versionSeed.writeUIntLE(version, 0, 4)

  const seeds = [condSeed, idSeed, versionSeed]

  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)
}

export function deriveComponentControlPda(
  programId: anchor.web3.PublicKey,
  name: string,
  componentManagerCounter: number
): [anchor.web3.PublicKey, number] {
  const condSeed = Buffer.from(name)
  const idSeed = Buffer.alloc(4)
  idSeed.writeUIntLE(componentManagerCounter, 0, 4)

  const seeds = [condSeed, idSeed]

  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)
}
