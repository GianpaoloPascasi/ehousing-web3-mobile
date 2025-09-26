import MetaMaskSDK, { SDKProvider } from '@metamask/sdk';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Button, StyleSheet, Text, View } from 'react-native';
import { getReadableContract } from '../web3/ehousing.sol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMetamaskSdk from '../web3/sdk';

function Connect() {
  // check https://docs.metamask.io/sdk/connect/react-native/
  const { sdk, isInitialized, isConnected } = useMetamaskSdk();
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);
  const navigation = useNavigation();

  const redirect = useCallback(
    (ethereum: SDKProvider) =>
      (async function () {
        console.log('Redirecting');
        const contract = getReadableContract(ethereum);
        const initialOwner = (await contract.read._initialOwner()) as string;
        if (sdk?.getProvider()?.getSelectedAddress() == null) {
          const requestedAccounts = await ethereum?.request({
            method: 'eth_requestAccounts',
          });
          console.log('requestedAccounts: ', requestedAccounts);
        }
        console.log(initialOwner, sdk?.getProvider()?.getSelectedAddress());
        if (initialOwner.toLowerCase() === sdk?.getProvider()?.getSelectedAddress()?.toLowerCase()) {
          navigation.navigate('AdminIndex');
        } else {
          navigation.navigate('CustomerIndex');
        }
      })(),
    [navigation, sdk],
  );

  useEffect(() => {
    (async () => {
      const savedAccount = await AsyncStorage.getItem('lastAccount');
      if (savedAccount) {
        // setTimeout(async () => await sdk?.resume(), 3000);
        setTimeout(async () => await sdk?.getProvider()?.request({
            method: 'eth_requestAccounts',
          }), 3000);
      }
    })();
  }, [isInitialized, sdk, isConnected, redirect]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', async state => {
      if (state === 'active') {
        console.log('App resurrected! Isconnected:' + isConnected);
        redirect(sdk!.getProvider()!);
      }
    });
    return () => sub.remove();
  }, [sdk, redirect, isConnected]);

  // Connect to MetaMask
  const connectWallet = useCallback(async () => {
    const ethereum = sdk?.getProvider();
    if (!ethereum) {
      console.error('Provider not initialized');
      return;
    }
    try {
      if (accounts) {
        console.log('Resume');
        await sdk?.resume();
        console.log(
          'isConnected after resume',
          ethereum.isConnected(),
          ethereum.getSelectedAddress(),
        );
      } else {
        console.log('Connect');
        const connectedAccounts = await sdk?.connect();
        console.log('Connected accounts', connectedAccounts);
        setAccounts(connectedAccounts);
        if (connectedAccounts) {
          await AsyncStorage.setItem('lastAccount', connectedAccounts[0]);
        }
      }

      // const accounts = await ethereum?.request({
      //   method: 'eth_requestAccounts',
      // });
      console.log('Connected!');

      // await redirect()(ethereum);
    } catch (err) {
      console.error('Connection error:', err);
    }
  }, [sdk, accounts]);

  // Disconnect wallet
  const disconnectWallet = async () => {
    await (sdk as MetaMaskSDK).terminate();
    await AsyncStorage.clear();
    setAccounts(undefined);
    console.log('Disconnected');
  };

  return (
    <View style={styles.container}>
      {isInitialized && !isConnected ? (
        <Button onPress={connectWallet} title="Connect" />
      ) : null}

      <Text>
        Account:{' '}
        {(accounts && accounts[0]) || sdk?.getProvider()?.getSelectedAddress()}
      </Text>

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

export default Connect;
