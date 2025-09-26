import { NavigationContainer } from '@react-navigation/native';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStack from './navigation/RootStack';

Linking.addEventListener('url', ({ url }) => {
  console.log('Got a deeplink url! ', url);
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer
        linking={{
          prefixes: ['housingweb3://'],
        }}
      >
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
