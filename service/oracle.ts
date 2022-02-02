import { Wallet, MsgExecuteContract, BlockTxBroadcastResult, Event } from "@terra-money/terra.js";
import { LocalTerra } from '../client/terra'

export class Oracle {
  constructor(private readonly terraClient: LocalTerra, private readonly wallet: Wallet, private readonly contractAddress: string) {}

  public async getCurrentPrice(symbol: string): Promise<number> {
    const execute = new MsgExecuteContract(
      this.wallet.key.accAddress, // sender
      this.contractAddress, // contract address
      { get_price: { symbol } }, // handle msg
      { uluna: 100000 } // coins
    );
    const executeTx = await this.wallet.createAndSignTx({
      msgs: [execute],
    });
    const executeTxResult = await this.terraClient.tx.broadcast(executeTx);
    const priceStr = this.extractPrice(executeTxResult)
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

  private extractPrice(result: BlockTxBroadcastResult): string {
    const events: Event[] = result.logs[0].events
    let price: string = ""
    for (const event of events) {
      const attributes = event.attributes
      for (const attribute of attributes) {
        if (attribute.key == "price") {
          price = attribute.value
          break
        }
      }
    }
    return price
  }
}
