/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { MetaMaskProvider, SDKConfigProvider, useSDK, useSDKConfig } from '@metamask/sdk-react';
// import BackgroundTimer from 'react-native-background-timer';
import { useEffect } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

const WithSDKConfig = ({ children }: { children: React.ReactNode }) => {
  const {
    socketServer,
    infuraAPIKey,
    useDeeplink,
    debug,
    checkInstallationImmediately,
  } = useSDKConfig();

  return (
    <MetaMaskProvider
      debug={debug}
      sdkOptions={{
        communicationServerUrl: socketServer,
        infuraAPIKey,
        readonlyRPCMap: {
          '0x539': process.env.NEXT_PUBLIC_PROVIDER_RPCURL ?? '',
        },
        logging: {
          developerMode: true,
          plaintext: true,
        },
        openDeeplink: (link: string, _target?: string) => {
          console.debug(`App::openDeepLink() ${link}`);
          // if (canOpenLink) {
          //   Linking.openURL(link);
          // } else {
          //   console.debug(
          //     'useBlockchainProiver::openDeepLink app is not active - skip link',
          //     link,
          //   );
          // }
        },
        // timer: BackgroundTimer,
        useDeeplink,
        checkInstallationImmediately: true,
        storage: {
          enabled: true,
          // storageManager: new StoraManagerAS(),
        },
        dappMetadata: {
          name: 'devreactnative',
          url: 'https://demornativesdk.metamask.io',
        },
        i18nOptions: {
          enabled: true,
        },
      }}
    >
      {children}
    </MetaMaskProvider>
  );
};

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  const { account, chainId, ethereum, sdk } = useSDK();
  // check https://docs.metamask.io/sdk/connect/react-native/
  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      console.log(sdk?.connect, sdk)
      await sdk?.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Handle state changes
  useEffect(() => {
    if (account && chainId) {
      // Handle account and network changes
    }
  }, [account, chainId]);

  // Disconnect wallet
  const disconnectWallet = async () => {
    await sdk?.terminate();
  };

  return (
    <SDKConfigProvider
      // initialSocketServer={COMM_SERVER_URL}
      // initialInfuraKey={INFURA_API_KEY}
    >
      <WithSDKConfig>
        <View style={styles.container}>
          <Button onPress={connectWallet} title="Connect" />
          {account ? <Text>{account}</Text> : null}
          {account ? (
            <Button onPress={disconnectWallet} title="DisConnect" />
          ) : null}
        </View>
      </WithSDKConfig>
    </SDKConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
