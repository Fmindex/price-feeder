import { Price } from './client/price'
import { LocalTerra } from './client/terra'
import { Oracle } from './service/oracle'
import { executeFeeder } from './feeder'

// IMPROVEMENT: add this to config
// configs
// dev
const chainUrl = 'https://bombay-lcd.terra.dev'
const chainID = 'bombay-12' 
const oracleContractAddress = 'terra123uvpej0dthgyvn2vg6hjgfwkhg69uazp7ksqe'
// local
// const chainUrl = 'http://localhost:1317'
// const chainID = 'localterra' 
// const oracleContractAddress = 'terra174kgn5rtw4kf6f938wm7kwh70h2v4vcfd26jlc'

async function main(): Promise<void> {
  // init
  const priceClient = new Price()
  const terra = new LocalTerra(chainUrl, chainID)
  const oracleClient = new Oracle(terra, terra.wallets.bombay, oracleContractAddress)

  console.log("price feeder is running...")
  
  // define const
  const minutes = 1 / 4
  const interval = minutes * 60 * 1000
  setInterval(async () => {
    executeFeeder(priceClient, oracleClient)
  }, interval);
}


main()
