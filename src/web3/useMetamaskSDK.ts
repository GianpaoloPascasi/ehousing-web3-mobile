import MetaMaskSDK, { CommunicationLayerPreference } from '@metamask/sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';

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
let initialized = false;
sdk.on('initialized', payload => {
  console.log('initialized', payload, sdk?.getProvider()?.getSelectedAddress());
  initialized = true;
});
export default function useMetamaskSdk() {
  const [isInitialized, setIsInitialized] = useState(initialized);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    sdk.on('initialized', payload => {
      console.log(
        'initialized',
        payload,
        sdk?.getProvider()?.getSelectedAddress(),
      );
      setIsInitialized(true);
    });
    sdk.on('connectWithResponse', payload => {
      console.log('connectWithResponse', payload);
      setIsConnected(true);
    });
    const id = _BackgroundTimer.setInterval(async () => {
      const connected = sdk.getProvider()?.isConnected();
      if (connected) {
        console.log('Connected!');
        clearInterval(id);
      }
      const addr = sdk.getProvider()?.getSelectedAddress();
      console.log(addr ? 'Saving address' : 'No address selected');
      if (connected && addr) {
        await AsyncStorage.setItem('lastAccount', addr);
        console.log('Setted address!', addr);
        _BackgroundTimer.clearInterval(id);
      }
      setIsConnected(connected ?? false);
    }, 2000);

    return () => {
      console.log('Stopping background timer');
      _BackgroundTimer.clearInterval(id);
    };
  }, []);

  return { sdk, isInitialized, isConnected };
}

export { sdk };
