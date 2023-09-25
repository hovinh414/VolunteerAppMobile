import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { View, Text } from 'react-native'
import { useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Welcome } from './screens'
import BottomTabNavigation from './navigation/BottomTabNavigation'
import SignupType from './screens/Signup/SignType'
import SignupOrganisation from './screens/Signup/SignupOrganisation'
import Signup from './screens/Signup/Signup'

const Stack = createNativeStackNavigator()

SplashScreen.preventAutoHideAsync()
export default function App() {
    const [fontsLoaded] = useFonts({
        black: require('./assets/fonts/Poppins-Black.ttf'),
        regular: require('./assets/fonts/Poppins-Regular.ttf'),
        bold: require('./assets/fonts/Poppins-Bold.ttf'),
        medium: require('./assets/fonts/Poppins-Medium.ttf'),
        mediumItalic: require('./assets/fonts/Poppins-MediumItalic.ttf'),
        semiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
        semiBoldItalic: require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync()
        }
    }, [fontsLoaded])

    if (!fontsLoaded) {
        return null
    }
    return (
        <SafeAreaProvider onLayout={onLayoutRootView}>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Welcome"
                        component={Welcome}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="BottomTabNavigation"
                        component={BottomTabNavigation}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="SignupType"
                        component={SignupType}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={Signup}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="SignupOrganisation"
                        component={SignupOrganisation}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
