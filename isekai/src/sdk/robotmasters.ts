/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/robotmasters.json`.
 */
export type Robotmasters = {
  "address": "BSi1fEa8drVMVNTRhYV3fga467x9Rt5YteMEUHbebxLP",
  "metadata": {
    "name": "robotmasters",
    "version": "0.2.3",
    "spec": "0.1.0",
    "description": "Created with Bolt"
  },
  "instructions": [
    {
      "name": "createAction",
      "discriminator": [
        125,
        159,
        123,
        141,
        6,
        144,
        175,
        4
      ],
      "accounts": [
        {
          "name": "action",
          "writable": true
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createActionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createCond",
      "discriminator": [
        22,
        33,
        19,
        201,
        217,
        240,
        173,
        93
      ],
      "accounts": [
        {
          "name": "cond",
          "writable": true
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  100,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createConditionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createGame",
      "discriminator": [
        124,
        69,
        75,
        66,
        184,
        220,
        72,
        206
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createItemPart",
      "discriminator": [
        83,
        48,
        84,
        45,
        234,
        146,
        165,
        227
      ],
      "accounts": [
        {
          "name": "itemPart",
          "writable": true
        },
        {
          "name": "itemBlueprintLink",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  116,
                  101,
                  109,
                  95,
                  98,
                  108,
                  117,
                  101,
                  112,
                  114,
                  105,
                  110,
                  116,
                  95,
                  108,
                  105,
                  110,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "blueprint"
              }
            ]
          }
        },
        {
          "name": "blueprint"
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  116,
                  101,
                  109,
                  95,
                  112,
                  97,
                  114,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createItemPartArgs"
            }
          }
        }
      ]
    },
    {
      "name": "createSpawn",
      "discriminator": [
        248,
        172,
        26,
        56,
        69,
        21,
        136,
        58
      ],
      "accounts": [
        {
          "name": "spawn",
          "writable": true
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "manager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  97,
                  119,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "createSpawnArgs"
            }
          }
        }
      ]
    },
    {
      "name": "delegateGame",
      "discriminator": [
        116,
        183,
        70,
        107,
        112,
        223,
        122,
        210
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                155,
                42,
                194,
                221,
                78,
                60,
                26,
                193,
                29,
                110,
                190,
                149,
                175,
                97,
                203,
                4,
                138,
                98,
                54,
                1,
                20,
                59,
                46,
                204,
                106,
                32,
                39,
                231,
                228,
                244,
                35,
                128
              ]
            }
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "docs": [
            "CHECK GameState"
          ],
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "BSi1fEa8drVMVNTRhYV3fga467x9Rt5YteMEUHbebxLP"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "init",
      "discriminator": [
        220,
        59,
        207,
        236,
        108,
        250,
        47,
        100
      ],
      "accounts": [
        {
          "name": "admin",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "matchCounter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  99,
                  111,
                  117,
                  110,
                  116,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "itemManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  116,
                  101,
                  109,
                  95,
                  112,
                  97,
                  114,
                  116,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "condManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  100,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "actionManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "spawnManager",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  112,
                  97,
                  119,
                  110,
                  95,
                  109,
                  97,
                  110,
                  97,
                  103,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "initArgs"
            }
          }
        }
      ]
    },
    {
      "name": "processUndelegation",
      "discriminator": [
        196,
        28,
        41,
        206,
        48,
        37,
        51,
        167
      ],
      "accounts": [
        {
          "name": "baseAccount",
          "writable": true
        },
        {
          "name": "buffer"
        },
        {
          "name": "payer",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    },
    {
      "name": "runGame",
      "discriminator": [
        234,
        72,
        19,
        218,
        1,
        185,
        22,
        18
      ],
      "accounts": [
        {
          "name": "gameState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "undelegateGameGame",
      "discriminator": [
        31,
        203,
        84,
        48,
        207,
        197,
        243,
        68
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "gameState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  51
                ]
              }
            ]
          }
        },
        {
          "name": "magicProgram",
          "address": "Magic11111111111111111111111111111111111111"
        },
        {
          "name": "magicContext",
          "writable": true,
          "address": "MagicContext1111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "updateAction",
      "discriminator": [
        31,
        4,
        202,
        169,
        214,
        55,
        240,
        55
      ],
      "accounts": [
        {
          "name": "action",
          "writable": true
        },
        {
          "name": "control"
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateActionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateCond",
      "discriminator": [
        69,
        191,
        75,
        236,
        200,
        15,
        48,
        68
      ],
      "accounts": [
        {
          "name": "cond",
          "writable": true
        },
        {
          "name": "control"
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateConditionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateItemPart",
      "discriminator": [
        178,
        142,
        177,
        106,
        171,
        233,
        63,
        59
      ],
      "accounts": [
        {
          "name": "itemPart",
          "writable": true
        },
        {
          "name": "control"
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateItemPartArgs"
            }
          }
        }
      ]
    },
    {
      "name": "updateSpawn",
      "discriminator": [
        140,
        82,
        252,
        78,
        113,
        54,
        232,
        228
      ],
      "accounts": [
        {
          "name": "spawn",
          "writable": true
        },
        {
          "name": "control"
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "updateSpawnArgs"
            }
          }
        }
      ]
    },
    {
      "name": "versionAction",
      "discriminator": [
        146,
        182,
        43,
        8,
        32,
        183,
        111,
        186
      ],
      "accounts": [
        {
          "name": "newAction",
          "writable": true
        },
        {
          "name": "oldAction"
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "versionActionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "versionCond",
      "discriminator": [
        198,
        37,
        222,
        167,
        77,
        37,
        4,
        50
      ],
      "accounts": [
        {
          "name": "newCond",
          "writable": true
        },
        {
          "name": "oldCond"
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "versionConditionArgs"
            }
          }
        }
      ]
    },
    {
      "name": "versionItemPart",
      "discriminator": [
        200,
        59,
        59,
        251,
        30,
        48,
        75,
        44
      ],
      "accounts": [
        {
          "name": "newItemPart",
          "writable": true
        },
        {
          "name": "oldItemPart"
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "versionItemPartArgs"
            }
          }
        }
      ]
    },
    {
      "name": "versionSpawn",
      "discriminator": [
        13,
        21,
        189,
        126,
        242,
        15,
        73,
        28
      ],
      "accounts": [
        {
          "name": "newSpawn",
          "writable": true
        },
        {
          "name": "oldSpawn"
        },
        {
          "name": "control",
          "writable": true
        },
        {
          "name": "admin",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  109,
                  105,
                  110
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": {
              "name": "versionSpawnArgs"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "action",
      "discriminator": [
        144,
        241,
        105,
        219,
        74,
        136,
        203,
        176
      ]
    },
    {
      "name": "admin",
      "discriminator": [
        244,
        158,
        220,
        65,
        8,
        73,
        4,
        65
      ]
    },
    {
      "name": "componentControl",
      "discriminator": [
        49,
        139,
        83,
        23,
        212,
        46,
        66,
        135
      ]
    },
    {
      "name": "componentManager",
      "discriminator": [
        218,
        225,
        60,
        31,
        203,
        238,
        96,
        98
      ]
    },
    {
      "name": "condition",
      "discriminator": [
        138,
        226,
        74,
        204,
        104,
        23,
        135,
        63
      ]
    },
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    },
    {
      "name": "itemBlueprintLink",
      "discriminator": [
        215,
        57,
        196,
        23,
        209,
        202,
        106,
        178
      ]
    },
    {
      "name": "itemPart",
      "discriminator": [
        57,
        41,
        142,
        107,
        131,
        69,
        161,
        132
      ]
    },
    {
      "name": "matchCounter",
      "discriminator": [
        173,
        113,
        64,
        44,
        171,
        44,
        96,
        254
      ]
    },
    {
      "name": "spawn",
      "discriminator": [
        128,
        79,
        118,
        139,
        192,
        197,
        134,
        233
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorize",
      "msg": "Signer is not authorized to update this account."
    },
    {
      "code": 6001,
      "name": "invalidState",
      "msg": "Only Published accounts can have new versions."
    }
  ],
  "types": [
    {
      "name": "action",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "version",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "energyCost",
            "type": "u8"
          },
          {
            "name": "interval",
            "type": "u16"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "admin",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "itemAuthority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "componentControl",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "active",
            "type": "u32"
          },
          {
            "name": "counter",
            "type": "u32"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "componentManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "counter",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "componentState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "draft"
          },
          {
            "name": "pending"
          },
          {
            "name": "rejected"
          },
          {
            "name": "approved"
          },
          {
            "name": "published"
          },
          {
            "name": "deprecated"
          }
        ]
      }
    },
    {
      "name": "condition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "version",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "energyMulNum",
            "type": "u8"
          },
          {
            "name": "energyMulDen",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "createActionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "energyCost",
            "type": "u8"
          },
          {
            "name": "interval",
            "type": "u16"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "createConditionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "energyMulNum",
            "type": "u8"
          },
          {
            "name": "energyMulDen",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "createItemPartArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "itemType",
            "type": {
              "defined": {
                "name": "itemPartType"
              }
            }
          },
          {
            "name": "itemTypeVariation",
            "type": "u8"
          },
          {
            "name": "itemTier",
            "type": "u8"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "weight",
            "type": "u8"
          },
          {
            "name": "power",
            "type": "u8"
          },
          {
            "name": "energy",
            "type": "u8"
          },
          {
            "name": "energyRegen",
            "type": "u8"
          },
          {
            "name": "energyRate",
            "type": "u16"
          },
          {
            "name": "armor",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "conditions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "actions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "effects",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "createSpawnArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "healthCap",
            "type": "u8"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "damageBase",
            "type": "u8"
          },
          {
            "name": "damageRange",
            "type": "u8"
          },
          {
            "name": "critChance",
            "type": "u8"
          },
          {
            "name": "critMultiplier",
            "type": "u8"
          },
          {
            "name": "element",
            "type": "u8"
          },
          {
            "name": "destroyOnCollision",
            "type": "bool"
          },
          {
            "name": "width",
            "type": "u8"
          },
          {
            "name": "height",
            "type": "u8"
          },
          {
            "name": "outputX",
            "type": "u8"
          },
          {
            "name": "outputY",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "element",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "punct"
          },
          {
            "name": "blast"
          },
          {
            "name": "force"
          },
          {
            "name": "sever"
          },
          {
            "name": "heat"
          },
          {
            "name": "cryo"
          },
          {
            "name": "jolt"
          },
          {
            "name": "virus"
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "len",
            "type": "u16"
          },
          {
            "name": "frame",
            "type": "u16"
          },
          {
            "name": "data",
            "type": {
              "array": [
                "u8",
                3600
              ]
            }
          }
        ]
      }
    },
    {
      "name": "initArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "itemAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "itemBlueprintLink",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "blueprint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "itemPart",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "version",
            "type": "u32"
          },
          {
            "name": "itemType",
            "type": {
              "defined": {
                "name": "itemPartType"
              }
            }
          },
          {
            "name": "itemTypeVariation",
            "type": "u8"
          },
          {
            "name": "itemTier",
            "type": "u8"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "weight",
            "type": "u8"
          },
          {
            "name": "power",
            "type": "u8"
          },
          {
            "name": "energy",
            "type": "u8"
          },
          {
            "name": "energyRegen",
            "type": "u8"
          },
          {
            "name": "energyRate",
            "type": "u16"
          },
          {
            "name": "armor",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "reserve",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "conditions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "actions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "effects",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "itemPartType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "head"
          },
          {
            "name": "body"
          },
          {
            "name": "legs"
          },
          {
            "name": "main"
          },
          {
            "name": "offhand"
          },
          {
            "name": "back"
          }
        ]
      }
    },
    {
      "name": "matchCounter",
      "docs": [
        "Used to get realtime list of opponents onchain.",
        "Updated when players deployed their characters (+1) / matched (-1)."
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "band",
            "docs": [
              "Elo rating band, 1200 for instance, will update index position 12's counter.",
              "Wraps around if exceeds 255."
            ],
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "spawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "version",
            "type": "u32"
          },
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "healthCap",
            "type": "u8"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "damageBase",
            "type": "u8"
          },
          {
            "name": "damageRange",
            "type": "u8"
          },
          {
            "name": "critChance",
            "type": "u8"
          },
          {
            "name": "critMultiplier",
            "type": "u8"
          },
          {
            "name": "element",
            "type": {
              "defined": {
                "name": "element"
              }
            }
          },
          {
            "name": "destroyOnCollision",
            "type": "bool"
          },
          {
            "name": "width",
            "type": "u8"
          },
          {
            "name": "height",
            "type": "u8"
          },
          {
            "name": "outputX",
            "type": "u8"
          },
          {
            "name": "outputY",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "updateActionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "energyCost",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "interval",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "duration",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "args",
            "type": {
              "option": {
                "array": [
                  "u8",
                  4
                ]
              }
            }
          },
          {
            "name": "script",
            "type": {
              "option": "bytes"
            }
          },
          {
            "name": "spawns",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateConditionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "energyMulNum",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "energyMulDen",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "args",
            "type": {
              "option": {
                "array": [
                  "u8",
                  4
                ]
              }
            }
          },
          {
            "name": "script",
            "type": {
              "option": "bytes"
            }
          }
        ]
      }
    },
    {
      "name": "updateItemPartArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "itemTypeVariation",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "itemTier",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "health",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "weight",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "power",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "energy",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "energyRegen",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "energyRate",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "armor",
            "type": {
              "option": {
                "array": [
                  "u8",
                  8
                ]
              }
            }
          },
          {
            "name": "conditions",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          },
          {
            "name": "actions",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          },
          {
            "name": "spawns",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          },
          {
            "name": "effects",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          }
        ]
      }
    },
    {
      "name": "updateSpawnArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": {
                "name": "componentState"
              }
            }
          },
          {
            "name": "healthCap",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "duration",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "damageBase",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "damageRange",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "critChance",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "critMultiplier",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "element",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "destroyOnCollision",
            "type": {
              "option": "bool"
            }
          },
          {
            "name": "width",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "height",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "outputX",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "outputY",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "args",
            "type": {
              "option": {
                "array": [
                  "u8",
                  4
                ]
              }
            }
          },
          {
            "name": "script",
            "type": {
              "option": "bytes"
            }
          },
          {
            "name": "spawns",
            "type": {
              "option": {
                "vec": "u32"
              }
            }
          }
        ]
      }
    },
    {
      "name": "versionActionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "energyCost",
            "type": "u8"
          },
          {
            "name": "interval",
            "type": "u16"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "versionConditionArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "energyMulNum",
            "type": "u8"
          },
          {
            "name": "energyMulDen",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "versionItemPartArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "itemTypeVariation",
            "type": "u8"
          },
          {
            "name": "itemTier",
            "type": "u8"
          },
          {
            "name": "health",
            "type": "u8"
          },
          {
            "name": "weight",
            "type": "u8"
          },
          {
            "name": "power",
            "type": "u8"
          },
          {
            "name": "energy",
            "type": "u8"
          },
          {
            "name": "energyRegen",
            "type": "u8"
          },
          {
            "name": "energyRate",
            "type": "u16"
          },
          {
            "name": "armor",
            "type": {
              "array": [
                "u8",
                8
              ]
            }
          },
          {
            "name": "conditions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "actions",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          },
          {
            "name": "effects",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "versionSpawnArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "healthCap",
            "type": "u8"
          },
          {
            "name": "duration",
            "type": "u16"
          },
          {
            "name": "damageBase",
            "type": "u8"
          },
          {
            "name": "damageRange",
            "type": "u8"
          },
          {
            "name": "critChance",
            "type": "u8"
          },
          {
            "name": "critMultiplier",
            "type": "u8"
          },
          {
            "name": "element",
            "type": "u8"
          },
          {
            "name": "destroyOnCollision",
            "type": "bool"
          },
          {
            "name": "width",
            "type": "u8"
          },
          {
            "name": "height",
            "type": "u8"
          },
          {
            "name": "outputX",
            "type": "u8"
          },
          {
            "name": "outputY",
            "type": "u8"
          },
          {
            "name": "args",
            "type": {
              "array": [
                "u8",
                4
              ]
            }
          },
          {
            "name": "script",
            "type": "bytes"
          },
          {
            "name": "spawns",
            "type": {
              "vec": "u32"
            }
          }
        ]
      }
    }
  ]
};
