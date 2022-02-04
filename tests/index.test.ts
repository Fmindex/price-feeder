import { Oracle } from "../src/service/oracle"
import { Price } from "../src/client/price"
import { LocalTerra } from "../src/client/terra"
import { executeFeeder } from "../src/feeder"
import { mocked } from 'jest-mock'

jest.mock('../src/service/oracle', () => {
    return {
      Oracle: jest.fn().mockImplementation(() => {
        return {
            getCurrentPrice: async() => {},
            updatePrice: jest.fn()
        };
      })
    };
  });

  jest.mock('../src/client/terra', () => {
    return {
        LocalTerra: jest.fn().mockImplementation(() => {
        return {
            wallets: {
                bombay: {}
            }
        };
      })
    };
  });

  jest.mock('../src/client/price', () => {
    return {
        Price: jest.fn().mockImplementation(() => {
        return {
            getPrice: async() => {}
        };
      })
    };
  });

describe('executeFeeder', () => {
    const MockedOracle = mocked(Oracle, true)
    const MockedLocalTerra = mocked(LocalTerra, true)
    const terra = new LocalTerra("", "")

    beforeEach(() => {
        // Clears the record of calls to the mock constructor function and its methods
        MockedOracle.mockClear()
        MockedLocalTerra.mockClear()
    });

    it("should update if diff > 0.1", async () => {
        const oracle = new Oracle(terra, terra.wallets.bombay, "")
        const price = new Price()
        price.getPrice = async() => {
            return { "LUNA": "100" }
        }
        oracle.getCurrentPrice = async() => {
            return 1.0
        }
        await executeFeeder(price, oracle)
        expect(oracle.updatePrice).toHaveBeenCalledTimes(1)
    });

    it("should not update if diff <= 0.1", async () => {
        const oracle = new Oracle(terra, terra.wallets.bombay, "")
        const price = new Price()
        price.getPrice = async() => {
            return { "LUNA": "10000" }
        }
        oracle.getCurrentPrice = async() => {
            return 9999
        }
        await executeFeeder(price, oracle)
        expect(oracle.updatePrice).toHaveBeenCalledTimes(0)
    });
})