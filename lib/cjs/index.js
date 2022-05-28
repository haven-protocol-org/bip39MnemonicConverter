"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBip39ToHavenMnemonic = exports.convertBip39ToMoneroMnemonic = void 0;
const bip39_1 = require("bip39");
const ethereumjs_util_1 = require("ethereumjs-util");
const bip32_1 = require("bip32");
const libmonero_js_1 = require("./libmonero.js");
const ecc = __importStar(require("tiny-secp256k1"));
let network;
let derivationPath;
const moneroDerivationPath = () => {
    const purpose = 44;
    const coin = 128;
    const account = 0;
    const change = 0;
    let path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
};
const havenDerivationPath = () => {
    const purpose = 44;
    const coin = 535;
    const account = 0;
    const change = 0;
    let path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;
};
const moneroNetwork = {
    messagePrefix: 'x18XMR Signed Message:\n',
    bip32: {
        public: 0x0488B21E,
        private: 0x0488ADE4,
    },
    pubKeyHash: 0x7F,
    scriptHash: 0xC4,
    wif: 0x3F,
};
const havenNetwork = {
    //TODO need to be adjusted to haven values?
    messagePrefix: 'x18XHV Signed Message:\n',
    bip32: {
        public: 0x0488B21E,
        private: 0x0488ADE4,
    },
    pubKeyHash: 0x7F,
    scriptHash: 0xC4,
    wif: 0x3F,
};
const calcBip32ExtendedKey = (bip32RootKey, path) => {
    let extendedKey = bip32RootKey;
    // Derive the key from the path
    const pathBits = path.split("/");
    for (let i = 0; i < pathBits.length; i++) {
        const bit = pathBits[i];
        const index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        const hardened = bit[bit.length - 1] == "'";
        const isPriv = !(extendedKey.isNeutered());
        const invalidDerivationPath = hardened && !isPriv;
        if (invalidDerivationPath) {
            extendedKey = null;
        }
        else if (hardened) {
            extendedKey = extendedKey.deriveHardened(index);
        }
        else {
            extendedKey = extendedKey.derive(index);
        }
    }
    return extendedKey;
};
const convertBip39Mnemonic = (phrase, passPhrase) => {
    const bip32 = (0, bip32_1.BIP32Factory)(ecc);
    const seed = (0, bip39_1.mnemonicToSeedSync)(phrase, passPhrase);
    const bip32RootKey = bip32.fromSeed(seed, moneroNetwork);
    const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, derivationPath);
    //TODO use hardened addresses? https://wiki.trezor.io/Hardened_and_non-hardened_derivation
    const useHardenedAddresses = false;
    let key;
    if (useHardenedAddresses) {
        key = bip32ExtendedKey.deriveHardened(0);
    }
    else {
        key = bip32ExtendedKey.derive(0);
    }
    const rawPrivateKey = key.privateKey;
    const rawSecretSpendKey = (0, ethereumjs_util_1.keccak256)(rawPrivateKey);
    const secretSpendKey = (0, libmonero_js_1.sc_reduce32)(rawSecretSpendKey);
    const mnemonic = (0, libmonero_js_1.secret_spend_key_to_words)(secretSpendKey);
    return mnemonic;
};
const convertBip39ToMoneroMnemonic = (phrase, passPhrase) => {
    network = moneroNetwork;
    derivationPath = moneroDerivationPath();
    const mnemonic = convertBip39Mnemonic(phrase, passPhrase);
    return mnemonic;
};
exports.convertBip39ToMoneroMnemonic = convertBip39ToMoneroMnemonic;
const convertBip39ToHavenMnemonic = (phrase, passPhrase) => {
    network = havenNetwork;
    derivationPath = havenDerivationPath();
    const mnemonic = convertBip39Mnemonic(phrase, passPhrase);
    return mnemonic;
};
exports.convertBip39ToHavenMnemonic = convertBip39ToHavenMnemonic;
