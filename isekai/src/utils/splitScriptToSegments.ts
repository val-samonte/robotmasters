import { operators, type OpKey } from '@/constants/operators'

export function splitScriptToSegments(script: number[]) {
  const output: number[][] = []

  for (let i = 0; i < script.length; i++) {
    const operator = operators[script[i] as unknown as OpKey]
    const segment: number[] = [script[i]]
    for (let j = 0; j < operator.operands.length; j++) {
      segment.push(script[i + j + 1])
    }
    i += operator.operands.length
    output.push(segment)
  }

  return output
}
