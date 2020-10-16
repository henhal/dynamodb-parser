export function toBinary(buf: Buffer): string {
    return buf.toString('base64');
}

export function fromBinary(s: string): Buffer {
    return Buffer.from(s, 'base64');
}

export function every<T>(condition: (item: T) => boolean): (items: T[]) => boolean {
    return items => Array.isArray(items) && items.every(condition);
}

export function map<T, U>(transform: (item: T) => U): (items: T[]) => U[] {
    return items => items.map(transform);
}

export function type<T>(type: string): (t: T) => boolean {
    return (t: T) => typeof t === type;
}

export const isString = type<string>('string');
export const isBoolean = type<boolean>('boolean');
export const isNumber = type<number>('number');
export const isObject = type<any>('object');