let accounts, balance, result;
const handleChangeAccount = (account) => {
  accounts = account;
};

const installMetamask = () => {
  console.log("INstall metamask");
};

export const checkMetamask = function () {
  try {
    if (window.ethereum !== "undefined") {
      this.ethereum.on("accountsChanged", handleChangeAccount);
    }
  } catch (err) {
    installMetamask();
  }
};

export const connectWallet = async (e) => {
  console.log("Connect to wallet");
  try {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  } catch (err) {
    console.log(err);
  }
  console.log(accounts);
  return accounts;
};

export const checkBalance = async () => {
  try {
    balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    });
  } catch (err) {
    console.log(err);
  }
  // console.log(balance);
  console.log(parseFloat(balance / Math.pow(10, 18)));
  return parseFloat(balance / Math.pow(10, 18));
};

export const sendTransaction = async () => {
  try {
    result = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: accounts[0],
          to: "0x6bcd113877767D9d553eD3105560fF8f87d64E5d",
          gas: Number(21000).toString(16),
          gasPrice: Number(2500000).toString(16),
          value: Number(100000000000000).toString(16),
          // data: "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675",
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
  console.log(result);
  return result;
};

export default () => {
  connectWallet().then((account) => {
    checkBalance().then((balance) => {
      sendTransaction().then(res => {
        return res;
      });
    });
  });
};
