"use strict";
const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
const wasm_data_buffer = fromHexString(wasm_data);
var Module = {
    wasmBinary: wasm_data_buffer
};
