import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons'
import { styles } from '../Chat/ChatStyle'
import { Image } from 'expo-image'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../interfaces/config'
import messaging from '@react-native-firebase/messaging';
const NotificationScreen = ({ navigation }) => {
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])

    const organization = [
        {
            id: '651d0055a528879d9d06ce27',
            image: images.user6,
            name: 'Giày ấm',
            isActive: true,
            username: '@giayam',
        },
        {
            id: '6544e7c4084e4b75ef3d365e',
            image: images.user5,
            name: 'Quỹ từ thiện tu viện Tường Vân',
            isActive: false,
            username: '@tuvientuongvan',
        },
        {
            id: '6523fc90d176717dd38932b2',
            image: images.user4,
            name: 'Hội từ thiện Thiện Tâm',
            isActive: true,
            username: '@thientam',
        },
    ]
    const noti = [
        {
            id: '1',
            image: images.post4,
            name: 'Quỹ từ thiện Việt Nam',
            date: '30 phút trước',
            content: 'đã thêm 1 ảnh mới',
        },
        {
            id: '6523fc90d176717dd38932b2',
            image: images.post3,
            name: 'Hội người khuyết tật Bình Đinh',
            date: '2 giờ trước',
            content: 'đã thêm 3 ảnh mới',
        },
        {
            id: '651d0055a528879d9d06ce27',
            image: images.post1,
            name: 'Hội chữ thập đỏ tỉnh Bà Rịa - Vũng Tàu',
            date: '1 ngày trước',
            content: 'đã thêm 5 ảnh mới',
        },
        {
            id: '6544e7c4084e4b75ef3d365e',
            image: images.post2,
            name: 'Hội người già neo đơn',
            date: '2 ngày trước',
            content: 'đã thêm 3 ảnh mới',
        },

        {
            id: '2',
            image: images.post5,
            name: 'Quỹ thiện tâm',
            date: '3 ngày trước',
            content: 'đã thêm 6 ảnh mới',
        },
        {
            id: '3',
            image: images.user7,
            name: 'Sài gòn xanh',
            date: '3 ngày trước',
            content: 'đã thêm 1 ảnh mới',
        },
    ]
    const viewProfile = async (_orgId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/profile/' + _orgId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate(
                    'ProfileUser',
                    response.data.data.profileResult
                )
            }
        } catch (error) {
            console.log('API Error:', error)
        }
    }
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL

        if (enabled) {
            console.log('Authorization status:', authStatus)
        }
    }
    useEffect(() => {
        if (requestUserPermission()) {
            messaging()
                .getToken()
                .then((token) => {
                    console.log(token)
                })
        } else {
            console.log('Failed token status', authStatus)
        }

        messaging()
            .getInitialNotification()
            .then( async (remoteMessage) => {
                if (remoteMessage) {
                    console.log(
                        'Notification caused app to open from quit state:',
                        remoteMessage.notification
                    )
                }
            })
        // Assume a message-notification contains a "type" property in the data payload of the screen to open

        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log(
                'Notification caused app to open from background state:',
                remoteMessage.notification
            )
        })

        // Register background handler
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log('Message handled in the background!', remoteMessage)
        })

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            Alert.alert(
                'A new FCM message arrived!',
                JSON.stringify(remoteMessage)
            )
        })

        return unsubscribe
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <Text style={{ ...FONTS.h4, marginLeft: 8 }}>Thông báo</Text>
            </View>
            <ScrollView
                style={{ flex: 1, backgroundColor: '#fff', padding: 12 }}
            >
                {/* Render notification data */}
                <Text
                    style={{
                        marginTop: 25,
                        color: COLORS.black,
                        fontWeight: '700',
                        fontSize: 14,
                    }}
                >
                    Các thông báo
                </Text>
                {noti.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => viewProfile(item.id)}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: 20,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                        source={item.image}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            marginLeft: 5,
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    fontWeight: '500',
                                                    marginRight: 5,
                                                    fontSize: 15,
                                                }}
                                            >
                                                {item.name.length > 25
                                                    ? `${item.name.slice(
                                                          0,
                                                          25
                                                      )}...`
                                                    : item.name}
                                            </Text>
                                            <FontAwesome
                                                name="check-circle"
                                                size={15}
                                                color={'#4EB09B'}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                color: '#696969',
                                                marginBottom: 10,
                                            }}
                                        >
                                            {item.date}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <Text
                                        style={{
                                            fontWeight: '500',
                                            fontSize: 15,
                                        }}
                                    >
                                        {item.content}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                <View
                    style={{
                        paddingVertical: 10,
                        marginTop: 30,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '700',
                                fontSize: 14,
                            }}
                        >
                            Có thể bạn quan tâm
                        </Text>
                    </View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{ flexDirection: 'row', marginRight: 10 }}
                        onPress={() => navigation.navigate('FeaturedArticle')}
                    >
                        <Text
                            style={{
                                color: COLORS.primary,
                                fontSize: 14,
                                marginLeft: 10,
                            }}
                        >
                            Xem tất cả
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Render organization data */}
                {organization.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => viewProfile(item.id)}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                marginTop: 20,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: 25,
                                        }}
                                        source={item.image}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            marginLeft: 5,
                                            justifyContent: 'space-between',
                                            marginVertical: 5,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    fontWeight: '500',
                                                    marginRight: 5,
                                                }}
                                            >
                                                {item.name.length > 25
                                                    ? `${item.name.slice(
                                                          0,
                                                          25
                                                      )}...`
                                                    : item.name}
                                            </Text>
                                            <FontAwesome
                                                name="check-circle"
                                                size={15}
                                                color={'#4EB09B'}
                                            />
                                        </View>
                                        <Text style={{ color: '#696969' }}>
                                            {item.username}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        padding: 5,
                                        width: 80,
                                        height: 40,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontWeight: '500',
                                            fontSize: 15,
                                        }}
                                    >
                                        Theo dõi
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotificationScreen
