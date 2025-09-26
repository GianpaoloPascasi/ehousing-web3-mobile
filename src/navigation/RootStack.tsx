import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connect from '../pages/Connect';
import { StaticParamList } from '@react-navigation/native';
import CustomerIndex from '../pages/Customer/CustomerIndex';
import AdminIndex from '../pages/Admin/AdminIndex';

const rootStack = createNativeStackNavigator({
  screens: {
    Connect: {
      screen: Connect,
      linking: {
        path: 'connect',
      },
    },
    CustomerIndex,
    AdminIndex,
  },
  initialRouteName: 'Connect',
});

type RootStackScreensNames = keyof typeof rootStack.config.screens;

type RootStackParamList = StaticParamList<typeof rootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

function RootStack() {
  return (
    <rootStack.Navigator>
      {/* {Object.keys(rootStack.config.screens).map(
        (screenName) => (
          <rootStack.Screen
            name={screenName}
            component={(rootStack.config.screens[screenName as RootStackScreensNames] as any)}
            key={screenName}
          />
        ),
      )} */}
      <rootStack.Screen name={'Connect'} component={Connect} />
      <rootStack.Screen name={'AdminIndex'} component={AdminIndex} />
      <rootStack.Screen name={'CustomerIndex'} component={CustomerIndex} />
    </rootStack.Navigator>
  );
}

export default RootStack;
