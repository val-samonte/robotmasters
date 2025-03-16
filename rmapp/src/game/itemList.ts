export const cpuDesc: any = {
  ground: 'When grounded',
  air: 'When on air',
  'w.lean': 'When leaning on wall',
  'w.slip': 'When sliding on wall',
  flip: 'When flipped',
  'bat.10': 'When energy below 10%',
  'bat.20': 'When energy below 20%',
  'bat.50': ' When energy below 50%',
  'no ammo': 'When no ammo',
  'roll 20': '1 out of 5 chance',
  'roll 10': '1 out of 10 chance',
  always: 'Always',
}

export const statTips: any = {
  HP: {
    title: 'Hit Points (HP)',
    message: 'The "life" of the Robot Master.',
  },
  ENG: {
    title: 'Energy (ENG)',
    message: 'Required for some actions.',
  },
  GEN: {
    title: 'Generator (GEN)',
    message: 'Energy regen : per frame.',
  },
  POW: {
    title: 'Power (POW)',
    message: 'Robot carrying capacity.',
  },
  WGT: {
    title: 'Weight (WGT)',
    message: 'Overweight if POW < WGT.',
  },
  ELEM: {
    title: 'Element (ELEM)',
    message: 'Weapon elemental property.',
  },
  DMG: {
    title: 'Damage (DMG)',
    message: 'Weapon damage.',
  },
  ROF: {
    title: 'Rate of Fire (ROF)',
    message: 'Frames per shot.',
  },
  AMMO: {
    title: 'Ammo Capacity (AMMO)',
    message: 'Shots before reload.',
  },
  RCD: {
    title: 'Reload Cooldown (RCD)',
    message: 'Frames to reload.',
  },
}

// 0 is grounded
// 1 wall leaning
// 2 wall slipping
// 3 is flipped
// 4 bat 10
// 5 bat 20
// 6 bat 50
// 7 no ammo
// 8 roll 20
// 9 roll 10
// 19 always

// 0 run
// 1 turn
// 2 jump
// 3 w.jump
// 4 flip gravity
// 5 recharge
// 7 shoot
// 8 reload

export const paints = [
  {
    id: 'default',
    primary: '#5B6EE1',
    secondary: '#FFFFFF',
  },
  {
    id: 'cut',
    primary: '#787878',
    secondary: '#F8F8F8',
  },
  {
    id: 'elec',
    primary: '#787878',
    secondary: '#FFDC78',
  },
  {
    id: 'ice',
    primary: '#0058FF',
    secondary: '#F8F8F8',
  },
  {
    id: 'fire',
    primary: '#FF3800',
    secondary: '#FFBC00',
  },
  {
    id: 'bomb',
    primary: '#00BC00',
    secondary: '#F8F8F8',
  },
  {
    id: 'guts',
    primary: '#E45C10',
    secondary: '#F8F8F8',
  },
  {
    id: 'rock',
    primary: '#0078FF',
    secondary: '#00ECDC',
  },
]

