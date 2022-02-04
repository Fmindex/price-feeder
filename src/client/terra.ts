import { LCDClient, MnemonicKey, Wallet } from "@terra-money/terra.js";

// IMPROVEMENT: add this wallet key to config
const LOCALTERRA_MNEMONICS = {
  validator:
    "satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn",
  test1:
    "notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius",
  bombay:
    "tent stay parade argue wave enlist hungry bubble tower melt local mom blind canoe above strong report sausage lunch column local spread galaxy cousin",
};

export class LocalTerra extends LCDClient {
  public wallets: {
    validator: Wallet;
    test1: Wallet;
    bombay: Wallet;
  };

  constructor(URL: string, chainID: string) {
    super({ URL, chainID });

    this.wallets = {
      validator: this.wallet(
        new MnemonicKey({ mnemonic: LOCALTERRA_MNEMONICS.validator })
      ),
      test1: this.wallet(
        new MnemonicKey({ mnemonic: LOCALTERRA_MNEMONICS.test1 })
      ),
      bombay: this.wallet(
        new MnemonicKey({ mnemonic: LOCALTERRA_MNEMONICS.bombay })
      ),
    };
  }
}
