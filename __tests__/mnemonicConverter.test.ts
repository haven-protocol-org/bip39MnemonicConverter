import { convertBip39ToMoneroMnemonic } from "../converter/src/mnemonicConverter"
import { convertBip39ToHavenMnemonic } from "../converter/src/mnemonicConverter"


describe('test converter', () => {


    it("should convert to monero mnemonic", () => {

        const moneroSeed = convertBip39ToMoneroMnemonic("venture expose swim treat swap defense magic toy blast hover neck permit", "")
        expect(moneroSeed).toBe("federal honked haystack vampire thirsty sensible talent rustled bias gearbox rims yeti ingested pamphlet yacht anvil tawny akin chrome fazed balding dove imitate inquest tawny")

    })


    it("should convert to haven mnemonic", () => {

        const havenSeed = convertBip39ToHavenMnemonic("venture expose swim treat swap defense magic toy blast hover neck permit", "")
        expect(havenSeed).toBe("juvenile kickoff king glass scoop lair iris token truth puzzled amaze corrode justice autumn pimple turnip cafe oyster hover baffles giddy farming vector western pimple")
        console.log(havenSeed)
    })




} )