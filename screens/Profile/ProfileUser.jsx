import {
    View,
    Text,
    ActivityIndicator,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
    FontAwesome,
} from '@expo/vector-icons'
import ModalAlert from '../../components/ModalAlert'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import Post from '../Feed/Post'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
const loading = '../../assets/loading.gif'
const cover = '../../assets/cover.jpg'
const ProfileUser = ({ route }) => {
    const items = route.params
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [showFilter, setShowFilter] = useState(false)
    const [totalFollows, setTotalFollow] = useState(items.followers)
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
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

    const [isFollow, setIsFollow] = useState(items.isFollow)
    function FollowButton({ handleFollow, handleUnFollow }) {
        const handleFollowCLick = async () => {
            try {
                if (isFollow) {
                    await handleUnFollow()
                } else {
                    await handleFollow()
                }
            } catch (error) {
                console.log(error)
            }
        }

        if (token !== null) {
            return (
                <View style={{ flexDirection: 'row', paddingTop: 15 }}>
                    <TouchableOpacity onPress={handleFollowCLick}>
                        {isFollow ? (
                            <View
                                style={{
                                    width: 124,
                                    height: 36,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#ccc',
                                    borderRadius: 15,
                                    marginHorizontal: 10,
                                }}
                            >
                                <Text
                                    style={{
                                        ...FONTS.body5,
                                        color: '#000',
                                    }}
                                >
                                    Đang theo dõi
                                </Text>
                            </View>
                        ) : (
                            <View
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
                            </View>
                        )}
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
            )
        }
    }
    const getPosts = async () => {
        const config = {
            headers: {
                Authorization: token,
            },
        }
        axios
            .get(
                API_URL.API_URL + '/posts/' + items._id + '?page=1&limit=4',
                config
            )
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setPosts(response.data.data)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
            })
    }
    useEffect(() => {
        getPosts()
    }, [token])

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const fetchNextPage = async () => {
        if (!isFetchingNextPage && currentPage < 10) {
            setIsLoading(true)
            setIsFetchingNextPage(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }
            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts/` +
                        items._id +
                        `?page=${currentPage + 1}&limit=4`,
                    config
                )
                if (response.data.status === 'SUCCESS') {
                    setPosts([...posts, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setPosts([...posts, ...response.data.data])
                }
            } catch (error) {
                setIsLoading(false)
                Toast.show({
                    type: 'warning',
                    text1: 'Chưa có bài viết mới!',
                    visibilityTime: 2500,
                })
                console.log('API Error:', error)
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }
    const navigation = useNavigation()
    const handleFollow = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/user/follow',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    followingId: items._id,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setTotalFollow(res.data.data.totalFollow)
                setIsFollow(true)
            }
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const handleUnFollow = async () => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/user/unfollow',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    followingId: items._id,
                },
            })
            console.log(res.data.status)
            if (res.data.status === 'SUCCESS') {
                setTotalFollow(res.data.data.totalFollow)
                setIsFollow(false)
            }
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const RenderProfileCard = () => {
        return (
            <View
                style={{
                    width: '100%',
                    position: 'relative',
                }}
            >
                <Image
                    source={require(cover)}
                    style={{
                        height: 228,
                        width: '100%',
                    }}
                />

                <View style={{ alignItems: 'center', top: -67 }}>
                    <Image
                        source={items.avatar}
                        contentFit="contain"
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
                        {items.fullname}
                    </Text>
                    {items.isActiveOrganization ? (
                        <Text
                            style={{
                                color: '#4EB09B',
                                ...FONTS.body5,
                            }}
                        >
                            Đã xác thực{' '}
                            <FontAwesome
                                name="check-circle"
                                size={15}
                                color={'#4EB09B'}
                            />
                        </Text>
                    ) : (
                        <Text
                            style={{
                                color: COLORS.black,
                                ...FONTS.body5,
                            }}
                        >
                            Chưa xác thực{' '}
                            <FontAwesome
                                name="times-circle"
                                size={15}
                                color={COLORS.black}
                            />
                        </Text>
                    )}

                    <View style={{ flexDirection: 'column' }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginVertical: 6,
                                marginHorizontal: 100,
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="location-outline"
                                size={22}
                                color="black"
                            />
                            <Text
                                style={{
                                    ...FONTS.body4,
                                    marginLeft: 4,
                                    textAlign: 'justify',
                                }}
                            >
                                {items.address}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginBottom: 6,
                                marginHorizontal: 100,
                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={20}
                                color="black"
                            />
                            <Text
                                style={{
                                    ...FONTS.body4,
                                    marginLeft: 4,
                                    textAlign: 'justify',
                                }}
                            >
                                {items.email}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginHorizontal: 100,
                                alignItems: 'center',
                            }}
                        >
                            <Feather name="phone" size={20} color="black" />
                            <Text
                                style={{
                                    ...FONTS.body4,
                                    marginLeft: 4,
                                    textAlign: 'justify',
                                }}
                            >
                                {items.phone}
                            </Text>
                        </View>
                    </View>
                    <FollowButton
                        handleFollow={handleFollow}
                        handleUnFollow={handleUnFollow}
                    />
                    <View
                        style={{
                            paddingTop: 8,
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
                                {totalFollows}
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
                                75
                            </Text>
                            <Text
                                style={{
                                    ...FONTS.body5,
                                    color: COLORS.black,
                                }}
                            >
                                Lượt ủng hộ
                            </Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems:'center',
                        justifyContent: 'space-between',
                        marginHorizontal: 12,
                    }}
                >
                    <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 19,
                            fontWeight:'800'
                        }}
                    >
                        Bài viết
                    </Text>
                    <TouchableOpacity
                    onPress={() => setShowFilter(true)}
                    >
                        <Text
                            style={{
                                color: COLORS.primary,

                                fontSize: 16,
                            }}
                        >
                            Bộ lọc
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    const [type, setType] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])
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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View
                style={{
                    zIndex: 4,
                }}
            >
                <Toast config={toastConfig} />
            </View>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    position: 'absolute',
                    top: 60,
                    left: 12,
                    zIndex: 1,
                    borderRadius: 20,
                    backgroundColor: '#cccc',
                    zIndex: 3,
                }}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={26}
                    color={COLORS.black}
                />
            </TouchableOpacity>
            <ModalAlert visible={showFilter} onRequestClose={() => setShowFilter(false)}/>
            <Post
                posts={posts}
                fetchNextPage={fetchNextPage}
                refreshing={refreshing}
                onRefresh={onRefresh}
                headers={<RenderProfileCard />}
                footer={RenderLoader}
            />
        </SafeAreaView>
    )
}

export default ProfileUser
