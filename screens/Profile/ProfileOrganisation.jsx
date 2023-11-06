import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    TextInput,
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
import * as ImagePicker from 'expo-image-picker'
import ImageAvata from '../../assets/hero2.jpg'
import ImageUpload from '../../assets/add-image.png'
import axios from 'axios'
import CustomButton from '../../components/CustomButton'
import CustomAlert from '../../components/CustomAlert'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image'


const share = '../../assets/share.png'
const PostsRoute = () => {
    const [orgId, setOrgId] = useState()
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setOrgId(userStored._id)
    }
    useEffect(() => {
        getUserStored()
    }, [])
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
    function DaysDifference({ exprirationDate }) {
        const [daysDifference, setDaysDifference] = useState(null)

        useEffect(() => {
            const currentDate = new Date()
            const targetDate = new Date(exprirationDate)
            const timeDifference = targetDate - currentDate
            const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
            )
            setDaysDifference(daysDifference)
        }, [exprirationDate])

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
            .get(API_URL.API_URL + '/posts/' + orgId + '?page=1&limit=4')
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
    }, [orgId]) // Ensure that orgId is updated as expected

    const [refreshing, setRefreshing] = useState(false)
    const onRefresh = () => {
        setRefreshing(true)
        getPosts().then(() => {
            setRefreshing(false)
        })
    }
    const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const fetchNextPage = async () => {
        if (!isFetchingNextPage && currentPage < 10) {
            setIsFetchingNextPage(true)

            try {
                const response = await axios.get(
                    `${API_URL.API_URL}/posts/` +
                        orgId +
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
    return (
        <View
            style={{
                flex: 1,
                paddingTop: 12,
            }}
        >
            <FlatList
                data={posts}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.1}
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
        </View>
    )
}
const success = '../../assets/success.png'
const fail = '../../assets/cross.png'
const warning = '../../assets/warning.png'
const VerifyRoute = ({ navigation }) => {
    const [selectedImages, setSelectedImage] = useState([])
    const [avatar, setAvatar] = useState()

    const [token, setToken] = useState()
    const [ButtonPress, setButtonPress] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const [mess, setMess] = useState()
    const [icon, setIcon] = useState()
    const [orgId, setOrgId] = useState()
    const [isActive, setIsActive] = useState(false)
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setOrgId(userStored._id)
        setIsActive(userStored.isActiveOrganization)
    }
    useEffect(() => {
        getUserStored()
    }, [])

    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        if (!result.canceled) {
            if (selectedImages.length + result.assets.length > 5) {
                setIcon()
                setMess('Số lượng ảnh phải ít hơn 5 ảnh')
                setShowWarning(true)

                return
            } else if (selectedImages.length === 0) {
                setSelectedImage(result.assets)
            } else if (selectedImages.length + result.assets.length <= 5) {
                setSelectedImage([...selectedImages, ...result.assets])
            }
        }
    }
    function removeImage(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
    }
    const formData = new FormData()
    const handleUpload = async () => {
        selectedImages.forEach((images, index) => {
            formData.append('images', {
                uri: images.uri,
                type: 'image/jpeg',
                name: images.fileName,
            })
        })
        console.log(formData)
        setButtonPress(true)
        if (selectedImages.length === 0) {
            setMess('Vui lòng chọn ảnh!')
            setIcon()
            setShowWarning(true)
            setButtonPress(false)
            return
        }

        axios
            .put(API_URL.API_URL + '/org/verify?orgId=' + orgId, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token,
                },
            })
            .then((response) => {
                if (response.data.status === 'SUCCESS') {
                    setMess('Đăng minh chứng thành công!')
                    setIcon(response.data.status)
                    setShowWarning(true)
                    setSelectedImage([])
                    setButtonPress(false)
                    setAvatar(null)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
                setMess('Đăng minh chứng thất bại!')
                setIcon('FAIL')
                setShowWarning(true)
                setButtonPress(false)
            })
    }

    return (
        <ScrollView style={{ flex: 1, paddingTop: 25, marginHorizontal: 22 }}>
            <CustomAlert
                visible={showWarning}
                mess={mess}
                onRequestClose={() => setShowWarning(false)}
                onPress={() => setShowWarning(false)}
                title={'ĐÓNG'}
                icon={icon}
            />
            <FlatList
                data={selectedImages}
                horizontal={true}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            position: 'relative',
                            flexDirection: 'column',
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: item.uri }}
                            style={{
                                paddingVertical: 4,
                                marginLeft: 12,
                                width: 140,
                                height: 140,
                                borderRadius: 12,
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => removeImage(item)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                backgroundColor: '#C5C7C7',
                                borderRadius: 12, // Bo tròn góc
                                padding: 5,
                            }}
                        >
                            <MaterialIcons
                                name="delete"
                                size={20}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
            <TouchableOpacity
                style={{
                    paddingTop: 25,
                    paddingBottom: 15,
                    flex: 1,
                    flexDirection: 'row',
                }}
                onPress={() => handleImageSelection()}
            >
                <Image
                    source={avatar ? { uri: avatar } : ImageUpload}
                    style={{
                        height: 110,
                        width: 110,
                        marginRight: 15,
                    }}
                />
                <View
                    style={{
                        backgroundColor: '#C5C7C7',
                        flex: 1,
                        padding: 10,
                        borderRadius: 5,
                    }}
                >
                    <Text
                        style={{
                            fontStyle: 'italic',
                            fontSize: 17,
                            backgroundColor: 'transparent',
                        }}
                    >
                        Minh chứng bao gồm{' '}
                        <Text
                            style={{
                                fontStyle: 'italic',
                                color: '#8B0000',
                            }}
                        >
                            5 hình
                        </Text>
                        :{' '}
                    </Text>
                    <Text
                        style={{
                            fontStyle: 'italic',
                            backgroundColor: 'transparent',
                        }}
                    >
                        - 2 ảnh CCCD hoặc CMND.
                    </Text>
                    <Text
                        style={{
                            fontStyle: 'italic',
                            backgroundColor: 'transparent',
                        }}
                    >
                        - 3 ảnh chụp địa điểm tổ chức.
                    </Text>
                    <Text
                        style={{
                            fontStyle: 'italic',
                            color: '#8B0000',
                            backgroundColor: 'transparent',
                        }}
                    >
                        * (Ảnh chụp phải rõ nét, ảnh CCCD là hình gốc không scan
                        hay photocopy, không bị mất góc)
                    </Text>
                </View>
            </TouchableOpacity>
            <CustomButton
                onPress={() => handleUpload()}
                title="ĐĂNG MINH CHỨNG"
                isLoading={ButtonPress}
            />
        </ScrollView>
    )
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: VerifyRoute,
})
const ProfileOrganisation = ({ navigation }) => {
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [routes, setRoute] = useState([])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setAddress(userStored.address)
        setEmail(userStored.email)
        setIsActive(userStored.isActiveOrganization)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    function renderProfileCard() {
        return (
            <View
                style={{
                    width: SIZES.width - 44,
                    height: 200,
                    marginHorizontal: 22,
                    paddingHorizontal: 6,
                    paddingVertical: 18,
                    backgroundColor: '#FFFFFF',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Profile image container */}
                    <View>
                        <Image
                            source={avatar ? { uri: avatar } : ImageAvata}
                            contentFit="contain"
                            style={{
                                height: 90,
                                width: 90,
                                borderRadius: 80,
                                borderWidth: 4,
                                borderColor: '#ffffff',
                            }}
                        />
                    </View>

                    <View
                        style={{
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                ...FONTS.body3,
                                fontSize: 16,
                            }}
                        >
                            {fullname}
                        </Text>

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: '#FFF9E8',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 15,
                                }}
                            >
                                <Text style={{ ...FONTS.body4 }}>
                                    Đã tổ chức 24 hoạt động
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Feather
                        style={{
                            paddingLeft: 10,
                        }}
                        name="menu"
                        size={24}
                        color={COLORS.black}
                        onPress={() => navigation.navigate('Settings')}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'column',
                        marginVertical: 12,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body4 }}>Email: </Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.blue }}>
                            @{email}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body4 }}>Địa chỉ: </Text>
                        <Text
                            style={{
                                ...FONTS.body4,
                                color: COLORS.blue,
                                paddingRight: 100,
                            }}
                        >
                            {address}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    useEffect(() => {
        if (!isActive) {
            setRoute([
                { key: 'first', title: 'Hoạt động', icon: 'team' },
                { key: 'second', title: 'Đăng minh chứng', icon: 'upload' },
            ])
        } else {
            setRoute([{ key: 'first', title: 'Hoạt động', icon: 'team' }])
        }
    }, [isActive])

    const renderTabBar = (props) => {
        return routes.length === 1 ? null : (
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
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View style={{ flex: 1 }}>
                {renderProfileCard()}
                <View
                    style={{
                        flex: 1,
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

export default ProfileOrganisation
