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
import EditProfile from './screens/Profile/EditProfile'
import Settings from './screens/Profile/Settings'
import LoginScreen from './screens/Login/LoginScreen'
import ChangePassword from './screens/Profile/ChangePassword'
import ChangeAddress from './screens/Profile/ChangeAddress'
import Chat from './screens/Chat/Chat'
import ChatDetail from './screens/Chat/ChatDetail'
import DetailPost from './screens/Post/DetailPost'
import ViewDetailImage from './screens/Post/ViewDetailImage'
import ProfileUser from './screens/Profile/ProfileUser'
import FeaturedArticle from './screens/Feed/FeaturedArticle'
import NotificationScreen from './screens/Feed/NotificationScreen'
import Attendance from './screens/Attendance/Attendance'
import ShowQr from './screens/Attendance/ShowQr'
import ScanQR from './screens/Attendance/ScanQR'
import Statistical from './screens/Post/Statistical'
import MapScreen from './screens/Map/MapScreen'
import ProductiveActivities from './screens/Feed/ProductiveActivities'
import VerifyRoute from './screens/Profile/ProfileComponent/VerifyRoute'
import InfoRoute from './screens/Profile/ProfileComponent/InfoRoute'
const Stack = createNativeStackNavigator()

SplashScreen.preventAutoHideAsync()
export default function App() {
    const [fontsLoaded] = useFonts({
        black: require('./assets/fonts/Poppins-Black.ttf'),
        regular: require('./assets/fonts/Montserrat-Regular.ttf'),
        regularBold: require('./assets/fonts/Montserrat-SemiBold.ttf'),
        bold: require('./assets/fonts/Poppins-Bold.ttf'),
        medium: require('./assets/fonts/Poppins-Medium.ttf'),
        mediumItalic: require('./assets/fonts/Poppins-MediumItalic.ttf'),
        semiBold: require('./assets/fonts/Poppins-SemiBold.ttf'),
        semiBoldItalic: require('./assets/fonts/Poppins-SemiBoldItalic.ttf'),
        monterrat: require('./assets/fonts/Montserrat-Bold.ttf'),
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
                    <Stack.Screen
                        name="EditProfile"
                        component={EditProfile}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Settings"
                        component={Settings}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="LoginScreen"
                        component={LoginScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ChangePassword"
                        component={ChangePassword}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={Chat}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ChatDetail"
                        component={ChatDetail}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="DetailPost"
                        component={DetailPost}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ViewDetailImage"
                        component={ViewDetailImage}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ProfileUser"
                        component={ProfileUser}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="FeaturedArticle"
                        component={FeaturedArticle}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Statistical"
                        component={Statistical}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="NotificationScreen"
                        component={NotificationScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Attendance"
                        component={Attendance}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ShowQr"
                        component={ShowQr}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ScanQR"
                        component={ScanQR}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="MapScreen"
                        component={MapScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ProductiveActivities"
                        component={ProductiveActivities}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ChangeAddress"
                        component={ChangeAddress}
                        options={{
                            headerShown: false,
                            presentation: 'modal',
                            animationTypeForReplace: 'push',
                            animation: 'slide_from_bottom',
                        }}
                    />
                    <Stack.Screen
                        name="VerifyRoute"
                        component={VerifyRoute}
                        options={{
                            headerShown: false,
                            presentation: 'modal',
                            animationTypeForReplace: 'push',
                            animation: 'slide_from_bottom',
                        }}
                    />
                    <Stack.Screen
                        name="InfoRoute"
                        component={InfoRoute}
                        options={{
                            headerShown: false,
                            presentation: 'modal',
                            animationTypeForReplace: 'push',
                            animation: 'slide_from_bottom',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}
