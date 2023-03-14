import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCelo } from "@celo/react-celo";
import Image from "next/image";
import { useEffect, useState, useContext, useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { shortenAddress } from "@/utils/shortenAddress";
import AddComputerModal from "./AddComputerModal";
import { MarketplaceContext } from "@/context/marketplaceContext";
import { Summary } from "@/typings";
import { StableToken } from "@celo/contractkit/lib/celo-tokens";
import { StableTokenWrapper } from "@celo/contractkit/lib/wrappers/StableTokenWrapper";
import Web3 from "web3";

export default function Header() {

  

  const defaultSummary: Summary = {
    name: "",
    address: "",
    celo: new BigNumber(0),
    balances: [],
  };

  const [summary, setSummary] = useState<Summary>(defaultSummary);
  
  let [componentInitialized, setComponentInitialized] = useState(false);
  let { initialised, address, connect, disconnect, kit } = useCelo();



  async function getBalances(
    stableTokens: {
      symbol: StableToken;
      contract: StableTokenWrapper | null;
    }[],
    address: string
  ) {
    return Promise.all(
      stableTokens.map(async (stable) => {
        let value, error;
        if (stable.contract) {
          value = await stable.contract.balanceOf(address);
        } else {
          error = "not deployed in network";
        }
        return {
          symbol: stable.symbol,
          value: value,
          error: error,
        };
      })
    );
  }

  const fetchSummary = useCallback(async () => {
    if (!address) {
      setSummary(defaultSummary);
      return;
    }

    const [accounts, goldToken, stableTokens] = await Promise.all([
      kit.contracts.getAccounts(),
      kit.contracts.getGoldToken(),
      Promise.all(
        Object.values(StableToken).map(async (stable) => {
          let contract;
          try {
            contract = await kit.contracts.getStableToken(stable);
          } catch (e) {
            contract = null;
            console.error(e);
          }
          return {
            symbol: stable,
            contract: contract,
          };
        })
      ),
    ]);

    const [accountSummary, celo, balances] = await Promise.all([
      accounts.getAccountSummary(address).catch((e) => {
        console.error(e);
        return defaultSummary;
      }),
      goldToken.balanceOf(address),
      getBalances(stableTokens, address),
    ]);

    setSummary({
      ...accountSummary,
      celo,
      balances,
    });
  }, []);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (initialised) {
      setComponentInitialized(true);
      
    }
  }, [initialised]);

  return (
    <Disclosure as="nav" className="">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto lg:block"
                    src="/logo.svg"
                    width="24"
                    height="24"
                    alt="Celo Logo"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a
                    href="#"
                    className="inline-flex items-center border-b-2 border-black px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Home
                  </a>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 hidden sm:flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {componentInitialized && address ? (
                  <div className="flex gap-4 items-center">
                    <AddComputerModal />
                    <p className=" text-white inline-flex content-center place-items-center rounded-full py-2 px-5 text-md font-medium bg-gray-500/30">
                      CELO BAL: {Web3.utils.fromWei(summary.celo.toFixed())}
                    </p>

                    <button
                      type="button"
                      className="inline-flex content-center place-items-center rounded-full border-[#250438]  bg-[#250438] py-2 px-5 text-md font-medium text-snow hover:bg-[#8e24cc] "
                      onClick={disconnect}
                    >
                      {shortenAddress(address)}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="inline-flex content-center place-items-center rounded-full border border-[#250438] bg-[#250438] py-2 px-5 text-md font-medium text-snow hover:bg-[#8e24cc]"
                    onClick={() =>
                      connect().catch((e) => console.log((e as Error).message))
                    }
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="flex sm:hidden">
            <div className="space-y-1 pt-2 pb-4">
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-black"
              >
                Home
              </Disclosure.Button>
              {/* Add here your custom menu elements */}
              <div className=" ">
                {componentInitialized && address ? (
                  <div className="flex flex-col items-start space-y-4 ml-4">
                    <AddComputerModal />
                    <p className=" text-white inline-flex content-center place-items-center rounded-full py-2 px-5 text-md font-medium bg-gray-500/30">
                      CELO BAL: {Web3.utils.fromWei(summary.celo.toFixed())}
                    </p>
                    <button
                      type="button"
                      className="inline-flex content-center place-items-center rounded-full border-[#250438]  bg-[#250438] py-2 px-5 text-md font-medium text-snow hover:bg-[#8e24cc]"
                      onClick={disconnect}
                    >
                      {shortenAddress(address)}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="inline-flex content-center place-items-center rounded-full border border-[#250438] bg-[#250438] py-2 px-5 text-md font-medium text-snow hover:bg-[#8e24cc]"
                    onClick={() =>
                      connect().catch((e) => console.log((e as Error).message))
                    }
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
