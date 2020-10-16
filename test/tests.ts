import {describe} from 'mocha';
import {expect} from 'chai';

import {encodeRecord, parseRecord} from "../src";

import {RECORD, DDB_RECORD} from './data';

describe('Parser tests', () => {
    it('Should parse a DynamoDB record', () => {
        expect(parseRecord(DDB_RECORD as any)).to.eql(RECORD);
    });
});
describe('Encoder tests', () => {
    it('Should encode an object into a DynamoDB record', () => {
        expect(encodeRecord(RECORD as any)).to.eql(DDB_RECORD);
    });
});