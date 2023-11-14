import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    SafeAreaView,
    TextInput, // Import TextInput
} from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import { COLORS, FONTS } from '../../constants'
import AsyncStoraged from '../../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../../interfaces/config'
import * as Progress from 'react-native-progress'
import { Image } from 'expo-image'
function FeaturedArticle({ navigation }) {
    const screenWidth = Dimensions.get('window').width

    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState(null)
    const [type, setType] = useState(null)
    const [typePost, setTypePost] = useState('normal')
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshing, setRefreshing] = useState(false)
    const [showSearchInput, setShowSearchInput] = useState(false)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefreshPost()
        })

        return unsubscribe
    }, [navigation])

    useEffect(() => {
        getToken()
    }, [])

    useEffect(() => {
        getUserStored()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

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

    const onRefreshPost = () => {
        setCurrentPage(1)
        setPosts([])
        getPosts()
    }

    const calculateDaysDifference = (exprirationDate) => {
        const currentDate = new Date()
        const targetDate = new Date(exprirationDate)
        const timeDifference = targetDate - currentDate
        const daysDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24)
        )
        return daysDifference
    }

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

    const onRefresh = () => {
        setRefreshing(true)
        setCurrentPage(1)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }

    const fetchNextPage = async () => {
        if (!isFetchingNextPage) {
            setIsFetchingNextPage(true)
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            }

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts?page=${currentPage + 1}&limit=6`,
                    config
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

    const toggleSearchInput = () => {
        setShowSearchInput(!showSearchInput)
    }

    return (
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={{
                flex: 1,
                backgroundColor: '#fff',
                paddingHorizontal: 13,
                paddingTop: 55,
                paddingBottom: 30,
            }}
            behavior="height"
            enabled
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 7,
                    justifyContent: 'space-between',
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical:7,
                    }}
                    onPress={() => {
                        showSearchInput
                            ? setShowSearchInput(false)
                            : navigation.goBack()
                    }}
                >
                    {showSearchInput ? (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    ) : (
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={30}
                            color={COLORS.black}
                        />
                    )}
                    {showSearchInput ? null : (
                        <Text
                            style={{
                                ...FONTS.body5,
                                fontSize: 16,
                                marginLeft: 10,
                            }}
                        >
                            Chiến dịch nổi bật
                        </Text>
                    )}
                </TouchableOpacity>

                {showSearchInput ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10,
                            borderColor: '#cccc',
                            borderWidth: 1,
                            marginLeft: 15,
                            marginRight: 8,
                            flex: 1,
                            padding: 7,
                            alignItems: 'center',
                        }}
                    >
                        <MaterialIcons
                            name="search"
                            size={30}
                            color={'#cccc'}
                            style={{ paddingLeft: 10, borderRadius: 30 }}
                        />
                        <TextInput
                            placeholder="Nhập từ khóa tìm kiếm"
                            style={{
                                marginLeft: 10,
                            }}
                            // Xử lý sự kiện nhập liệu, tìm kiếm, vv.
                        />
                    </View>
                ) : (
                    <MaterialIcons
                        name="search"
                        size={30}
                        color={COLORS.black}
                        style={{ marginRight: 8, borderRadius: 30 }}
                        onPress={toggleSearchInput}
                    />
                )}
            </View>
            <FlatList
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.4}
                data={posts}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => viewDetailPost(item._id)}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#F0F0F0',
                                width: screenWidth - 25,
                                height: 130,
                                marginHorizontal: 12,
                                marginTop: 15,
                                justifyContent: 'flex-start',
                                borderRadius: 15,
                                padding: 10,
                            }}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    zIndex: 3,
                                    top: 30,
                                    backgroundColor: COLORS.primary,
                                    borderBottomRightRadius: 5,
                                    borderTopRightRadius: 5,
                                    width: 55,
                                    height: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {calculateDaysDifference(
                                        item.exprirationDate
                                    )}{' '}
                                    ngày
                                </Text>
                            </View>
                            <Image
                                source={item.media}
                                style={{
                                    width: 110,
                                    height: 110,
                                    borderRadius: 15,
                                }}
                            />
                            <View
                                style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: 12,
                                }}
                            >
                                <Text
                                    style={{
                                        marginTop: 15,
                                        ...FONTS.body5,
                                    }}
                                >
                                    {item.content.length > 22
                                        ? `${item.content.slice(0, 22)}...`
                                        : item.content}
                                </Text>
                                <Text
                                    style={{
                                        marginTop: 15,
                                        fontSize: 13,
                                    }}
                                >
                                    Tạo bởi{' '}
                                    <Text
                                        style={{
                                            marginLeft: 12,
                                            marginTop: 15,
                                            fontWeight: '700',
                                            color: COLORS.primary,
                                        }}
                                    >
                                        {item.ownerDisplayname}
                                    </Text>
                                </Text>
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 12,
                                    }}
                                >
                                    <Progress.Bar
                                        progress={
                                            item.totalUserJoin /
                                            item.participants
                                        }
                                        color="#FF493C"
                                        height={8}
                                        width={screenWidth - 167}
                                        unfilledColor="#cccc"
                                        borderColor="#cccc"
                                        borderRadius={25}
                                    />
                                </View>
                                <View
                                    style={{
                                        marginTop: 8,
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
                                                fontSize: 14,
                                                marginLeft: 5,
                                            }}
                                        >
                                            Đã tham gia:{' '}
                                            <Text
                                                style={{
                                                    color: COLORS.primary,
                                                    fontSize: 14,
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
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                fontSize: 14,
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
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </KeyboardAvoidingView>
    )
}

export default FeaturedArticle
