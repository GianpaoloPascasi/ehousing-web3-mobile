import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import Web3Auth, { ChainNamespace, WEB3AUTH_NETWORK } from "@web3auth/react-native-sdk";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

export const redirectUrl =
//@ts-ignore
  Constants.appOwnership == AppOwnership.Expo || Constants.appOwnership == AppOwnership.Guest
    ? Linking.createURL("web3auth", {})
    : Linking.createURL("web3auth", { scheme: "housingweb3app" });

    
// IMP START - SDK Initialization
const chainConfig = {
  chainNamespace: ChainNamespace.EIP155,
  chainId: '0xaa36a7',
  rpcTarget: 'https://1rpc.io/sepolia',
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: 'Ethereum Sepolia Testnet',
  blockExplorerUrl: 'https://sepolia.etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  decimals: 18,
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
};

const ethereumPrivateKeyProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig,
  },
});

export const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  network: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  clientId: "BDqemZQO-jF43PCg754_ZbQ6Y1BGk0dXpIcong0bST0pnRkZzI9K8N2c9dEPOMKArj96lRb8a42n9Qn8Rew5uD8",
  privateKeyProvider: ethereumPrivateKeyProvider,
  redirectUrl
});