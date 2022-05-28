"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secret_spend_key_to_words = exports.pub_keys_to_address = exports.MONERO_STAGENET = exports.MONERO_TESTNET = exports.MONERO_MAINNET = exports.scalarmultKey = exports.sc_add = exports.get_subaddress_secret_key = exports.hash_to_scalar = exports.secret_key_to_public_key = exports.sc_reduce32 = void 0;
const monero_words_english_js_1 = require("./monero-words-english.js");
const monero_js_1 = __importDefault(require("./monero.js"));
const sc_reduce32 = (data) => {
    //const Module = await getMoneroModule();
    var dataLen = data.length * data.BYTES_PER_ELEMENT;
    var dataPtr = monero_js_1.default._malloc(dataLen);
    var dataHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, dataPtr, dataLen);
    dataHeap.set(data);
    monero_js_1.default.ccall('sc_reduce32', null, ['number'], [dataHeap.byteOffset]);
    var res = new Uint8Array(dataHeap);
    monero_js_1.default._free(dataHeap.byteOffset);
    return res;
};
exports.sc_reduce32 = sc_reduce32;
//Module.lib.sc_reduce32 = sc_reduce32;
const secret_key_to_public_key = (data) => {
    //const Module = await getMoneroModule();
    var outLen = data.length * data.BYTES_PER_ELEMENT;
    var outPtr = monero_js_1.default._malloc(outLen);
    var outHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, outPtr, outLen);
    var ok = monero_js_1.default.ccall('secret_key_to_public_key', 'boolean', ['array', 'number'], [data, outHeap.byteOffset]);
    var res = null;
    if (ok)
        res = new Uint8Array(outHeap);
    monero_js_1.default._free(outHeap.byteOffset);
    return res;
};
exports.secret_key_to_public_key = secret_key_to_public_key;
//Module.lib.secret_key_to_public_key = secret_key_to_public_key;
const cn_fast_hash = (data) => {
    //const Module = await getMoneroModule();
    var outLen = 32;
    var outPtr = monero_js_1.default._malloc(outLen);
    var outHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, outPtr, outLen);
    monero_js_1.default.ccall('cn_fast_hash', null, ['array', 'number', 'number'], [data, data.length * data.BYTES_PER_ELEMENT, outHeap.byteOffset]);
    var res = new Uint8Array(outHeap);
    monero_js_1.default._free(outHeap.byteOffset);
    return res;
};
//Module.lib.cn_fast_hash = cn_fast_hash;
const hash_to_scalar = (data) => {
    const hashedData = cn_fast_hash(data);
    const reducedData = (0, exports.sc_reduce32)(hashedData);
    return reducedData;
};
exports.hash_to_scalar = hash_to_scalar;
//Module.lib.hash_to_scalar = hash_to_scalar;
const get_subaddress_secret_key = (data, major, minor) => {
    //const Module = await getMoneroModule();
    var outLen = 32;
    var outPtr = monero_js_1.default._malloc(outLen);
    var outHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, outPtr, outLen);
    monero_js_1.default.ccall('get_subaddress_secret_key', null, ['array', 'number', 'number', 'number'], [data, major, minor, outHeap.byteOffset]);
    var res = new Uint8Array(outHeap);
    monero_js_1.default._free(outHeap.byteOffset);
    return res;
};
exports.get_subaddress_secret_key = get_subaddress_secret_key;
//Module.lib.get_subaddress_secret_key = get_subaddress_secret_key;
const sc_add = (data1, data2) => {
    //const Module = await getMoneroModule();
    var outLen = 32;
    var outPtr = monero_js_1.default._malloc(outLen);
    var outHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, outPtr, outLen);
    monero_js_1.default.ccall('sc_add', null, ['number', 'array', 'array'], [outHeap.byteOffset, data1, data2]);
    var res = new Uint8Array(outHeap);
    monero_js_1.default._free(outHeap.byteOffset);
    return res;
};
exports.sc_add = sc_add;
//Module.lib.sc_add = sc_add;
const scalarmultKey = (P, a) => {
    //const Module = await getMoneroModule();
    var outLen = 32;
    var outPtr = monero_js_1.default._malloc(outLen);
    var outHeap = new Uint8Array(monero_js_1.default.HEAPU8.buffer, outPtr, outLen);
    var ok = monero_js_1.default.ccall('scalarmultKey', 'boolean', ['number', 'array', 'array'], [outHeap.byteOffset, P, a]);
    var res = null;
    if (ok)
        res = new Uint8Array(outHeap);
    monero_js_1.default._free(outHeap.byteOffset);
    return res;
};
exports.scalarmultKey = scalarmultKey;
//Module.lib.scalarmultKey = scalarmultKey;
function base58_encode(data) {
    var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    var ALPHABET_MAP = {};
    var BYTES_TO_LENGTHS = [0, 2, 3, 5, 6, 7, 9, 10, 11];
    var BASE = ALPHABET.length;
    // pre-compute lookup table
    for (var z = 0; z < ALPHABET.length; z++) {
        var x = ALPHABET.charAt(z);
        if (ALPHABET_MAP[x] !== undefined)
            throw new TypeError(x + ' is ambiguous');
        ALPHABET_MAP[x] = z;
    }
    function encode_partial(data, pos) {
        var len = 8;
        if (pos + len > data.length)
            len = data.length - pos;
        var digits = [0];
        for (var i = 0; i < len; ++i) {
            for (var j = 0, carry = data[pos + i]; j < digits.length; ++j) {
                carry += digits[j] << 8;
                digits[j] = carry % BASE;
                carry = (carry / BASE) | 0;
            }
            while (carry > 0) {
                digits.push(carry % BASE);
                carry = (carry / BASE) | 0;
            }
        }
        var res = '';
        // deal with leading zeros
        for (var k = digits.length; k < BYTES_TO_LENGTHS[len]; ++k)
            res += ALPHABET[0];
        // convert digits to a string
        for (var q = digits.length - 1; q >= 0; --q)
            res += ALPHABET[digits[q]];
        return res;
    }
    var res = '';
    for (var i = 0; i < data.length; i += 8) {
        res += encode_partial(data, i);
    }
    return res;
}
//Module.lib.base58_encode = base58_encode;
exports.MONERO_MAINNET = 0;
exports.MONERO_TESTNET = 1;
exports.MONERO_STAGENET = 2;
//Module.lib.MONERO_MAINNET = MONERO_MAINNET;
//Module.lib.MONERO_TESTNET = MONERO_TESTNET;
//Module.lib.MONERO_STAGENET = MONERO_STAGENET;
const pub_keys_to_address = function (net, is_subaddress, public_spend_key, public_view_key) {
    var prefix;
    if (net == exports.MONERO_MAINNET) {
        prefix = '12';
        if (is_subaddress)
            prefix = '2A';
    }
    else if (net == exports.MONERO_TESTNET) {
        prefix = '35';
        if (is_subaddress)
            prefix = '3F';
    }
    else if (net == exports.MONERO_STAGENET) {
        prefix = '18';
        if (is_subaddress)
            prefix = '24';
    }
    else {
        throw "Invalid net: " + net;
    }
    res_hex = prefix + toHexString(public_spend_key) + toHexString(public_view_key);
    checksum = cn_fast_hash(fromHexString(res_hex));
    res_hex += toHexString(checksum).substring(0, 8);
    return base58_encode(fromHexString(res_hex));
};
exports.pub_keys_to_address = pub_keys_to_address;
//Module.lib.pub_keys_to_address = pub_keys_to_address;
var makeCRCTable = function () {
    var c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
        c = n;
        for (var k = 0; k < 8; k++) {
            c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
        }
        crcTable[n] = c;
    }
    return crcTable;
};
var crcTable;
var crc32 = function (str) {
    crcTable = crcTable || makeCRCTable();
    var crc = 0 ^ (-1);
    for (var i = 0; i < str.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
};
const secret_spend_key_to_words = function (secret_spend_key) {
    var seed = [];
    var for_checksum = '';
    for (var i = 0; i < 32; i += 4) {
        var w0 = 0;
        for (var j = 3; j >= 0; j--)
            w0 = w0 * 256 + secret_spend_key[i + j];
        var w1 = w0 % monero_words_english_js_1.monero_words_english.length;
        var w2 = ((w0 / monero_words_english_js_1.monero_words_english.length | 0) + w1) % monero_words_english_js_1.monero_words_english.length;
        var w3 = (((w0 / monero_words_english_js_1.monero_words_english.length | 0) / monero_words_english_js_1.monero_words_english.length | 0) + w2) % monero_words_english_js_1.monero_words_english.length;
        seed.push(monero_words_english_js_1.monero_words_english[w1]);
        seed.push(monero_words_english_js_1.monero_words_english[w2]);
        seed.push(monero_words_english_js_1.monero_words_english[w3]);
        for_checksum += monero_words_english_js_1.monero_words_english[w1].substring(0, monero_words_english_js_1.monero_words_english_prefix_len);
        for_checksum += monero_words_english_js_1.monero_words_english[w2].substring(0, monero_words_english_js_1.monero_words_english_prefix_len);
        for_checksum += monero_words_english_js_1.monero_words_english[w3].substring(0, monero_words_english_js_1.monero_words_english_prefix_len);
    }
    seed.push(seed[crc32(for_checksum) % 24]);
    return seed.join(' ');
};
exports.secret_spend_key_to_words = secret_spend_key_to_words;
//Module.lib.secret_spend_key_to_words = secret_spend_key_to_words;
