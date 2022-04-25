import React, { useEffect } from "react";
import styles from "@styles/Home.module.css";
import useConnectWallet from "@hooks/useConnectWallet.js";
import useFunctions from "@hooks/useFunctions";
import { ethers } from "ethers";
const App = () => {
  const { connectWallet, currentAccount, setCurrentAccount } =
    useConnectWallet();
  const {
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
  } = useFunctions();

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
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
    checkIfWalletIsConnected();
    getAllWaves();
    waveNumber();
    waveAdressNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    waveAdressNumber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  /**
   * Listen in for emitter events
   */
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message, isWinner) => {
      setAllWaves((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          Winner: isWinner,
        },
      ]);
    };

    const onNewTotalWaves = (totalWaves) => {
      console.log("NewTotalWaves", totalWaves);
      setTotalWaves(totalWaves++);
    };
    const onNewAddresWaves = (addressWaves) => {
      console.log("NewAddresWaves", addressWaves);
      setAddressWaves(addressWaves++);
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      wavePortalContract.on("NewWave", onNewWave);
      wavePortalContract.on("NewTotalWaves", onNewTotalWaves);
      wavePortalContract.on("NewAddressWave", onNewAddresWaves);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
        wavePortalContract.off("NewTotalWaves", onNewTotalWaves);
        wavePortalContract.off("NewAddressWave", onNewAddresWaves);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.dataContainer}>
        <div className={styles.header}>👋 Hey there!</div>

        <div className={styles.bio}>
          <p>
            I am Juan Fernandez and I know about blockchain technology!! Connect
            your Ethereum wallet and start waving!
          </p>
        </div>
        <input
          className={styles.inputWave}
          type="text"
          placeholder="Send a wave"
          value={inputValue}
          onChange={(e) => handleChange(e)}
        />

        <button className={styles.waveButton} onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className={styles.waveButton} onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <p>
          <span className={styles.spanAddress}>Address: </span>
          {currentAccount}
          <span className={styles.spanAddress}> Addres waves: </span>
          {addressWaves}
        </p>
        <p>
          <span className={styles.spanAddress}> Total Waves: </span>
          {totalWaves}
        </p>

        {allWaves.map((wave, index) => {
          return (
            <div
              key={index}
              style={{
                backgroundColor: "OldLace",
                marginTop: "16px",
                padding: "8px",
              }}
            >
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
              <div>
                {wave.Winner == 0
                  ? "Better luck next time"
                  : "You win 0.0001 eth, CONGRATS!!"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
