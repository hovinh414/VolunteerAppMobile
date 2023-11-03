import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
} from 'react-native'
import * as Progress from 'react-native-progress'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../constants'
import {
    MaterialIcons,
    Ionicons,
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { friends, posts } from '../constants/data'
import { SliderBox } from 'react-native-image-slider-box'
import axios from 'axios'
import API_URL from '../interfaces/config'
import { Image } from 'expo-image'
import AsyncStoraged from '../services/AsyncStoraged'
import { useFocusEffect } from '@react-navigation/native'

const post1 = [
    images.friend1,
    images.friend2,
    images.friend3,
    images.friend4,
    images.friend5,
]
const post2 = [
    images.user1,
    images.user2,
    images.user3,
    images.user4,
    images.user5,
]
const post3 = [
    images.post1,
    images.post2,
    images.post3,
    images.post4,
    images.post5,
]
const Feed = ({ navigation }) => {
    function renderHeader() {
        return (
            <View
                style={{
                    padding: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.body2,
                            marginRight: 4,
                        }}
                    >
                        Việc Tử Tế
                    </Text>
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={24}
                        color={COLORS.black}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            shadowColor: '#18274B',
                            shadowOffset: {
                                width: 0,
                                height: 4.5,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 6.5,
                            elevation: 2,
                            borderRadius: 22,
                        }}
                    >
                        <Ionicons
                            name="filter"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chat')}
                    >
                        <LinearGradient
                            colors={['#D4145A', '#FBB03B']}
                            style={{
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#18274B',
                                shadowOffset: {
                                    width: 0,
                                    height: 4.5,
                                },
                                shadowOpacity: 0.12,
                                shadowRadius: 6.5,
                                elevation: 2,
                                borderRadius: 22,
                                marginLeft: 12,
                            }}
                        >
                            <Feather
                                name="message-circle"
                                size={30}
                                color={COLORS.white}
                            />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    function LikeButton({ postId, likePost, unLikePost, onLikeUnlike }) {
        const [isLiked, setIsLiked] = useState(false)
        const [totalLike, setTotalLike] = useState(0)
        const checkLikes = async () => {
            try {
                const res = await axios({
                    method: 'get',
                    url: API_URL.API_URL + '/post/like?postId=' + postId,
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
                console.error('API Error:', error)
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
    function DaysDifference({ createdAt }) {
        const [daysDifference, setDaysDifference] = useState(null)

        useEffect(() => {
            const currentDate = new Date()
            const targetDate = new Date(createdAt)
            const timeDifference = targetDate - currentDate
            const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
            )
            setDaysDifference(daysDifference)
        }, [createdAt])

        if (daysDifference === null) {
            return null // Hoặc thay thế bằng UI mặc định khác nếu cần
        }
        if (daysDifference <= 0) {
            return (
                <Text
                    style={{
                        fontSize: 14,
                        fontFamily: 'regular',
                        color: COLORS.blue,
                        marginLeft: 4,
                    }}
                >
                    Đã hết hạn đăng ký
                </Text>
            )
        } else {
            return (
                <Text
                    style={{
                        fontSize: 14,
                        fontFamily: 'regular',
                        color: COLORS.blue,
                        marginLeft: 4,
                    }}
                >
                    Còn lại: {daysDifference} ngày
                </Text>
            )
        }
    }

    function renderSuggestionsContainer() {
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
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View
                            key={item.id}
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
            </View>
        )
    }

    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const getPosts = async () => {
        axios
            .get(API_URL.API_URL + '/posts?page=1&limit=6')
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setPosts(response.data.data)
                }
            })
            .catch((error) => {
                console.error('API Error:', error)
            })
    }
    useEffect(() => {
        getPosts()
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            onRefresh() // Gọi hàm làm mới khi màn hình được focus
        }, [])
    )
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
    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 1 }}>
                {renderHeader()}
                {renderSuggestionsContainer()}
                <FlatList
                    data={posts}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => onRefresh()} // Định nghĩa hàm xử lý khi làm mới
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
                                marginVertical: 12,
                            }}
                        >
                            {/* Post header */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 12,
                                    paddingBottom: 10,
                                }}
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
                                                ...FONTS.body3,
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
                            </View>
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
                                <Text style={{ ...FONTS.body4 }}>
                                    {item.content}
                                </Text>
                            </View>
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
                                <DaysDifference createdAt={item.createdAt} />
                                {/* <Text
                                    style={{
                                        fontSize: 13,
                                        fontFamily: 'regular',
                                        color: COLORS.blue,
                                        marginLeft: 4,
                                    }}
                                >
                                    Còn lại: {item.address}
                                </Text> */}
                            </View>

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
                                </View>

                                <View style={{ flexDirection: 'row' }}>
                                    <View>
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Tham gia 36/100
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginLeft: 10,
                                        }}
                                    ></View>
                                </View>
                            </View>

                            {/* comment section */}

                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginHorizontal: 8,
                                    paddingVertical: 18,
                                    borderTopWidth: 1,
                                    borderTopColor: '#FFF',
                                }}
                            >
                                <Image
                                    source={images.user2}
                                    contentFit="contain"
                                    style={{
                                        height: 52,
                                        width: 52,
                                        borderRadius: 26,
                                    }}
                                />

                                <View
                                    style={{
                                        flex: 1,
                                        height: 52,
                                        borderRadius: 26,
                                        borderWidth: 1,
                                        borderColor: '#CCC',
                                        marginLeft: 12,
                                        paddingLeft: 12,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <TextInput
                                        placeholder="Thêm bình luận"
                                        placeholderTextColor="#CCC"
                                    />
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

export default Feed
