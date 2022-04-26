import { useState, useContext, createContext } from "react";
import { ethers } from "ethers";
import abi from "@utils/WavePortal.json";

//Create and exports the context
const functionsContext = createContext();

export function ProviderFunction({ children }) {
  const functions = useProvidedFunctions();
  return (
    <functionsContext.Provider value={functions}>
      {children}
    </functionsContext.Provider>
  );
}

export const useFunctions = () => {
  return useContext(functionsContext);
};

//functions that are used in the ProviderFunction
const useProvidedFunctions = () => {
  /*
   * variables that are used in the ProviderFunction
   */

  const contractAddress = "0x10b11fbB179EA403d4ABd923eA0e03a086BA2F01";
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [totalWaves, setTotalWaves] = useState(0);
  const [addressWaves, setAddressWaves] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * Check if the wallet is connected
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Handle the change of the input value that will be send by wave fuction
   */

  const handleChange = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  /*
   * Implement the wave method here
   */

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        //Execute the actual wave from your smart contract

        const waveTransaction = await wavePortalContract.wave(inputValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTransaction.hash);

        await waveTransaction.wait();
        console.log("Mined -- ", waveTransaction.hash);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Method from the smart contract that returns the total number of waves
   */
  const waveNumber = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        let totalNumberOfWaves = count.toNumber();
        setTotalWaves(totalNumberOfWaves);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  /*
   * Method from the smart contract that returns the total number of waves of the current address
   */
  const waveAdressNumber = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let address = await wavePortalContract.getAdressWaves(currentAccount);
        setAddressWaves(address.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  /*
   * Method from the smart contract that returns the struct of the waves that were made
   */
  const getAllWaves = async () => {
    const { ethereum } = window;
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();

        /*
         * We only need address, timestamp,message and chekc if is a winner in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach((wave) => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
            Winner: wave.isWinner,
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    wave,
    allWaves,
    setAllWaves,
    contractABI,
    contractAddress,
    handleChange,
    inputValue,
    addressWaves,
    setAddressWaves,
    totalWaves,
    setTotalWaves,
    waveNumber,
    currentAccount,
    checkIfWalletIsConnected,
    waveAdressNumber,
    getAllWaves,
  };
};
