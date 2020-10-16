"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeRecord = exports.encodeAttributeValue = exports.parseRecord = exports.parseAttributeValue = void 0;
var utils_1 = require("./utils");
// Note that the order of 'L', 'NULL' and 'M' is important
var ENCODERS = [
    encoder('S', utils_1.isString, function (s) { return s; }),
    encoder('SS', utils_1.every(utils_1.isString), function (ss) { return ss; }),
    encoder('N', utils_1.isNumber, String),
    encoder('NS', utils_1.every(utils_1.isNumber), utils_1.map(String)),
    encoder('B', Buffer.isBuffer, utils_1.toBinary),
    encoder('BS', utils_1.every(Buffer.isBuffer), utils_1.map(utils_1.toBinary)),
    encoder('BOOL', utils_1.isBoolean, function (b) { return b; }),
    encoder('L', Array.isArray, utils_1.map(encodeAttributeValue)),
    encoder('NULL', function (n) { return n === null; }, function (n) { return true; }),
    encoder('M', utils_1.isObject, encodeRecord)
];
var PARSERS = [
    parser('B', utils_1.fromBinary),
    parser('BS', utils_1.map(utils_1.fromBinary)),
    parser('BOOL', function (b) { return b; }),
    parser('N', Number),
    parser('NS', utils_1.map(Number)),
    parser('S', function (s) { return s; }),
    parser('SS', function (ss) { return ss; }),
    parser('NULL', function (b) { return null; }),
    parser('L', utils_1.map(parseAttributeValue)),
    parser('M', parseRecord)
];
function encoder(type, match, encode) {
    return {
        match: match,
        call: function (v) {
            var _a;
            return (_a = {}, _a[type] = encode(v), _a);
        }
    };
}
function parser(type, parse) {
    return {
        match: function (av) { return !!(av === null || av === void 0 ? void 0 : av[type]); },
        call: function (av) { return parse(av[type]); }
    };
}
function transformValue(transforms, t) {
    for (var _i = 0, transforms_1 = transforms; _i < transforms_1.length; _i++) {
        var _a = transforms_1[_i], match = _a.match, call = _a.call;
        if (match(t)) {
            return call(t);
        }
    }
    return undefined;
}
function transformRecord(transform, record) {
    return Object.assign.apply(Object, __spreadArrays([{}], Object.entries(record)
        .map(function (_a) {
        var _b;
        var k = _a[0], v = _a[1];
        return (_b = {}, _b[k] = transform(v), _b);
    })));
}
function parseAttributeValue(av) {
    return transformValue(PARSERS, av);
}
exports.parseAttributeValue = parseAttributeValue;
function parseRecord(record) {
    return transformRecord(parseAttributeValue, record);
}
exports.parseRecord = parseRecord;
function encodeAttributeValue(v) {
    return transformValue(ENCODERS, v);
}
exports.encodeAttributeValue = encodeAttributeValue;
function encodeRecord(record) {
    return transformRecord(encodeAttributeValue, record);
}
exports.encodeRecord = encodeRecord;
