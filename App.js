import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack'
import { LoginScreen, SignType, Signup, Welcome, SignupOrganisation } from './screens';
import {Feed} from './screens/Home/Feed';

const Stack = createNativeStackNavigator()
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName = 'Welcome'
      >
        <Stack.Screen
        name = "Welcome"
        component={Welcome}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
        name = "LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
        name = "Signup"
        component={Signup}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
        name = "SignType"
        component={SignType}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
        name = "SignupOrganisation"
        component={SignupOrganisation}
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen
          name="Feed"
          component={Feed}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
