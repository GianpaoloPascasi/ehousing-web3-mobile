/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useSDK } from '@metamask/sdk-react';
import { NewAppScreen } from '@react-native/new-app-screen';
import {
  Button,
  StatusBar,
  StyleSheet,
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

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const { connect, terminate, account, chainId, ethereum, status, ready } = useSDK();

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      console.log(connect, terminate, account, chainId, ethereum, status, ready);
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={connectWallet} title="Connect" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
