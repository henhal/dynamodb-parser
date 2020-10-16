"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.isNumber = exports.isBoolean = exports.isString = exports.type = exports.map = exports.every = exports.fromBinary = exports.toBinary = void 0;
function toBinary(buf) {
    return buf.toString('base64');
}
exports.toBinary = toBinary;
function fromBinary(s) {
    return Buffer.from(s, 'base64');
}
exports.fromBinary = fromBinary;
function every(condition) {
    return function (items) { return Array.isArray(items) && items.every(condition); };
}
exports.every = every;
function map(transform) {
    return function (items) { return items.map(transform); };
}
exports.map = map;
function type(type) {
    return function (t) { return typeof t === type; };
}
exports.type = type;
exports.isString = type('string');
exports.isBoolean = type('boolean');
exports.isNumber = type('number');
exports.isObject = type('object');
