import { LCDClient, MnemonicKey, Wallet } from '@terra-money/terra.js';

const LOCALTERRA_MNEMONICS = {
  validator:
    'satisfy adjust timber high purchase tuition stool faith fine install that you unaware feed domain license impose boss human eager hat rent enjoy dawn',
  test1:
    'notice oak worry limit wrap speak medal online prefer cluster roof addict wrist behave treat actual wasp year salad speed social layer crew genius',
};

export class LocalTerra extends LCDClient {
  public wallets: {
    validator: Wallet;
    test1: Wallet;
  };

  constructor() {
    super({
      URL: 'http://localhost:1317',
      chainID: 'localterra',
    });

    this.wallets = {
      validator: this.wallet(
        new MnemonicKey({ mnemonic: LOCALTERRA_MNEMONICS.validator })
      ),
      test1: this.wallet(
        new MnemonicKey({ mnemonic: LOCALTERRA_MNEMONICS.test1 })
      ),
    };
  }
}
