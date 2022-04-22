import { mnemonicToSeed } from "bip39";
import { keccak256 } from "ethereumjs-util";
import {BIP32Factory, BIP32Interface} from 'bip32';
import {sc_reduce32} from "../monero/libmonero.js";


let network;
let derivationPath;

const moneroDerivationPath = (): string => {

    const purpose =  44;
    const coin = 128;
    const account = 0;
    const change = 0;
    let path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;

}

const havenDerivationPath = (): string => {

    const purpose =  44;
    const coin = 535; 
    const account = 0;
    const change = 0;
    let path = "m/";
    path += purpose + "'/";
    path += coin + "'/";
    path += account + "'/";
    path += change;
    return path;

}

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
    messagePrefix: 'x18XMR Signed Message:\n',
    bip32: {
      public: 0x0488B21E,
      private: 0x0488ADE4,
    },
    pubKeyHash: 0x7F,
    scriptHash: 0xC4,
    wif: 0x3F,


}

const calcBip32ExtendedKey = (bip32RootKey: BIP32Interface, path: string): BIP32Interface => {

    let extendedKey: BIP32Interface | null = bip32RootKey;
    // Derive the key from the path
    const pathBits = path.split("/");
    for (let i=0; i<pathBits.length; i++) {
        const bit = pathBits[i];
        const index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        const hardened = bit[bit.length-1] == "'";
        const isPriv = !(extendedKey!.isNeutered());
        const invalidDerivationPath = hardened && !isPriv;
        if (invalidDerivationPath) {
            extendedKey = null;
        }
        else if (hardened) {
            extendedKey = extendedKey!.deriveHardened(index);
        }
        else {
            extendedKey = extendedKey!.derive(index);
        }
    }
    return extendedKey!
}

const convertBip39Mnemonic = async (phrase: string, passPhrase: string) => {

    const ecc = await import('tiny-secp256k1');

    const bip32 = BIP32Factory(ecc);

    const seed: Buffer = await mnemonicToSeed(phrase, passPhrase);
    const bip32RootKey: BIP32Interface = bip32.fromSeed(seed, moneroNetwork);
    const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, moneroDerivationPath());

    //TODO use hardened addresses? https://wiki.trezor.io/Hardened_and_non-hardened_derivation
    const useHardenedAddresses = false;

    let key: BIP32Interface;
    if (useHardenedAddresses) {
            key = bip32ExtendedKey.deriveHardened(0);
    }
    else {
            key = bip32ExtendedKey.derive(0);
    }

    const rawPrivateKey: Buffer = key.privateKey!;
    const rawSecretSpendKey: Buffer = keccak256(rawPrivateKey);
    const secretSpendKey = await sc_reduce32(rawSecretSpendKey);
    const mnemonic = await secret_spend_key_to_words(secretSpendKey)
    return mnemonic;

}

export const convertBip39ToMoneroMnemonic = async (phrase: string, passPhrase: string): string {

    network = moneroNetwork;
    derivationPath = moneroDerivationPath;
    const mnemonic = await convertBip39Mnemonic(phrase, passPhrase);
    return mnemonic;
}

export const convertBip39ToHavenMnemonic = async (phrase: string, passPhrase: string): string {

    network = havenNetwork;
    derivationPath = havenDerivationPath;
    const mnemonic = await convertBip39Mnemonic(phrase, passPhrase);
    return mnemonic;
}


