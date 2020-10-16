export const DDB_RECORD = {
  "str": {
    "S": "STR"
  },
  "arr": {
    "L": [
      {
        "M": {
          "str": {
            "S": "STR1"
          },
          "n": {
            "N": "42"
          }
        }
      },
      {
        "M": {
          "str": {
            "S": "STR2"
          },
          "n": {
            "N": "43"
          }
        }
      }
    ]
  },
  "bool": {
    "BOOL": true
  },
  "nullable": {
    "NULL": true
  },
  "binary": {
    "B": "yv66vg=="
  },
  "missing": undefined
};

export const RECORD = {
  str: 'STR',
  arr: [{str: 'STR1', n: 42}, {str: 'STR2', n: 43}],
  bool: true,
  nullable: null,
  binary: Buffer.from('CAFEBABE', 'hex'),
  missing: undefined
};