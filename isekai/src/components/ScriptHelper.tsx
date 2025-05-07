import { useEffect, useState } from 'react'
import { OperatorSelector } from './OperatorSelector'
import { Label } from './ui/label'
import { operators, type OpKey } from '@/constants/operators'
import { VariableSelector } from './VariableSelector'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { Input } from './ui/input'
import { PropertySelector } from './PropertySelector'
import { properties, type PropKey } from '@/constants/properties'
import { isNumber } from '@/utils/isNumber'

export function ScriptHelper() {
  const [script, setScript] = useState<(number | null)[][]>([[]])
  return (
    <>
      <div className="flex flex-col">
        {script.map((s, i) => (
          <ScriptLine
            key={`script_${i}`}
            line={i}
            value={s}
            onChange={(newValue) => {
              if (JSON.stringify(s) !== JSON.stringify(newValue)) {
                setScript((script) => {
                  script[i] = newValue
                  return [...script]
                })
              }
            }}
            onAdd={() => {}}
            onRemove={() => {}}
          />
        ))}
      </div>
      {JSON.stringify(script)}
    </>
  )
}

interface ScriptLineProps {
  line: number
  value: (number | null)[]
  onChange: (value: (number | null)[]) => void
  onAdd: (line: number) => void
  onRemove: (line: number) => void
}

// TODO:
// fixed values (mapping back)
// property

function ScriptLine({
  line,
  value,
  onChange,
  onAdd,
  onRemove,
}: ScriptLineProps) {
  const [operator, setOperator] = useState('')
  const [operands, setOperands] = useState<(number | null)[]>([])

  useEffect(() => {
    if (!isNumber(value[0])) {
      setOperator('')
      return
    }
    const opsList = operators[value[0] as unknown as OpKey]?.operands ?? []
    const ops = value.slice(1)
    const forced = opsList.findIndex((op) => op.type === 4)

    setOperator((op) => {
      if (op !== value[0] + '') {
        setOperands([])
      } else {
        setOperands(
          opsList.map((op, i) => {
            if (isNumber(ops[i])) {
              if (op.type === 3 && forced !== -1 && ops[forced] !== null) {
                if (properties[ops[forced] as unknown as PropKey].type === 2) {
                  ops[i] = (ops[i]! % 8) + 8
                }
              } else if (op.type === 2) {
                ops[i] = (ops[i]! % 8) + 8
              }
            }
            return ops[i] ?? null
          })
        )
      }
      return value[0] + ''
    })
  }, [value])

  useEffect(() => {
    const opsList = operators[operator as unknown as OpKey]?.operands ?? []
    const opr = parseInt(operator)
    const returnValue = [
      isNaN(opr) ? null : opr,
      ...opsList.map((op, i) => {
        // if (!isNumber(operands[i])) return null

        if (op.type === 0) return operands[i]
        if (op.type === 4) return operands[i]

        if (operands[i] !== null) {
          return operands[i] % 8
        }
        return null
      }),
    ]

    onChange(returnValue)
  }, [operator, operands])

  const opsList = operators[operator as unknown as OpKey]?.operands ?? []

  return (
    <div className="flex gap-4 group">
      <div className="flex-none w-8 text-sm font-bold text-right p-1 flex items-center justify-end font-mono text-slate-900 bg-slate-600 relative">
        {line + 1}
        <button
          tabIndex={-1}
          onClick={() => onRemove(line)}
          className="cursor-pointer transition-all opacity-0 hover:opacity-100 z-10 flex absolute items-center justify-center inset-x-0"
        >
          <div className="bg-slate-600 text-red-400 p-1">
            <CircleMinus size={'1.75em'} />
          </div>
        </button>
        <button
          tabIndex={-1}
          onClick={() => onAdd(line)}
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
            setValue={(val) => {
              setOperator((old) => {
                if (old !== val) {
                  setOperands([])
                }
                return val
              })
            }}
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
                  placeholder="Enter Value"
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
                      arr[i] = isNumber(num) ? null : num
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
