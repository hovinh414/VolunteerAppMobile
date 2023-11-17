import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    Modal,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import * as Progress from 'react-native-progress'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../constants'
import { friends, posts } from '../constants/data'
import {
    AntDesign,
    Ionicons,
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
    Entypo,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import API_URL from '../interfaces/config'
import { Image } from 'expo-image'
import AsyncStoraged from '../services/AsyncStoraged'

import Post from './Feed/Post'
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu'
import {
    MyActivity,
    PostOngoing,
    Follow,
    JoinActivity,
    Question,
} from '../components/CustomContent'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
const loading = '../assets/loading.gif'
const Feed = ({ navigation, route }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefreshPost()
        })

        return unsubscribe
    }, [navigation])
    const onRefreshPost = () => {
        setCurrentPage(0)
        setPosts([])
        getPosts()
    }
    const Divider = () => (
        <View
            style={{
                height: StyleSheet.hairlineWidth,
                backgroundColor: '#7F8487',
            }}
        />
    )
    const [posts, setPosts] = useState()
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState()
    const [typePost, setTypePost] = useState('normal')
    const [type, setType] = useState()
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
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
    const getPosts = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/posts?page=1&limit=6',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setPosts(response.data.data)
            }
        } catch (error) {
            console.log('API Error get post:', error)
        }
    }
    useEffect(() => {
        getPosts()
    }, [token])

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        setCurrentPage(1)
        setTypePost('normal')
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const fetchNextPage = async () => {
        if (!isFetchingNextPage) {
            setIsFetchingNextPage(true)
            setIsLoading(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }

            try {
                if (typePost === 'normal') {
                    const response = await axios.get(
                        `${API_URL.API_URL}/posts?page=${
                            currentPage + 1
                        }&limit=6`,
                        config
                    )
                    if (response.data.status === 'SUCCESS') {
                        setPosts([...posts, ...response.data.data])
                        setCurrentPage(currentPage + 1)
                    } else {
                        setPosts([...posts, ...response.data.data])
                    }
                } else {
                    const res = await axios({
                        method: 'post',
                        url: `${API_URL.API_URL}/posts/follows?page=${
                            currentPage + 1
                        }&limit=6`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token,
                        },
                    })

                    if (res.data.status === 'SUCCESS') {
                        setPosts([...posts, ...res.data.data.postsInformation])
                        setCurrentPage(currentPage + 1)
                    } else {
                        setPosts([...posts, ...res.data.data.postsInformation])
                    }
                }
            } catch (error) {
                setIsLoading(false)
                Toast.show({
                    type: 'warning',
                    text1: 'Chưa có bài viết mới!',
                    visibilityTime: 2500,
                })
                console.log('API Error get more post:', error)
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }

    const getPostsFollow = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/posts/follows?page=1&limit=6',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })

            if (res.data.status === 'SUCCESS') {
                setPosts(res.data.data.postsInformation)
                setTypePost('follow')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const viewDetailPost = async (_postId) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + _postId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate('DetailPost', response.data.data)
            }
        } catch (error) {
            console.log('API Error:', error)
        }
    }
    const RenderSuggestionsContainer = () => {
        return (
            <View
                style={{
                    paddingBottom: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                }}
            >
                <View style={{ marginVertical: 8 }}></View>

                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={friends}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => console.log('Pressed')}
                                style={{
                                    paddingVertical: 4,
                                    marginLeft: 12,
                                }}
                            >
                                <Image
                                    source={item.image}
                                    contentFit="contain"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 80,
                                        borderWidth: 3,

                                        borderColor: '#FF493C',
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View
                    style={{
                        borderColor: '#cccc',
                        borderTopWidth: 0.5,
                        paddingVertical: 10,
                        paddingLeft: 15,
                        marginTop: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="newspaper-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '700',
                                fontSize: 14,
                                marginLeft: 5,
                            }}
                        >
                            Chiến dịch gây quỹ nổi bật
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
                <FlatList
                    horizontal={true}
                    // onEndReached={fetchNextPage}
                    showsHorizontalScrollIndicator={false}
                    onEndReachedThreshold={0.4}
                    data={posts}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    marginLeft: 12,
                                }}
                            >
                                <View style={{}}>
                                    <Image
                                        source={item.media}
                                        style={{
                                            width: 300,
                                            height: 220,
                                            borderTopLeftRadius: 15,
                                            borderTopRightRadius: 15,
                                        }}
                                    />
                                    <LinearGradient
                                        colors={[
                                            'rgba(0,0,0,0)',
                                            'rgba(0,0,0,1)',
                                        ]}
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            width: 300,
                                            height: 80,
                                        }}
                                    />
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',

                                        position: 'absolute',
                                        left: 10,
                                        bottom: 5,
                                    }}
                                >
                                    <Image
                                        source={item.ownerAvatar}
                                        style={{
                                            height: 48,
                                            width: 48,
                                            borderRadius: 24,
                                        }}
                                    />
                                    <View
                                        style={{
                                            flexDirection: 'column',
                                            marginLeft: 8,
                                            justifyContent: 'space-between',
                                            marginVertical: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                color: '#fff',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {item.ownerDisplayname}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                color: '#fff',
                                            }}
                                        >
                                            @username
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    marginLeft: 12,
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: '#F0F0F0',
                                        width: 300,
                                        height: 150,
                                        borderBottomLeftRadius: 15,
                                        borderBottomRightRadius: 15,
                                    }}
                                >
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            marginTop: 15,
                                            ...FONTS.body5,
                                        }}
                                    >
                                        {item.content.length > 23
                                            ? `${item.content.slice(0, 23)}...`
                                            : item.content}
                                    </Text>
                                    <View
                                        style={{
                                            marginTop: 17,
                                            paddingVertical: 10,
                                            marginHorizontal: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <View
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.black,
                                                    fontSize: 15,
                                                    marginLeft: 5,
                                                }}
                                            >
                                                Đã tham gia:{' '}
                                                <Text
                                                    style={{
                                                        color: COLORS.primary,
                                                        fontSize: 15,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {item.totalUserJoin} /{' '}
                                                    {item.participants}
                                                </Text>
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={{
                                                flexDirection: 'row',
                                                marginRight: 10,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: COLORS.primary,
                                                    fontSize: 15,
                                                    marginLeft: 10,
                                                }}
                                            >
                                                {(
                                                    (item.totalUserJoin /
                                                        item.participants) *
                                                    100
                                                ).toFixed(0)}{' '}
                                                %
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Progress.Bar
                                            progress={
                                                item.totalUserJoin /
                                                item.participants
                                            }
                                            color="#FF493C"
                                            height={8}
                                            width={280}
                                            unfilledColor="#cccc"
                                            borderColor="#cccc"
                                            borderRadius={25}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            paddingVertical: 10,
                                            marginHorizontal: 10,
                                        }}
                                    >
                                        {type === 'Organization' ||
                                        !type ? null : item.isJoin ? (
                                            <View
                                                style={{
                                                    backgroundColor: '#ccc',
                                                    borderRadius: 10,
                                                    padding: 5,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'black',
                                                    }}
                                                >
                                                    Đã tham gia
                                                </Text>
                                            </View>
                                        ) : item.isExprired ? (
                                            <View
                                                style={{
                                                    backgroundColor: '#cccc',
                                                    borderRadius: 10,
                                                    padding: 5,

                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'black',
                                                    }}
                                                >
                                                    Đã hết hạn
                                                </Text>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                style={{
                                                    backgroundColor:
                                                        COLORS.primary,
                                                    borderRadius: 10,
                                                    padding: 5,

                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() =>
                                                    viewDetailPost(item._id)
                                                }
                                            >
                                                <Text
                                                    style={{
                                                        ...FONTS.body5,
                                                        color: 'white',
                                                    }}
                                                >
                                                    Tham Gia
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        )
    }
    const RenderLoader = () => {
        return (
            <View>
                {isLoading ? (
                    <View
                        style={{
                            marginBottom: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(loading)}
                            style={{ width: 50, height: 50 }}
                        />
                    </View>
                ) : null}
            </View>
        )
    }
    const toastConfig = {
        warning: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FFE600',
                    backgroundColor: '#FFE600',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
                renderLeadingIcon={WarningToast}
            />
        ),
    }
    const WarningToast = () => {
        // Your component logic here

        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 12,
                }}
            >
                <Ionicons
                    name="alert-circle-outline"
                    size={35}
                    color={COLORS.black}
                />
            </View>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <TouchableOpacity
                style={{ position: 'absolute', right: 12, top: 55 }}
                onPress={() => navigation.navigate('Chat')}
            >
                <AntDesign name="message1" size={23} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity
                style={{ position: 'absolute', right: 48, top: 55 }}
                onPress={() => navigation.navigate('Chat')}
            >
                <Ionicons name="notifications-outline" size={26} color={COLORS.black} />
            </TouchableOpacity>
            <View
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 12,
                    width: '55%',
                    height: '23%',
                    zIndex: 333,
                }}
            >
                <MenuProvider skipInstanceCheck>
                    <Menu>
                        <MenuTrigger>
                            <Text
                                style={{
                                    ...FONTS.body2,
                                }}
                            >
                                Việc Tử Tế{' '}
                                <Feather
                                    name="chevron-down"
                                    size={30}
                                    color={COLORS.black}
                                    style={{
                                        marginTop: 10,
                                    }}
                                />
                            </Text>
                        </MenuTrigger>

                        <MenuOptions
                            customStyles={{
                                optionsContainer: {
                                    borderRadius: 10,
                                },
                            }}
                        >
                            {!type ? null : (
                                <View>
                                    <Follow
                                        text="Đang theo dõi"
                                        onSelect={getPostsFollow}
                                        iconName="users"
                                    />
                                    {/* <Divider />
                                    <Question
                                        text="Bài viết hết hạn"
                                        value="Mute"
                                        iconName="alert-circle"
                                    /> */}
                                </View>
                            )}
                        </MenuOptions>
                    </Menu>
                </MenuProvider>
            </View>
            <View
                style={{
                    zIndex: 2,
                }}
            >
                <Toast config={toastConfig} />
            </View>
            <View
                style={{ flex: 1, zIndex: 1, marginTop: 50, marginBottom: 20 }}
            >
                <Post
                    posts={posts}
                    fetchNextPage={fetchNextPage}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    headers={<RenderSuggestionsContainer />}
                    footer={RenderLoader}
                />
            </View>
        </SafeAreaView>
    )
}
const headerStyle = {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 0,
    zIndex: 2,
}
export default Feed
