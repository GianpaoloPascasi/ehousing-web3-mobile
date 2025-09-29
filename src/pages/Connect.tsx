import MetaMaskSDK from '@metamask/sdk';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useMetamaskSdk from '../web3/useMetamaskSDK';
import useIsAdmin from '../web3/useIsAdmin';
import _BackgroundTimer from 'react-native-background-timer';

function Connect() {
  // check https://docs.metamask.io/sdk/connect/react-native/
  const { sdk, isInitialized, isConnected } = useMetamaskSdk();
  const [accounts, setAccounts] = useState<string[] | undefined>(undefined);
  const navigation = useNavigation();
  const { isAdmin, isLoadingAdmin } = useIsAdmin();

  const redirect = useCallback(
    () =>
      (async function () {
        console.log(
          'Redirecting',
          'isConnected ' + isConnected,
          'isAdmin ' + isAdmin,
          'isLoadingAdmin ' + isLoadingAdmin,
        );
        if (isLoadingAdmin) {
          return;
        }
        if (!isConnected) {
          console.warn('Tried to redirect unauthenticated user!');
          return;
        }
        if (isAdmin) {
          navigation.navigate('AdminIndex');
        } else {
          navigation.navigate('CustomerIndex');
        }
      })(),
    [navigation, isAdmin, isConnected, isLoadingAdmin],
  );

  useEffect(() => {
    let id = 0;
    (async () => {
      const savedAccount = await AsyncStorage.getItem('lastAccount');
      if (savedAccount) {
        _BackgroundTimer.setTimeout(async () => await sdk?.resume(), 3000);
        id = _BackgroundTimer.setInterval(() => {
          console.log('Checking connected');
          if (isConnected) {
            console.log('IsConnected!');
            _BackgroundTimer.clearInterval(id);
            redirect();
          }
        }, 1000);
      }
    })();
    return () => _BackgroundTimer.clearInterval(id);
  }, [isInitialized, sdk, isConnected, redirect]);

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

      console.log('Connected!');
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
