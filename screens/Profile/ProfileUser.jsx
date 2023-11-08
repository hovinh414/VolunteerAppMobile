import {
    View,
    Text,
    useWindowDimensions,
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
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { SliderBox } from 'react-native-image-slider-box'
import * as Progress from 'react-native-progress'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import LongText from '../Feed/LongText'
import DaysDifference from '../Feed/DaysDifference'

const share = '../../assets/share.png'
const cover = '../../assets/cover.jpg'

const ProfileUser = ({ route }) => {
    const items = route.params
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    function LikeButton({ postId, likePost, unLikePost, onLikeUnlike }) {
        const [isLiked, setIsLiked] = useState(false)
        const [totalLike, setTotalLike] = useState(0)
        const checkLikes = async () => {
            try {
                const res = await axios({
                    method: 'get',
                    url: API_URL.API_URL + '/post/like/' + postId,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                })

                if (res.data.message === 'User not like this post before') {
                    setIsLiked(false)
                } else {
                    setIsLiked(true)
                }
            } catch (error) {
                console.log(error)
                setIsLiked(false)
            }
        }

        useEffect(() => {
            checkLikes()
        }, [])
        const fetchLikes = async () => {
            try {
                const response = await axios.get(
                    API_URL.API_URL + '/post/likes/' + postId
                )

                if (response.data.status === 'SUCCESS') {
                    setTotalLike(response.data.data.totalLikes)
                }
            } catch (error) {
                console.log('API Error:', error)
            }
        }

        useEffect(() => {
            fetchLikes()
        }, [])
        const handleLikeClick = async () => {
            try {
                if (isLiked) {
                    await unLikePost(postId)
                    setIsLiked(false)
                } else {
                    await likePost(postId)
                    setIsLiked(true)
                }

                fetchLikes() // Gọi hàm này sau khi thực hiện like/unlike thành công
            } catch (error) {
                console.log(error)
            }
        }

        if (token !== null) {
            return (
                <View
                    style={{
                        flexDirection: 'row',

                        alignItems: 'center',
                        marginRight: SIZES.padding2,
                    }}
                >
                    <TouchableOpacity onPress={handleLikeClick}>
                        {isLiked ? (
                            <FontAwesome
                                name="heart"
                                size={20}
                                color={COLORS.primary}
                            />
                        ) : (
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.black}
                            />
                        )}
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.body4, marginLeft: 5 }}>
                        {totalLike}
                    </Text>
                </View>
            )
        } else {
            return (
                <View
                    style={{
                        flexDirection: 'row',

                        alignItems: 'center',
                        marginRight: SIZES.padding2,
                    }}
                >
                    <TouchableOpacity>
                        <Feather name="heart" size={20} color={COLORS.black} />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.body4, marginLeft: 5 }}>
                        {totalLike}
                    </Text>
                </View>
            )
        }
    }

    const likePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/post/like',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const unLikePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/post/unlike',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const getPosts = async () => {
        axios
            .get(API_URL.API_URL + '/posts/' + items._id + '?page=1&limit=4')
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
    }, [items._id]) // Ensure that orgId is updated as expected

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    console.log(currentPage)
    const fetchNextPage = async () => {
        if (!isFetchingNextPage && currentPage < 10) {
            setIsFetchingNextPage(true)

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts/` +
                        items._id +
                        `?page=${currentPage + 1}&limit=4`
                )
                if (response.data.status === 'SUCCESS') {
                    setPosts([...posts, ...response.data.data])
                    setCurrentPage(currentPage + 1)
                } else {
                    setPosts([...posts, ...response.data.data])
                }
            } catch (error) {
                console.log('API Error:', error)
            } finally {
                setIsFetchingNextPage(false)
            }
        }
    }
    const navigation = useNavigation()
    const viewDetailPost = async (_postId) => {
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + _postId
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate('DetailPost', response.data.data)
            }
        } catch (error) {
            console.log('API Error:', error)
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
                    contentFit="cover"
                    style={{
                        height: 228,
                        width: '100%',
                    }}
                />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        position: 'absolute',
                        top: 15,
                        left: 12,
                        zIndex: 1,
                        borderRadius: 20,
                        backgroundColor: '#cccc',
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={26}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
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
                            {items.address}
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
            <FlatList
                data={posts}
                onEndReached={fetchNextPage}
                ListHeaderComponent={<RenderProfileCard />}
                onEndReachedThreshold={0.4}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: '#fff',
                            flexDirection: 'column',
                            width: '100%',
                            borderWidth: 1,
                            borderTopColor: '#FDF6ED',
                            borderColor: '#fff',
                        }}
                    >
                        {/* Post header */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 12,
                                paddingBottom: 10,
                            }}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 8,
                                }}
                            >
                                <Image
                                    source={item.ownerAvatar}
                                    style={{
                                        height: 52,
                                        width: 52,
                                        borderRadius: 20,
                                    }}
                                />

                                <View style={{ marginLeft: 12 }}>
                                    <Text
                                        style={{
                                            ...FONTS.body5,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {item.ownerDisplayname}
                                    </Text>
                                </View>
                            </View>

                            <MaterialCommunityIcons
                                name="dots-vertical"
                                size={24}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                        <View>
                            <SliderBox
                                images={item.media}
                                paginationBoxVerticalPadding={5}
                                activeOpacity={1}
                                dotColor={COLORS.primary}
                                inactiveDotColor={COLORS.white}
                                sliderBoxHeight={500}
                                dotStyle={{ width: 7, height: 7 }}
                            />
                            {/* <FlatList
                                    data={item}
                                    horizontal
                                    renderItem={({ item, index }) => (
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                marginVertical: 8,
                                            }}
                                            key={index}
                                        >
                                            <Image
                                                source={item.media}
                                                style={{
                                                    height: 450,
                                                    width: 450,
                                                    marginRight: 10,
                                                }}
                                            />
                                        </View>
                                    )}
                                /> */}
                        </View>

                        <View
                            style={{
                                marginHorizontal: 8,
                                marginVertical: 8,
                            }}
                        >
                            <LongText maxLength={150} content={item.content} />
                        </View>
                        <TouchableOpacity
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    paddingLeft: 10,
                                    paddingBottom: 5,
                                }}
                            >
                                <Progress.Bar
                                    progress={36 / 100}
                                    color="#FF493C"
                                    height={8}
                                    width={SIZES.width - 20}
                                    unfilledColor="#F5F5F5"
                                    borderColor="#F5F5F5"
                                    borderRadius={25}
                                />
                            </View>
                            <View
                                style={{
                                    margin: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="location-outline"
                                    size={22}
                                    color={COLORS.primary}
                                />
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontFamily: 'regular',
                                        color: COLORS.primary,
                                        marginLeft: 4,
                                        marginRight: 10,
                                    }}
                                >
                                    {item.address}
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 8,
                                    marginBottom: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={21}
                                    color={COLORS.blue}
                                />
                                <DaysDifference
                                    exprirationDate={item.exprirationDate}
                                />
                            </View>
                        </TouchableOpacity>

                        {/* Posts likes and comments */}

                        <View
                            style={{
                                marginHorizontal: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                paddingBottom: 6,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <LikeButton
                                    postId={item._id}
                                    unLikePost={unLikePost}
                                    likePost={likePost}
                                />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginRight: SIZES.padding2,
                                        alignItems: 'center',
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name="message-text-outline"
                                        size={20}
                                        color={COLORS.black}
                                    />
                                    <Text
                                        style={{
                                            ...FONTS.body4,
                                            marginLeft: 2,
                                        }}
                                    >
                                        03
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',

                                        alignItems: 'center',
                                    }}
                                >
                                    <Image
                                        source={require(share)}
                                        style={{
                                            width: 20,
                                            height: 20,
                                        }}
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 10,
                                        padding: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                        }}
                                    >
                                        Tham Gia
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default ProfileUser
