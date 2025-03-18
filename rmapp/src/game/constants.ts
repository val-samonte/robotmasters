// [
//   1,   // firearm
//   2,   // projectile lookup index
//   1,   // projectile ejection method
//   2,   // attack energy cost
//   10,  // reload energy cost
//   120, // reload cooldown
//   1,   // ammo cap
//   0    // rate of fire
// ],
// [
//   1,   // firearm
//   3,   // projectile lookup index
//   1,   // projectile ejection method
//   2,   // attack energy cost
//   6,   // reload energy cost
//   240, // reload cooldown
//   6,   // ammo cap
//   50   // rate of fire
// ],

export const cpuLookup = [
  'ground', //  0
  'w.lean', //  1
  'w.slip', //  2
  'flip', //    3
  'bat.10', //  4
  'bat.20', //  5
  'bat.50', //  6
  'no ammo', // 7
  'roll 20', // 8
  'roll 10', // 9
  'always', //  10
]

export const actionLookup = [
  'run', //    0
  'turn', //   1
  'jump', //   2
  'w.jump', // 3
  'flip', //   4
  'charge', // 5
  'hurt', //   6
  'shoot', //  7
  'reload', // 8
]

export const elemLookup = [
  'P', // Punct
  'B', // Blast
  'F', // Force
  'S', // Sever
  'H', // Heat
  'C', // Cryo
  'J', // Jolt
  'V', // Virus
]

export const maps = [
  {
    id: 'demo',
    skin: '/skins/map_demo.png',
    tiles: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    spawnPositions: [
      {
        x: 16,
        y: 196,
        facing_right: true,
      },
      {
        x: 224,
        y: 196,
        facing_right: false,
      },
    ],
  },
]
