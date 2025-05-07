// operands: 0: literal, 1: var only, 2: fixed only, 3: var / fixed, 4: property
export type OpKey = keyof typeof operators

export const operators = {
  0x00: {
    name: 'Exit',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x01: {
    name: 'ExitIfNoEnergy',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x02: {
    name: 'ExitIfCooldown',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x06: {
    name: 'ExitIfOwner',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x07: {
    name: 'ExitIfNotOwner',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x08: {
    name: 'ExitIfSameGroup',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x09: {
    name: 'ExitIfNotSameGroup',
    operands: [
      {
        name: 'Exit Flag',
        type: 0,
      },
    ],
  },
  0x11: {
    name: 'Skip',
    operands: [
      {
        name: 'Skip Count',
        type: 1,
      },
    ],
  },
  0x12: {
    name: 'Goto',
    operands: [
      {
        name: 'Cursor Position',
        type: 1,
      },
    ],
  },
  0x13: {
    name: 'ReadProp',
    operands: [
      {
        name: 'Destination',
        type: 3,
      },
      {
        name: 'Property',
        type: 4,
      },
    ],
  },
  0x14: {
    name: 'WriteProp',
    operands: [
      {
        name: 'Property',
        type: 4,
      },
      {
        name: 'Source',
        type: 3,
      },
    ],
  },
  0x15: {
    name: 'AssignByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'Value',
        type: 0,
      },
    ],
  },
  0x16: {
    name: 'AssignRandom',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
    ],
  },
  0x17: {
    name: 'AssignFixed',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'Numerator',
        type: 0,
      },
      {
        name: 'Denominator',
        type: 0,
      },
    ],
  },
  0x18: {
    name: 'ToByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'Source',
        type: 2,
      },
    ],
  },
  0x19: {
    name: 'ToFixed',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'Source',
        type: 1,
      },
    ],
  },
  0x20: {
    name: 'Equal',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x21: {
    name: 'NotEqual',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x22: {
    name: 'LessThan',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x23: {
    name: 'LessThanOrEqual',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x31: {
    name: 'Not',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'Value',
        type: 1,
      },
    ],
  },
  0x32: {
    name: 'Or',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x33: {
    name: 'And',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x40: {
    name: 'Add',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'LHS',
        type: 2,
      },
      {
        name: 'RHS',
        type: 2,
      },
    ],
  },
  0x41: {
    name: 'Sub',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'LHS',
        type: 2,
      },
      {
        name: 'RHS',
        type: 2,
      },
    ],
  },
  0x42: {
    name: 'Mul',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'LHS',
        type: 2,
      },
      {
        name: 'RHS',
        type: 2,
      },
    ],
  },
  0x43: {
    name: 'Div',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'LHS',
        type: 2,
      },
      {
        name: 'RHS',
        type: 2,
      },
    ],
  },
  0x44: {
    name: 'Mod',
    operands: [
      {
        name: 'Destination',
        type: 2,
      },
      {
        name: 'LHS',
        type: 2,
      },
      {
        name: 'RHS',
        type: 2,
      },
    ],
  },
  0x45: {
    name: 'AddByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x46: {
    name: 'SubByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x47: {
    name: 'MulByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x48: {
    name: 'DivByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x49: {
    name: 'ModByte',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x4a: {
    name: 'WrappingAdd',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x50: {
    name: 'Gap',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x51: {
    name: 'Min',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x52: {
    name: 'Max',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x53: {
    name: 'Clamp',
    operands: [
      {
        name: 'Destination',
        type: 1,
      },
      {
        name: 'LHS',
        type: 1,
      },
      {
        name: 'RHS',
        type: 1,
      },
    ],
  },
  0x54: {
    name: 'Negate',
    operands: [
      {
        name: 'Source',
        type: 2,
      },
    ],
  },
  0x60: {
    name: 'LockAction',
    operands: [],
  },
  0x61: {
    name: 'UnlockAction',
    operands: [],
  },
  0x62: {
    name: 'ApplyEnergyCost',
    operands: [],
  },
  0x63: {
    name: 'ApplyDuration',
    operands: [],
  },
  0x70: {
    name: 'ApplyDamage',
    operands: [],
  },
  0x71: {
    name: 'ApplyStatusEffect',
    operands: [],
  },
  0x72: {
    name: 'UpdateCollisionFlags',
    operands: [],
  },
  0x80: {
    name: 'Spawn',
    operands: [
      {
        name: 'Spawn Index',
        type: 1,
      },
    ],
  },
  0x81: {
    name: 'SpawnWithVars',
    operands: [
      {
        name: 'Spawn Index',
        type: 1,
      },
      {
        name: 'spawn.vars[0]',
        type: 1,
      },
      {
        name: 'spawn.vars[1]',
        type: 1,
      },
      {
        name: 'spawn.vars[2]',
        type: 1,
      },
      {
        name: 'spawn.vars[3]',
        type: 1,
      },
    ],
  },
  0x82: {
    name: 'Despawn',
    operands: [],
  },
  0x83: {
    name: 'DespawnOnWallCollision',
    operands: [],
  },
  0xf0: {
    name: 'LogVariable',
    operands: [
      {
        name: 'Variable',
        type: 1,
      },
    ],
  },
}
