/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/itembox.json`.
 */
export type Itembox = {
  address: '2pYTUmoW7ZLCAwqztVQnXS6EwW8m8sdxMqEhFbdK6Bat'
  metadata: {
    name: 'itembox'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'craftItem'
      discriminator: [196, 249, 129, 219, 148, 234, 223, 222]
      accounts: [
        {
          name: 'recipe'
        },
        {
          name: 'blueprint'
          writable: true
          relations: ['recipe']
        },
        {
          name: 'treasury'
          writable: true
          relations: ['blueprint']
        },
        {
          name: 'mint'
          writable: true
          relations: ['blueprint']
        },
        {
          name: 'ownerAta'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'owner'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'assetSigner'
          writable: true
          signer: true
        },
        {
          name: 'main'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 105, 110]
              }
            ]
          }
        },
        {
          name: 'mplCoreProgram'
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'tokenProgramOld'
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'craftItemArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createFungibleBlueprint'
      discriminator: [138, 43, 164, 103, 217, 191, 244, 48]
      accounts: [
        {
          name: 'blueprint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [98, 108, 117, 101, 112, 114, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
          }
        },
        {
          name: 'treasury'
          writable: true
          relations: ['main']
        },
        {
          name: 'main'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 105, 110]
              }
            ]
          }
        },
        {
          name: 'mint'
          writable: true
          signer: true
        },
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        },
        {
          name: 'extraMetasAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [
                  101,
                  120,
                  116,
                  114,
                  97,
                  45,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                  45,
                  109,
                  101,
                  116,
                  97,
                  115
                ]
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
          }
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createFungibleBlueprintArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createNonfungibleBlueprint'
      discriminator: [6, 140, 40, 27, 68, 110, 112, 2]
      accounts: [
        {
          name: 'blueprint'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [98, 108, 117, 101, 112, 114, 105, 110, 116]
              },
              {
                kind: 'account'
                path: 'collection'
              }
            ]
          }
        },
        {
          name: 'treasury'
          writable: true
          relations: ['main']
        },
        {
          name: 'main'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 105, 110]
              }
            ]
          }
        },
        {
          name: 'collection'
          writable: true
          signer: true
        },
        {
          name: 'owner'
          writable: true
          signer: true
        },
        {
          name: 'mplCoreProgram'
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createNonFungibleBlueprintArgs'
            }
          }
        }
      ]
    },
    {
      name: 'createRecipe'
      discriminator: [64, 139, 143, 169, 196, 212, 15, 56]
      accounts: [
        {
          name: 'recipe'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [114, 101, 99, 105, 112, 101]
              },
              {
                kind: 'account'
                path: 'recipeId'
              }
            ]
          }
        },
        {
          name: 'recipeId'
          signer: true
        },
        {
          name: 'authority'
          writable: true
          signer: true
          relations: ['blueprint']
        },
        {
          name: 'blueprint'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'createRecipeArgs'
            }
          }
        }
      ]
    },
    {
      name: 'init'
      discriminator: [220, 59, 207, 236, 108, 250, 47, 100]
      accounts: [
        {
          name: 'main'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 105, 110]
              }
            ]
          }
        },
        {
          name: 'authority'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'initArgs'
            }
          }
        }
      ]
    },
    {
      name: 'mintItem'
      discriminator: [22, 168, 67, 95, 238, 168, 162, 191]
      accounts: [
        {
          name: 'blueprint'
          writable: true
        },
        {
          name: 'mint'
          writable: true
          relations: ['blueprint']
        },
        {
          name: 'receiverAta'
          writable: true
          optional: true
          pda: {
            seeds: [
              {
                kind: 'account'
                path: 'receiver'
              },
              {
                kind: 'account'
                path: 'tokenProgram'
              },
              {
                kind: 'account'
                path: 'mint'
              }
            ]
            program: {
              kind: 'const'
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          name: 'receiver'
          writable: true
        },
        {
          name: 'mintAuthority'
          writable: true
          signer: true
          relations: ['blueprint']
        },
        {
          name: 'assetSigner'
          writable: true
          signer: true
        },
        {
          name: 'main'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [109, 97, 105, 110]
              }
            ]
          }
        },
        {
          name: 'mplCoreProgram'
          address: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d'
        },
        {
          name: 'tokenProgram'
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
        },
        {
          name: 'associatedTokenProgram'
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        },
        {
          name: 'rent'
          address: 'SysvarRent111111111111111111111111111111111'
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: [
        {
          name: 'args'
          type: {
            defined: {
              name: 'mintItemArgs'
            }
          }
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'blueprint'
      discriminator: [206, 153, 205, 149, 151, 195, 104, 23]
    },
    {
      name: 'main'
      discriminator: [103, 173, 93, 26, 84, 137, 56, 96]
    },
    {
      name: 'recipe'
      discriminator: [10, 162, 156, 100, 56, 193, 205, 77]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'maxSupplyReached'
      msg: 'Max supply reached'
    },
    {
      code: 6001
      name: 'missingOwnerAtaAccount'
      msg: 'Missing owner associated token account'
    },
    {
      code: 6002
      name: 'cannotMintMoreThanOneNonFungibleItem'
      msg: 'Cannot mint more than one non-fungible item'
    }
  ]
  types: [
    {
      name: 'blueprint'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            docs: ['Bump nonce of the PDA. (1)']
            type: 'u8'
          },
          {
            name: 'mint'
            docs: [
              'The address of the metaplex core collection with master edition plugin OR',
              'the mint address of the fungible token. (32)'
            ]
            type: 'pubkey'
          },
          {
            name: 'nonFungible'
            docs: ['Whether the item is non-fungible. (1)']
            type: 'bool'
          },
          {
            name: 'authority'
            docs: [
              'The creator and owner of this blueprint,',
              'which also acts as the update authority. (32)'
            ]
            type: 'pubkey'
          },
          {
            name: 'treasury'
            docs: [
              'The receiver of the transfered items if the Recipe is configured',
              'to transfer an ingredient. (32)'
            ]
            type: 'pubkey'
          },
          {
            name: 'mintAuthority'
            docs: [
              'The account who can mint the item of this blueprint.',
              'Note: Recipes are still able to MINT this item if the condition is met. (32)'
            ]
            type: 'pubkey'
          },
          {
            name: 'counter'
            docs: [
              'Number of editions printed, if mint is a Master Edition. (8)'
            ]
            type: 'u32'
          },
          {
            name: 'reserved'
            type: {
              array: ['u8', 128]
            }
          }
        ]
      }
    },
    {
      name: 'craftItemArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'itemsRef'
            type: {
              vec: {
                defined: {
                  name: 'itemRef'
                }
              }
            }
          }
        ]
      }
    },
    {
      name: 'createFungibleBlueprintArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
          {
            name: 'symbol'
            type: 'string'
          },
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'mintAuthority'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'createNonFungibleBlueprintArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'name'
            type: 'string'
          },
          {
            name: 'uri'
            type: 'string'
          },
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'mintAuthority'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'createRecipeArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'ingredients'
            type: {
              vec: {
                defined: {
                  name: 'ingredientDefinition'
                }
              }
            }
          },
          {
            name: 'outputAmount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'ingredient'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'asset'
            docs: ['A blueprint or the mint address of the SPL token. (32)']
            type: 'pubkey'
          },
          {
            name: 'assetType'
            docs: [
              'Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)'
            ]
            type: 'u8'
          },
          {
            name: 'amount'
            docs: ['Amount needed, only applicable to fungible assets. (8)']
            type: 'u64'
          },
          {
            name: 'consumeMethod'
            docs: [
              'What to do with this asset after crafting the recipe. Retain [0], Burn [1], Transfer [2]. (1)'
            ]
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'ingredientDefinition'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            docs: ['Amount needed, only applicable to fungible assets. (8)']
            type: 'u64'
          },
          {
            name: 'consumeMethod'
            docs: [
              'What to do with this asset after crafting the recipe. Retain [0], Burn [1], Transfer [2]. (1)'
            ]
            type: 'u8'
          }
        ]
      }
    },
    {
      name: 'initArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'treasury'
            type: 'pubkey'
          },
          {
            name: 'tokenMint'
            type: 'pubkey'
          },
          {
            name: 'blueprintMintFee'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'itemRef'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'collection'
            type: 'pubkey'
          },
          {
            name: 'item'
            type: 'pubkey'
          }
        ]
      }
    },
    {
      name: 'main'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            docs: ['Bump nonce of the PDA. (1)']
            type: 'u8'
          },
          {
            name: 'authority'
            docs: ['The authority that is permitted to update this state. (32)']
            type: 'pubkey'
          },
          {
            name: 'treasury'
            docs: ['The wallet that stores the collected fees. (32)']
            type: 'pubkey'
          },
          {
            name: 'tokenMint'
            docs: ['Governance token of Itembox. (32)']
            type: 'pubkey'
          },
          {
            name: 'blueprintMintFee'
            docs: [
              'Amount of fee being collected when minting a blueprint. (8)'
            ]
            type: 'u64'
          },
          {
            name: 'reserved'
            docs: [
              'Unused reserved byte space for future additive changes. (128)'
            ]
            type: {
              array: ['u8', 128]
            }
          }
        ]
      }
    },
    {
      name: 'mintItemArgs'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'amount'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'recipe'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bump'
            docs: ['Bump nonce of the PDA. (1)']
            type: 'u8'
          },
          {
            name: 'blueprint'
            docs: [
              'The blueprint to use to produce the item of this recipe. (32)'
            ]
            type: 'pubkey'
          },
          {
            name: 'outputAmount'
            docs: ['The amount of items produced by this recipe. (8)']
            type: 'u64'
          },
          {
            name: 'ingredients'
            docs: ['The list of ingredients for this recipe. (4 + dynamic)']
            type: {
              vec: {
                defined: {
                  name: 'ingredient'
                }
              }
            }
          }
        ]
      }
    }
  ]
}
