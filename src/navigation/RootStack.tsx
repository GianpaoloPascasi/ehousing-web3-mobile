/* eslint-disable react-hooks/rules-of-hooks */
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Connect from '../pages/Connect';
import { StaticParamList } from '@react-navigation/native';
import CustomerIndex from '../pages/Customer/CustomerIndex';
import AdminIndex from '../pages/Admin/AdminIndex';
import useIsAdmin from '../web3/useIsAdmin';
import HouseList  from '../pages/Admin/HouseList';
import CreateHouse from '../pages/Admin/CreateHouse';

const rootStack = createNativeStackNavigator({
  screens: {
    Connect: {
      screen: Connect,
      linking: {
        path: 'connect',
      },
    },
    CustomerIndex: {
      screen: CustomerIndex,
    },
    AdminIndex: { screen: AdminIndex, if: () => useIsAdmin().isAdmin },
    HouseList: { screen: HouseList, if: () => useIsAdmin().isAdmin },
    CreateHouse: { screen: CreateHouse, if: () => useIsAdmin().isAdmin },
  },
  initialRouteName: 'Connect',
});

// type RootStackScreensNames = keyof typeof rootStack.config.screens;

type RootStackParamList = StaticParamList<typeof rootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export default function RootStack() {
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