export const itemDetails: any = {
  '': {
    name: ' ',
    desc: 'Please select parts and press NEXT.',
  },
  head_0: {
    type: 'head',
    name: 'HERMES HEAD',
    desc: 'Light head. Contains agile CPU.',
    details: {
      img: '/icons/head_0.png',
      stats: [['WGT', 2]],
      cpu: ['bat.10', 'roll 10', 'w.slip', 'ground', 'no ammo', 'w.lean'],
      protection: [['P', 3]],
    },
  },
  head_1: {
    type: 'head',
    name: 'APOLLO HEAD',
    desc: 'Basic head. Contains standard CPU.',
    details: {
      img: '/icons/head_1.png',
      stats: [['WGT', 4]],
      cpu: ['bat.10', 'roll 20', 'w.slip', 'roll 10', 'no ammo', 'w.lean'],
      protection: [
        ['P', 2],
        ['H', 2],
      ],
    },
  },
  head_2: {
    type: 'head',
    name: 'HERCULES HEAD',
    desc: 'Heavy head with all rounder CPU.',
    details: {
      img: '/icons/head_2.png',
      stats: [['WGT', 5]],
      cpu: ['bat.20', 'roll 20', 'no ammo', 'roll 20', 'w.lean', 'w.slip'],
      protection: [
        ['P', 1],
        ['B', 4],
        ['H', 1],
      ],
    },
  },
  body_0: {
    type: 'body',
    name: 'HERMES BODY',
    desc: 'Light body capable of fast charging.',
    details: {
      img: '/icons/body_0.png',
      stats: [
        ['GEN', '1:1'],
        ['POW', 20],
        ['WGT', 8],
      ],
      actions: [['charge', 0]],
      protection: [['P', 10]],
    },
  },
  body_1: {
    type: 'body',
    name: 'APOLLO BODY',
    desc: 'Standard body with decent generator.',
    details: {
      img: '/icons/body_1.png',
      stats: [
        ['GEN', '2:2'],
        ['POW', 28],
        ['WGT', 10],
      ],
      actions: [['charge', 0]],
      protection: [
        ['P', 6],
        ['H', 6],
      ],
    },
  },
  body_2: {
    type: 'body',
    name: 'HERCULES BODY',
    desc: 'More power output in exchange of slow generator.',
    details: {
      img: '/icons/body_2.png',
      stats: [
        ['GEN', '1:2'],
        ['POW', 38],
        ['WGT', 12],
      ],
      actions: [['charge', 0]],
      protection: [
        ['P', 4],
        ['B', 9],
        ['H', 4],
      ],
    },
  },
  legs_0: {
    type: 'legs',
    name: 'HERMES LEGS',
    desc: 'Unlocks wall jumping.',
    details: {
      img: '/icons/legs_0.png',
      stats: [['WGT', 4]],
      actions: [
        ['w.jump', 6],
        ['jump', 3],
        ['turn', 1],
        ['run', 0],
      ],
      protection: [['P', 3]],
    },
  },
  legs_1: {
    type: 'legs',
    name: 'APOLLO LEGS',
    desc: 'Unlocks wall jumping.',
    details: {
      img: '/icons/legs_1.png',
      stats: [['WGT', 6]],
      actions: [
        ['w.jump', 6],
        ['jump', 3],
        ['turn', 1],
        ['run', 0],
      ],
      protection: [
        ['P', 2],
        ['H', 2],
      ],
    },
  },
  legs_2: {
    type: 'legs',
    name: 'HERCULES LEGS',
    desc: 'Heavy duty legs that offers better protection.',
    details: {
      img: '/icons/legs_2.png',
      stats: [['WGT', 8]],
      actions: [
        ['jump', 3],
        ['turn', 1],
        ['run', 0],
      ],
      protection: [
        ['P', 1],
        ['B', 4],
        ['H', 1],
      ],
    },
  },
  hg_0: {
    type: 'weapon',
    name: 'P420',
    desc: 'All rounder weapon with high ROF.',
    details: {
      img: '/icons/hg_0.png',
      stats: [
        ['ELEM', 'P'],
        ['DMG', 8],
        ['ROF', 15],
        ['AMMO', 12],
        ['RCD', 60],
        ['WGT', 2],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 5],
      ],
    },
  },
  hg_1: {
    type: 'weapon',
    name: 'MONGOOSE',
    desc: 'Powerful magnum with slow ROF.',
    details: {
      img: '/icons/hg_1.png',
      stats: [
        ['ELEM', 'P'],
        ['DMG', 14],
        ['ROF', 120],
        ['AMMO', 6],
        ['RCD', 90],
        ['WGT', 4],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 5],
      ],
    },
  },
  hg_2: {
    type: 'weapon',
    name: 'Q2.BLSTR',
    desc: 'Shoots energy projectiles.',
    details: {
      img: '/icons/hg_2.png',
      stats: [
        ['ELEM', 'H'],
        ['DMG', 8],
        ['ROF', 30],
        ['AMMO', 3],
        ['RCD', 60],
        ['WGT', 6],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 5],
      ],
    },
  },
  gl_0: {
    type: 'weapon',
    name: 'HKP',
    desc: '40mm grenade launcher. Explodes on impact.',
    details: {
      img: '/icons/gl_0.png',
      stats: [
        ['ELEM', 'B'],
        ['DMG', 24],
        ['AMMO', 1],
        ['RCD', 240],
        ['WGT', 8],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 10],
      ],
    },
  },
  gl_1: {
    type: 'weapon',
    name: 'Q2.GL',
    desc: 'High ROF GL. Bounces off walls.',
    details: {
      img: '/icons/gl_1.png',
      stats: [
        ['ELEM', 'H'],
        ['DMG', 16],
        ['ROF', 60],
        ['AMMO', 3],
        ['RCD', 240],
        ['WGT', 18],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 10],
      ],
    },
  },
  gl_2: {
    type: 'weapon',
    name: 'MM1',
    desc: '40mm GL with large magazine.',
    details: {
      img: '/icons/gl_2.png',
      stats: [
        ['ELEM', 'B'],
        ['DMG', 8],
        ['ROF', 60],
        ['AMMO', 24],
        ['RCD', 240],
        ['WGT', 24],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 10],
      ],
    },
  },
}
