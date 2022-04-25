import { useState } from "react";
import { ethers } from "ethers";
import abi from "@utils/WavePortal.json";

const useFunctions = () => {
  const contractAddress = "0xfbbdC22f9f513D4920c757b5fAcC026217155D44";
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [inputValue, setInputValue] = useState("");

  //get all wave function
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
         * We only need address, timestamp, and message in our UI so let's
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

  /**
   * Implement your wave method here
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

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTransaction = await wavePortalContract.wave(inputValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", waveTransaction.hash);

        await waveTransaction.wait();
        console.log("Mined -- ", waveTransaction.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return {
    getAllWaves,
    allWaves,
    wave,
    setAllWaves,
    contractABI,
    contractAddress,
    inputValue,
    setInputValue,
  };
};

export default useFunctions;
