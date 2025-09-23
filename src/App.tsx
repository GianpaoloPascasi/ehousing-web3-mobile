/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import MetaMaskSDK, { CommunicationLayerPreference } from '@metamask/sdk';
import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackgroundTimer from 'react-native-background-timer';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  // check https://docs.metamask.io/sdk/connect/react-native/
  const sdk = useRef<MetaMaskSDK>(null);
  const [initialized, setInitialized] = useState(false);
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    sdk.current = new MetaMaskSDK({
      dappMetadata: {
        name: 'MyDapp',
        url: 'https://mydapp.com',
      },
      communicationLayerPreference: CommunicationLayerPreference.SOCKET, // recommended for mobile
      timer: BackgroundTimer,
      openDeeplink: string => {
        console.log('Trying to open', string);
        Linking.openURL(string);
      },
      storage: {
        enabled: true,
        // duration: 999999999,
        // storageManager: {
        //   async persistAccounts(accounts, context) {
        //     await AsyncStorage.setItem('accounts', JSON.stringify(accounts));
        //   },
        //   async persistChannelConfig(channelConfig, context) {
        //     await AsyncStorage.setItem(
        //       'channelConfig',
        //       JSON.stringify(channelConfig),
        //     );
        //   },
        //   async persistChainId(chainId, context) {
        //     await AsyncStorage.setItem('chainId', chainId);
        //   },
        //   async getCachedAccounts() {
        //     return JSON.parse(await AsyncStorage.getItem('accounts') ?? '[]') as string[];
        //   },
        //   async getPersistedChannelConfig() {
        //     return JSON.parse(await AsyncStorage.getItem('channelConfig') ?? '{}');
        //   },
        //   getCachedChainId() {
        //     return AsyncStorage.getItem('chainId');
        //   },
        //   async terminate() {
        //     await AsyncStorage.clear();
        //   },
        // },
      },
    });
    sdk.current.on('connectWithResponse', payload =>
      console.log('connectWithResponse', payload),
    );
    sdk.current.on('connection_status', payload =>
      console.log('connection_status', payload),
    );
    sdk.current.on('initialized', payload => {
      console.log(
        'initialized',
        payload,
        sdk.current?.activeProvider?.getSelectedAddress(),
      );
      setInitialized(true);
    });
    sdk.current.on('provider_update', payload =>
      console.log('provider_update', payload),
    );

    const resume = async () => {
      await sdk.current?.resume();
      console.log('Resumed');
    };
    resume();
  }, []);

  // Connect to MetaMask
  const connectWallet = async () => {
    const ethereum = sdk.current?.activeProvider;
    if (!ethereum) {
      console.error('Provider not initialized');
      return;
    }
    try {
      setAccounts(await sdk.current?.connect());
      // const accounts = await ethereum?.request({
      //   method: 'eth_requestAccounts',
      // });
      console.log('Connected!');
      await sdk.current?.resume();
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const balance = await signer.getBalance();
      console.log('Connected account:', accounts[0]);
      console.log('ETH balance:', ethers.utils.formatEther(balance));
    } catch (err) {
      console.error('Connection error:', err);
    }
  };

  // Handle state changes
  // useEffect(() => {
  //   if (account && chainId) {
  //     // Handle account and network changes
  //   }
  // }, [account, chainId]);

  // Disconnect wallet
  const disconnectWallet = async () => {
    await sdk.current?.terminate();
    setAccounts(undefined);
    console.log('Disconnected');
  };

  return (
    <View style={styles.container}>
      {!accounts && initialized ? (
        <Button onPress={connectWallet} title="Connect" />
      ) : null}

      <Text>Account: {accounts && accounts[0]}</Text>

      {accounts ? (
        <Button onPress={disconnectWallet} title="DisConnect" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
