import { Wallet, MsgExecuteContract, BlockTxBroadcastResult, Event } from "@terra-money/terra.js";
import { LocalTerra } from '../client/terra'

export class Oracle {
  constructor(private readonly terraClient: LocalTerra, private readonly wallet: Wallet, private readonly contractAddress: string) {}

  public async getCurrentPrice(symbol: string): Promise<number> {
    const result: any = await this.terraClient.wasm.contractQuery(this.contractAddress, { get_price: { symbol } })
    console.log(result)
    const priceStr = result.price
    if (priceStr == "") return -1.0;
    return parseFloat(priceStr) / 1e6
  }

  public async updatePrice(symbol: string, price: string): Promise<void> {
    let roundedPrice: string = Math.floor(parseFloat(price) * 1e6).toString()
    const execute = new MsgExecuteContract(
      this.wallet.key.accAddress, // sender
      this.contractAddress, // contract address
      { set_price: { symbol, price: roundedPrice } }, // handle msg
      { uluna: 100000 } // coins
    );
    const executeTx = await this.wallet.createAndSignTx({
      msgs: [execute],
    });
    await this.terraClient.tx.broadcast(executeTx);
  }
}
