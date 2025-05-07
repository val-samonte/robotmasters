import { useEffect, useState } from 'react'
import { OperatorSelector } from './OperatorSelector'
import { Label } from './ui/label'
import { operators, type OpKey } from '@/constants/operators'
import { VariableSelector } from './VariableSelector'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { Input } from './ui/input'
import { PropertySelector } from './PropertySelector'
import { properties, type PropKey } from '@/constants/properties'

export function ScriptHelper() {
  return (
    <div className="flex flex-col">
      <ScriptLine line={0} />
      <ScriptLine line={1} />
    </div>
  )
}

function ScriptLine({ line }: { line: number }) {
  const [operator, setOperator] = useState('')
  const [operands, setOperands] = useState<(number | null)[]>([])

  useEffect(() => {
    setOperands([])
  }, [operator])

  const opsList = operators[operator as unknown as OpKey]?.operands ?? []

  return (
    <div className="flex gap-4 group">
      <div className="flex-none w-8 text-sm font-bold text-right p-1 flex items-center justify-end font-mono text-slate-900 bg-slate-600 relative">
        {line + 1}
        <button
          tabIndex={-1}
          className="cursor-pointer transition-all opacity-0 hover:opacity-100 z-10 flex absolute items-center justify-center inset-x-0"
        >
          <div className="bg-slate-600 text-red-400 p-1">
            <CircleMinus size={'1.75em'} />
          </div>
        </button>
        <button
          tabIndex={-1}
          className="cursor-pointer transition-all opacity-0 hover:opacity-100 z-10 flex absolute items-center justify-center -bottom-[1em] inset-x-0"
        >
          <div className="bg-slate-600 text-blue-400 rounded-full p-1">
            <CirclePlus size={'1.75em'} />
          </div>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 py-4">
        <div className="flex flex-col gap-1">
          <Label
            className="text-blue-400 font-normal text-xs uppercase"
            htmlFor={`script_op_${line}`}
          >
            Operator
          </Label>
          <OperatorSelector
            id={`script_op_${line}`}
            value={operator}
            setValue={setOperator}
          />
        </div>
        {opsList.map((operand, i) => {
          let type = operand.type
          if (operand.type === 3) {
            if (opsList[i - 1]?.type === 4) {
              const prop = properties[operands[i - 1] as unknown as PropKey]
              if (prop) {
                type = prop.type
              }
            } else if (opsList[i + 1]?.type === 4) {
              const prop = properties[operands[i + 1] as unknown as PropKey]
              if (prop) {
                type = prop.type
              }
            }
          }

          return (
            <div className="flex flex-col gap-1" key={i}>
              <Label
                className="text-slate-400 font-normal text-xs uppercase"
                htmlFor={`script_op_${line}_${i}`}
              >
                {operand.name}
              </Label>
              {operand.type !== 0 && operand.type !== 4 && (
                <VariableSelector
                  type={type}
                  id={`script_op_${line}_${i}`}
                  value={operands[i]}
                  setValue={(val) => {
                    setOperands((arr) => {
                      arr[i] = val
                      return [...arr]
                    })
                  }}
                />
              )}
              {operand.type === 0 && (
                <Input
                  type="number"
                  value={operands[i] ?? ''}
                  min={0}
                  onChange={(e) => {
                    setOperands((arr) => {
                      arr[i] = parseInt(e.target.value)
                      return [...arr]
                    })
                  }}
                />
              )}
              {operand.type === 4 && (
                <PropertySelector
                  id={`script_op_${line}_${i}`}
                  value={(operands[i] ?? '') + ''}
                  setValue={(val) => {
                    setOperands((arr) => {
                      const num = parseInt(val)
                      // todo: var / fix check for type 3
                      arr[i] = isNaN(num) ? null : num
                      return [...arr]
                    })
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
