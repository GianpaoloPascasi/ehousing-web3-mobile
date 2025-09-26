import MetaMaskSDK, { CommunicationLayerPreference } from '@metamask/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';

function initSdk() {
  console.log('Called initSdk');
  const sdk = new MetaMaskSDK({
    dappMetadata: {
      name: 'HousingWeb3',
      url: 'https://housingweb3.pascasi.it/connect',
      scheme: 'housingweb3',
    },
    useDeeplink: true,
    enableAnalytics: false,
    communicationLayerPreference: CommunicationLayerPreference.SOCKET, // recommended for mobile
    timer: _BackgroundTimer,
    openDeeplink: async string => {
      console.log('Trying to open', string);
      Linking.openURL(string);
    },
    storage: {
      enabled: true,
      duration: 99999999,
    },
  });
  sdk.on('provider_update', payload => console.log('provider_update', payload));
  return sdk;
}

function useMetamaskSdk() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const sdk = useRef<MetaMaskSDK>(null);

  useEffect(() => {
    sdk.current = initSdk();
    sdk.current.on('initialized', payload => {
      console.log(
        'initialized',
        payload,
        sdk.current?.getProvider()?.getSelectedAddress(),
      );
      setIsInitialized(true);
    });
    sdk.current.on('connectWithResponse', payload => {
      console.log('connectWithResponse', payload);
      setIsConnected(true);
    });
    console.log("Test")
    const id = _BackgroundTimer.setInterval(async () => {
      console.log("Running background task");
      const connected = sdk.current?.getProvider()?.isConnected();
      if (connected) {
        console.log('Connected!');
      }
      const addr = sdk.current?.getProvider()?.getSelectedAddress();
      if (connected && addr) {
        await AsyncStorage.setItem('lastAccount', addr);
        console.log("Setted address!", addr);
        _BackgroundTimer.clearInterval(id);
      }
      setIsConnected(connected ?? false);
    }, 2000);

    return () => {
      console.log("Stopping background timer");
      _BackgroundTimer.clearInterval(id);
    }
  }, []);

  return { sdk: sdk.current, isInitialized, isConnected };
}

export default useMetamaskSdk;
