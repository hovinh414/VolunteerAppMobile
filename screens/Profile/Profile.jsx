import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { posts } from '../../constants/data'
import AsyncStoraged from '../../services/AsyncStoraged'
import ImageAvata from '../../assets/hero2.jpg'
import { Image } from 'expo-image'

const cover = '../../assets/cover.jpg'
const PostsRoute = () => (
    <View
        style={{
            flex: 1,
            paddingTop: 12,
        }}
    >
        <FlatList
            data={posts}
            numColumns={3}
            renderItem={({ item, index }) => (
                <View
                    style={{
                        flex: 1,
                        aspectRatio: 1,
                        margin: 3,
                    }}
                >
                    <Image
                        key={index}
                        source={item.image}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 12,
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                            }}
                        >
                            <Ionicons
                                name="eye"
                                size={14}
                                color={COLORS.white}
                            />
                            <Text style={{ color: COLORS.white }}>
                                {item.numOfViews}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color={COLORS.white}
                            />
                            <Text style={{ color: COLORS.white }}>
                                {item.numOfViews}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        />
    </View>
)

const InfoRoute = () => {
    return <ScrollView style={{ flex: 1, paddingTop: 25 }}></ScrollView>
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: InfoRoute,
})
const Profile = ({ navigation }) => {
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setAddress(userStored.address)
        setEmail(userStored.email)
    }
    useEffect(() => {
        getUserStored()
    }, [])

    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Bài đăng', icon: 'home' },
        { key: 'second', title: 'Thông tin', icon: 'user' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            renderIcon={({ route, focused, color }) => (
                <AntDesign
                    name={route.icon}
                    size={20}
                    color={focused ? COLORS.black : 'gray'}
                />
            )}
            style={{
                backgroundColor: '#fff',
                height: 64,
            }}
            renderLabel={({ focused, route }) => (
                <Text style={[{ color: focused ? COLORS.black : 'gray' }]}>
                    {route.title}
                </Text>
            )}
        />
    )

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View>
                <View
                    style={{
                        width: '100%',
                        position: 'relative',
                        height: '63%',
                    }}
                >
                    <Image
                        source={require(cover)}
                        resizeMode="cover"
                        style={{
                            height: 228,
                            width: '100%',
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            top: 15,
                            right: 12,
                            zIndex: 1,
                        }}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Feather
                            name="settings"
                            size={28}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', top: -67 }}>
                        <Image
                            source={avatar ? { uri: avatar } : ImageAvata}
                            resizeMode="contain"
                            style={{
                                height: 135,
                                width: 135,
                                borderRadius: 999,
                            }}
                        />

                        <Text
                            style={{
                                ...FONTS.h3,
                                color: COLORS.black,
                                marginVertical: 8,
                            }}
                        >
                            {fullname}
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 6,
                                marginHorizontal: 100,
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcons
                                name="location-on"
                                size={24}
                                color="black"
                            />
                            <Text
                                style={{
                                    ...FONTS.body4,
                                    marginLeft: 4,
                                    textAlign: 'justify',
                                }}
                            >
                                {address}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                            <TouchableOpacity
                                style={{
                                    width: 124,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: COLORS.primary,
                                    borderRadius: 15,
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        ...FONTS.body5,
                                        color: '#fff',
                                    }}
                                >
                                    Theo dõi
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 36,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#DCDCDC',
                                    borderRadius: 15,
                                    marginRight: 5,
                                }}
                            >
                                <Feather
                                    name="heart"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 36,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#DCDCDC',
                                    borderRadius: 15,
                                    marginRight: 5,
                                }}
                            >
                                <Feather
                                    name="message-square"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 36,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#DCDCDC',
                                    borderRadius: 15,
                                    marginRight: 5,
                                }}
                            >
                                <AntDesign
                                    name="sharealt"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: 36,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#DCDCDC',
                                    borderRadius: 15,
                                    marginRight: 5,
                                }}
                            >
                                <Feather
                                    name="more-horizontal"
                                    size={20}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                paddingVertical: 8,
                                flexDirection: 'row',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'monterrat',
                                        fontSize: 16,
                                        lineHeight: 30,
                                        color: COLORS.black,
                                    }}
                                >
                                    200
                                </Text>
                                <Text
                                    style={{
                                        ...FONTS.body5,
                                        color: COLORS.black,
                                    }}
                                >
                                    Người theo dõi
                                </Text>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'monterrat',
                                        fontSize: 16,
                                        lineHeight: 30,
                                        color: COLORS.black,
                                    }}
                                >
                                    67
                                </Text>
                                <Text
                                    style={{
                                        ...FONTS.body5,
                                        color: COLORS.black,
                                    }}
                                >
                                    Đang theo dõi
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        marginHorizontal: 22,
                    }}
                >
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Profile
