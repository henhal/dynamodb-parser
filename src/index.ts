import * as Lambda from "aws-lambda";
import {every, fromBinary, isBoolean, isNumber, isObject, isString, map, toBinary} from "./utils";

type Transform<T, U> = {
    match: (t: T) => boolean;
    call: (t: T) => U;
}

export type DataType =
    string
    | string[]
    | number
    | number[]
    | Buffer
    | Buffer[]
    | boolean
    | null
    | Array<DataType>
    | {[key: string]: DataType};

// Note that the order of 'L', 'NULL' and 'M' is important
const ENCODERS: ReadonlyArray<Transform<any, Lambda.AttributeValue>> = [
    encoder('S', isString, s => s),
    encoder('SS', every(isString), ss => ss),
    encoder('N', isNumber, String),
    encoder('NS', every(isNumber), map(String)),
    encoder('B', Buffer.isBuffer, toBinary),
    encoder('BS', every(Buffer.isBuffer), map(toBinary)),
    encoder('BOOL', isBoolean, b => b),
    encoder('L', Array.isArray, map(encodeAttributeValue)),
    encoder('NULL', n => n === null, n => true),
    encoder('M', isObject, encodeRecord)
];

const PARSERS: ReadonlyArray<Transform<Lambda.AttributeValue, DataType>> = [
    parser('B', fromBinary),
    parser('BS', map(fromBinary)),
    parser('BOOL', b => b),
    parser('N', Number),
    parser('NS', map(Number)),
    parser('S', s => s),
    parser('SS', ss => ss),
    parser('NULL', b => null),
    parser('L', map(parseAttributeValue)),
    parser('M', parseRecord)
];

function encoder<K extends keyof Lambda.AttributeValue, V extends DataType>(
    type: K,
    match: (v: V) => boolean,
    encode: (v: V) => NonNullable<Lambda.AttributeValue[K]>
): Transform<V, Lambda.AttributeValue> {
    return {
        match,
        call: v => ({[type]: encode(v!)})
    };
}

function parser<K extends keyof Lambda.AttributeValue, V>(
    type: K,
    parse: (av: NonNullable<Lambda.AttributeValue[K]>) => V
): Transform<Lambda.AttributeValue, V> {
    return {
        match: av => !!av?.[type],
        call: av => parse(av[type]!)
    };
}

function transformValue<T, U>(transforms: ReadonlyArray<Transform<T, U>>, t: T): U {
    for (const {match, call} of transforms) {
        if (match(t)) {
            return call(t);
        }
    }

    return undefined as any as U;
}

function transformRecord<T, U>(transform: (t: T) => U, record: {[key: string]: T}): Record<string, U> {
    return Object.assign({}, ...Object.entries(record)
        .map(([k, v]) => ({[k]: transform(v)})));
}

export function parseAttributeValue(av: Lambda.AttributeValue): DataType {
    return transformValue(PARSERS, av);
}

export function parseRecord(record: Record<string, Lambda.AttributeValue>): Record<string, DataType> {
    return transformRecord(parseAttributeValue, record);
}

export function encodeAttributeValue(v: DataType): Lambda.AttributeValue {
    return transformValue(ENCODERS, v);
}

export function encodeRecord(record: {[key: string]: DataType}): Record<string, Lambda.AttributeValue> {
    return transformRecord(encodeAttributeValue, record);
}




