import Web3Auth, {WEB3AUTH_NETWORK, LOGIN_PROVIDER} from "@web3auth/react-native-sdk";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

const web3auth = new Web3Auth(WebBrowser, SecureStore, {
  network: WEB3AUTH_NETWORK.TESTNET,
  clientId: ,
  privateKeyProvider: ,
  redirectUrl: ,
});
