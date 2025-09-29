import { useEffect, useState } from 'react';
import { sdk } from './useMetamaskSDK';
import _BackgroundTimer from 'react-native-background-timer';
import { getReadableContract } from './ehousing.sol';

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);

  useEffect(() => {
    const id = _BackgroundTimer.setInterval(async () => {
      const connected = sdk.getProvider()?.isConnected();
      console.log('Running admin check task', connected);
      if (connected) {
        const addr = sdk.getProvider()?.getSelectedAddress();
        console.log("Check admin addr ", addr);
        if (connected && addr) {
          const contract = getReadableContract(sdk.getProvider()!);
          const initialOwner = (await contract.read._initialOwner()) as string;
          if (
            initialOwner.toLowerCase() ===
            sdk?.getProvider()?.getSelectedAddress()?.toLowerCase()
          ) {
            setIsAdmin(true);
          }
          _BackgroundTimer.clearInterval(id);
          setIsLoadingAdmin(false);
        }
      }
    }, 2000);

    return () => {
      console.log('Stopping background timer');
      _BackgroundTimer.clearInterval(id);
    };
  }, []);

  return { isAdmin, isLoadingAdmin };
}
