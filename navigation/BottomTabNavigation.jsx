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
    ChatTest,
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
import { Image } from 'expo-image';

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
        height: 60,
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
        if (userStored === null) {
            setType('')
        } else {
            setType(userStored.type)
            setAvatar(userStored.avatar)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
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
                                size={24}
                                color={focused ? COLORS.primary : COLORS.black}
                            />
                        )
                    },
                }}
            />
            <Tab.Screen
                name="ChatTest"
                component={ChatTest}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name="chatbox-outline"
                                size={24}
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
                                        size={24}
                                        color={'#fff'}
                                    />
                                </LinearGradient>
                            )
                        },
                    }}
                />
            ) : null}

            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <FontAwesome5
                                name="heart"
                                size={24}
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
                                        height: 24,
                                        width: 24,
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
                                        height: 24,
                                        width: 24,
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
                                    size={24}
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
