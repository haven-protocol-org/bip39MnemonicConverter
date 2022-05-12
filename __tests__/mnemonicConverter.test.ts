import { convertBip39ToMoneroMnemonic } from "../converter/src/mnemonicConverter"


describe('test converter', () => {


    it("should convert mnemonic", () => {

        const moneroSeed = convertBip39ToMoneroMnemonic("venture expose swim treat swap defense magic toy blast hover neck permit", "")


        expect(moneroSeed).toBe("federal honked haystack vampire thirsty sensible talent rustled bias gearbox rims yeti ingested pamphlet yacht anvil tawny akin chrome fazed balding dove imitate inquest tawny")







    })




} )