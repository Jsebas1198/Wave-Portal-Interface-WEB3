import { useState } from "react";
import { ethers } from "ethers";
import abi from "@utils/WavePortal.json";

const useFunctions = () => {
  const contractAddress = "0x10b11fbB179EA403d4ABd923eA0e03a086BA2F01";
  const contractABI = abi.abi;
  const [allWaves, setAllWaves] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [totalWaves, setTotalWaves] = useState(0);
  const [addressWaves, setAddressWaves] = useState(0);

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

        // let count = await wavePortalContract.getTotalWaves();
        // console.log("Retrieved total wave count...", count.toNumber());

        /*
         * Execute the actual wave from your smart contract
         */
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

  const handleChange = (e) => {
    setInputValue(e.target.value);
    console.log(e.target.value);
  };

  //Functions from index
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

  return {
    allWaves,
    wave,
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
  };
};

export default useFunctions;
