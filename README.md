# dynamodb-parser
A parser and encoder for DynamoDB records

This converts to and from the AWS DynamoDB record format:

### Usage:

### Installation
```
const {encodeRecord, parseRecord} = require('dynamodb-parser');
```

#### Encoding a plain JavaScript object into a DynamoDB record:

```
const ddbRecord = encodeRecord({foo: 'FOO', bar: {baz: 42}});

// { foo: { S: 'FOO' }, bar: { M: { baz: { N: '42' } } } }
```

#### Parsing a DynamoDB record into a plain JavaScript object:

```
const obj = parseRecord(ddbRecord);

// { foo: 'FOO', bar: { baz: 42 } }
```