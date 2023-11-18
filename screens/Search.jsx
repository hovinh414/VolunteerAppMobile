import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    RefreshControl,
    TextInput,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Progress from 'react-native-progress'
import { COLORS, FONTS, SIZES, images } from '../constants'
import {
    Feather,
    AntDesign,
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import CustomViewInfo from '../components/CustomViewInfo'
import ImageAvata from '../assets/hero2.jpg'
import { Image } from 'expo-image'
import AsyncStoraged from '../services/AsyncStoraged'
import axios from 'axios'
import API_URL from '../interfaces/config'
import { useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
const search = '../assets/search.png'
const loading = '../assets/loading.gif'
const AccountSearch = () => {
    return (
        <View>
            <View style={{ marginTop: 25 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    Tìm kiếm gần đây
                </Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={{
                        marginTop: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 210,
                        height: 210,
                        backgroundColor: '#F0F0F0',
                        borderRadius: 105,
                    }}
                >
                    <Image
                        source={require(search)}
                        style={{ width: 180, height: 180 }}
                    />
                </View>
            </View>
            <View
                style={{
                    marginTop: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontSize: 15, color: '#696969' }}>
                    Không có tìm kiếm nào gần đây
                </Text>
            </View>
        </View>
    )
}

const PostSearch = ({ navigation }) => {
    const labels = [
        { id: '1', text: 'Người mù quáng trong tình yêu' },
        { id: '2', text: 'Trẻ em' },
        { id: '3', text: 'Người khuyết tật' },
        { id: '4', text: 'Người già' },
        { id: '5', text: 'Người nghèo' },
        { id: '6', text: 'Bệnh hiểm nghèo' },
        { id: '7', text: 'Thiên tai' },
        { id: '8', text: 'Giáo dục' },
        { id: '9', text: 'Cứu trợ khẩn cấp' },
    ]
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
    const [isLoading, setIsLoading] = useState(false)

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
            setIsLoading(true)
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
                setIsLoading(false)

                console.log('API Error:', error)
                return
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

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                backgroundColor: '#F0F0F0',
                padding: 10,
                borderRadius: 15,
                marginRight: 10,
                marginTop: 25,
            }}
        >
            <Text>{item.text}</Text>
        </TouchableOpacity>
    )
    return (
        <View>
            {/* Sử dụng FlatList để hiển thị danh sách */}
            <View style={{marginBottom:10}}>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={labels}
                    horizontal={true}
                    renderItem={renderItem}
                />
            </View>
            <FlatList
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.4}
                showsVerticalScrollIndicator={false}
                data={posts}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListFooterComponent={RenderLoader}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={0.8}
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
                                    backgroundColor: '#EE6457',
                                    borderBottomRightRadius: 5,
                                    borderTopRightRadius: 5,
                                    width: 55,
                                    height: 24,
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
        </View>
    )
}

const renderScene = SceneMap({
    first: AccountSearch,
    second: PostSearch,
})
const Search = ({ navigation, route }) => {
    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Tài khoản', icon: 'home' },
        { key: 'second', title: 'Hoạt động', icon: 'user' },
    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            style={{
                backgroundColor: '#fff',
            }}
            renderLabel={({ focused, route }) => (
                <Text
                    style={[
                        {
                            color: focused ? COLORS.primary : 'gray',
                            fontSize: 15,
                            fontWeight: 'bold',
                        },
                    ]}
                >
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
            <View style={{ padding: 12 }}>
                <View
                    style={{
                        width: '100%',
                        position: 'relative',
                        height: 50,
                    }}
                >
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
                                height: 40,
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flex: 1,
                        marginHorizontal: 12,
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

export default Search
