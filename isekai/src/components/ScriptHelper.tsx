import { useCallback, useMemo } from 'react'
import { OperatorSelector } from './OperatorSelector'
import { Label } from './ui/label'
import { operators, type OpKey } from '@/constants/operators'
import { VariableSelector } from './VariableSelector'
import { CircleMinus, CirclePlus } from 'lucide-react'
import { Input } from './ui/input'
import { PropertySelector } from './PropertySelector'
import { properties, type PropKey } from '@/constants/properties'
import { isNumber } from '@/utils/isNumber'
import { ErrorBoundary } from './ErrorBoundary'

export interface ScriptHelperProps {
  segments: (number | null)[][]
  onChange: (value: (number | null)[][]) => void
}

export function ScriptHelper({ segments, onChange }: ScriptHelperProps) {
  return (
    <ErrorBoundary fallback={<div>Error occurred. Please refresh.</div>}>
      <div className="flex flex-col">
        {segments.map((s, i) => (
          <ScriptLine
            key={`script_${i}`}
            line={i}
            value={s}
            onChange={(newValue) => {
              segments[i] = newValue
              onChange([...segments])
            }}
            onAdd={() => {
              segments.splice(i + 1, 0, [])
              onChange([...segments])
            }}
            onRemove={() => {
              if (segments.length > 1) {
                segments.splice(i, 1)
                onChange([...segments])
              } else {
                onChange([[]])
              }
            }}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}

interface ScriptLineProps {
  line: number
  value: (number | null)[]
  onChange: (value: (number | null)[]) => void
  onAdd: (line: number) => void
  onRemove: (line: number) => void
}

function ScriptLine({
  line,
  value,
  onChange,
  onAdd,
  onRemove,
}: ScriptLineProps) {
  const { operator, operands } = useMemo(() => {
    if (!isNumber(value[0])) {
      return {
        operator: null,
        operands: [],
      }
    }
    const opsList = operators[value[0] as unknown as OpKey]?.operands ?? []
    const ops = value.slice(1)
    const forced = opsList.findIndex((op) => op.type === 4)

    return {
      operator: value[0],
      operands: opsList.map((op, i) => {
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
      }),
    }
  }, [value])

  const updateChanges = useCallback(
    (operator: number | null, operands: (number | null)[]) => {
      if (!isNumber(operator)) {
        onChange([null])
        return
      }

      const opsList = operators[operator as unknown as OpKey]?.operands ?? []
      const returnValue = [
        operator,
        ...opsList.map((op, i) => {
          if (op.type === 0) return operands[i]
          if (op.type === 4) return operands[i]

          if (isNumber(operands[i])) {
            return operands[i]! % 8
          }
          return null
        }),
      ]

      onChange(returnValue)
    },
    [onChange]
  )

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
              updateChanges(val, operator !== val ? [] : operands)
            }}
          />
        </div>
        {opsList.map((operand, i) => {
          let type = operand.type
          let value = operands[i]
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

          // todo: known bug: correction of var vs fixed
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
                  value={value}
                  setValue={(val) => {
                    operands[i] = val
                    updateChanges(operator, [...operands])
                  }}
                />
              )}
              {operand.type === 0 && (
                <Input
                  type="number"
                  value={operands[i] ?? ''}
                  min={0}
                  onChange={(e) => {
                    operands[i] = parseInt(e.target.value)
                    updateChanges(operator, [...operands])
                  }}
                  placeholder="Enter Value"
                />
              )}
              {operand.type === 4 && (
                <PropertySelector
                  id={`script_op_${line}_${i}`}
                  value={operands[i]}
                  setValue={(val) => {
                    operands[i] = val
                    updateChanges(operator, [...operands])
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
