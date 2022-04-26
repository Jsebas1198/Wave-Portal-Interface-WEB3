import { useFunctions } from "./useFunctions";
const useConnectWallet = () => {
  const { setCurrentAccount } = useFunctions();
  /**
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    connectWallet,
  };
};

export default useConnectWallet;
