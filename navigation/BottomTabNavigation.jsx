import { View, Text, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
    Feather,
    Ionicons,
    FontAwesome,
    FontAwesome5,
} from '@expo/vector-icons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { COLORS } from '../constants'
import {
    Search,
    LoginScreen,
    Notifications,
    Profile,
    Settings,
} from '../screens'
import Feed from '../screens/Feed'
import Create from '../screens/Post/Create'
import { LinearGradient } from 'expo-linear-gradient'
import AsyncStoraged from '../services/AsyncStoraged'
import ImageAvata from '../assets/hero2.jpg'

import ProfileOrganisation from '../screens/Profile/ProfileOrganisation'
import NotificationScreen from '../screens/Feed/NotificationScreen'
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
const Tab = createBottomTabNavigator()

const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    tabBarHideOnKeyboard: true,
    tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        elevation: 0,
        height: 80,
        backgroundColor: '#fff',
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
    },
}
const BottomTabNavigation = () => {
    const [type, setType] = useState('')
    const [avatar, setAvatar] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setAvatar(userStored.avatar)
            setType(userStored.type)
        } else {
            setAvatar(null)
            setType(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            // Fetch data each time the screen comes into focus
            getUserStored();
        }, [])
    );
    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen
                name="Feed"
                component={Feed}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Feather
                                name="home"
                                size={25}
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Feather
                                name="search"
                                size={25}
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />

            {type === 'Organization' ? (
                <Tab.Screen
                    name="Create"
                    component={Create}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <LinearGradient
                                    colors={['#D4145A', '#FBB03B']}
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: Platform.OS == 'ios' ? 50 : 60,
                                        height: Platform.OS == 'ios' ? 50 : 60,
                                        top: Platform.OS == 'ios' ? -10 : -20,
                                        borderRadius: 22,
                                        borderColor: '#fff',
                                        borderWidth: 4,
                                    }}
                                >
                                    <Feather
                                        name="plus-circle"
                                        size={25}
                                        color={'#fff'}
                                    />
                                </LinearGradient>
                            )
                        },
                    }}
                />
            ) : null}

            <Tab.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome5
                                name="heart"
                                size={25}
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />
            {type === 'User' || type === 'Admin' || type === 'user' ? (
                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Image
                                    source={
                                        avatar ? { uri: avatar } : ImageAvata
                                    }
                                    style={{
                                        height: 25,
                                        width: 25,
                                        borderWidth: 1,
                                        borderRadius: 85,
                                        borderColor: focused
                                            ? COLORS.primary
                                            : COLORS.black,
                                    }}
                                />
                            )
                        },
                    }}
                />
            ) : type === 'Organization' ? (
                <Tab.Screen
                    name="ProfileOrganisation"
                    component={ProfileOrganisation}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Image
                                    source={
                                        avatar ? { uri: avatar } : ImageAvata
                                    }
                                    style={{
                                        height: 25,
                                        width: 25,
                                        borderWidth: 1,
                                        borderRadius: 85,
                                        borderColor: focused
                                            ? COLORS.primary
                                            : COLORS.black,
                                    }}
                                />
                            )
                        },
                    }}
                />
            ) : (
                <Tab.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        tabBarIcon: ({ focused }) => {
                            return (
                                <FontAwesome
                                    name="user-circle"
                                    size={25}
                                    color={
                                        focused ? COLORS.primary : COLORS.black
                                    }
                                />
                            )
                        },
                    }}
                />
            )}
        </Tab.Navigator>
    )
}

export default BottomTabNavigation
