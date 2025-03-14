export const cpuDesc: any = {
  ground: 'When grounded',
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

export const itemDetails: any = {
  '': {
    name: ' ',
    desc: 'Please select parts and press NEXT.',
  },
  head_0: {
    name: 'HERMES HEAD',
    desc: 'Light head. Contains agile CPU.',
    details: {
      img: '/head_light.png',
      stats: [['WGT', 2]],
      cpu: ['bat.10', 'roll 10', 'w.slip', 'ground', 'no ammo', 'w.lean'],
      protection: [['punct', 3]],
    },
  },
  head_2: {
    name: 'HERCULES HEAD',
    desc: 'Heavy head with all rounder CPU.',
    details: {
      img: '/head_heavy.png',
      stats: [['WGT', 5]],
      cpu: ['bat.20', 'roll 20', 'no ammo', 'roll 20', 'w.lean', 'w.slip'],
      protection: [
        ['punct', 1],
        ['blast', 3],
      ],
    },
  },
  body_0: {
    name: 'HERMES BODY',
    desc: 'Light body capable of fast charging.',
    details: {
      img: '/body_light.png',
      stats: [
        ['POW', 18],
        ['GEN', '1:1'],
        ['WGT', 8],
      ],
      actions: [['charge', 0]],
      protection: [['punct', 10]],
    },
  },
  body_2: {
    name: 'HERCULES BODY',
    desc: 'More power output in exchange of slow generator.',
    details: {
      img: '/body_heavy.png',
      stats: [
        ['POW', 38],
        ['GEN', '1:2'],
        ['WGT', 12],
      ],
      actions: [['charge', 0]],
      protection: [
        ['punct', 4],
        ['blast', 8],
      ],
    },
  },
  legs_0: {
    name: 'HERMES LEGS',
    desc: 'Unlocks wall jumping.',
    details: {
      img: '/legs_light.png',
      stats: [['WGT', 4]],
      actions: [
        ['w.jump', 6],
        ['jump', 3],
        ['turn', 1],
        ['run', 0],
      ],
      protection: [['punct', 3]],
    },
  },
  legs_2: {
    name: 'HERCULES LEGS',
    desc: 'Heavy duty legs that offers better protection.',
    details: {
      img: '/legs_light.png',
      stats: [['WGT', 8]],
      actions: [
        ['jump', 3],
        ['turn', 1],
        ['run', 0],
      ],
      protection: [
        ['punct', 1],
        ['blast', 3],
      ],
    },
  },
  hg_0: {
    name: 'P420',
    desc: 'All rounder weapon with high ROF.',
    details: {
      img: '/hg_0.png',
      stats: [
        ['ELEM', 'punct'],
        ['DMG', 4],
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
    name: 'MONGOOSE',
    desc: 'Powerful magnum with slow ROF.',
    details: {
      img: '/hg_1.png',
      stats: [
        ['ELEM', 'punct'],
        ['DMG', 10],
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
    name: 'Q2.BLSTR',
    desc: 'Shoots energy projectiles.',
    details: {
      img: '/hg_2.png',
      stats: [
        ['ELEM', 'heat'],
        ['DMG', 6],
        ['ROF', 30],
        ['AMMO', 3],
        ['RCD', 60],
        ['WGT', 3],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 5],
      ],
    },
  },
  gl_0: {
    name: 'HKP',
    desc: '40mm grenade launcher. Explodes on impact.',
    details: {
      img: '/gl_0.png',
      stats: [
        ['ELEM', 'blast'],
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
    name: 'Q2.GL',
    desc: 'High ROF GL. Bounces off walls.',
    details: {
      img: '/gl_1.png',
      stats: [
        ['ELEM', 'blast'],
        ['DMG', 16],
        ['ROF', 60],
        ['AMMO', 3],
        ['RCD', 240],
        ['WGT', 16],
      ],
      actions: [
        ['shoot', 2],
        ['reload', 10],
      ],
    },
  },
  gl_2: {
    name: 'MM1',
    desc: '40mm GL with large magazine.',
    details: {
      img: '/gl_2.png',
      stats: [
        ['ELEM', 'blast'],
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
