import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
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
import ImageUpload from '../../assets/add-image.png'
import axios from 'axios'
import CustomButton from '../../components/CustomButton'
import CustomButtonV2 from '../../components/CustomButtonV2'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

const share = '../../assets/share.png'
const cover = '../../assets/cover.jpg'
const question = '../../assets/question.png'
const PostsRoute = () => {
    const [orgId, setOrgId] = useState()
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [type, setType] = useState('')
    const [showWarning, setShowWarning] = useState(false)
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
        setType(userStored.type)
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
    const joinActivity = async (_activityId) => {
        try {
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/activity/' + _activityId,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            console.log(res.data.status)
            if (res.data.status === 'SUCCESS') {
                setShowWarning(false)
                onRefresh()
            }
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
    function LongText({ content, maxLength }) {
        const [isFullTextVisible, setIsFullTextVisible] = useState(false)

        // Hàm này được gọi khi người dùng bấm vào nút "Xem thêm" hoặc "Thu gọn"
        const toggleTextVisibility = () => {
            setIsFullTextVisible(!isFullTextVisible)
        }

        // Hiển thị nội dung đầy đủ hoặc ngắn gọn tùy thuộc vào trạng thái
        const displayText = isFullTextVisible
            ? content
            : content.slice(0, maxLength)

        return (
            <View>
                <Text style={{ fontSize: 16, textAlign: 'justify' }}>
                    {displayText}
                </Text>

                {content.length > maxLength && (
                    <TouchableOpacity onPress={toggleTextVisibility}>
                        <Text
                            style={{ fontWeight: '500', color: COLORS.primary }}
                        >
                            {isFullTextVisible ? '...Thu gọn' : '...Xem thêm'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }
    return (
        <View
            style={{
                flex: 1,
                paddingTop: 12,
            }}
        >
            <Modal
                visible={showWarning}
                animationType="fade"
                transparent
                onRequestClose={() => setShowWarning(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.75,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                >
                    <View
                        style={{
                            width: 300,
                            height: 200,
                            backgroundColor: '#ffffff',
                            borderRadius: 25,
                            alignItems: 'center', // Đảm bảo nội dung nằm ở giữa
                            justifyContent: 'center', //
                        }}
                    >
                        <Image
                            source={require(question)}
                            style={{
                                marginTop: 15,
                                width: 50,
                                height: 50,
                            }}
                        />
                        <Text
                            style={{
                                marginTop: 15,
                                fontWeight: 'bold',
                                fontSize: 18,
                            }}
                        >
                            Bạn có muốn tham gia hoạt động?
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 30,
                            }}
                        >
                            <View
                                style={{
                                    width: 80,
                                    marginRight: 15,
                                }}
                            >
                                <CustomButtonV2
                                    title="ĐÓNG"
                                    onPress={() => setShowWarning(false)}
                                />
                            </View>
                            <View
                                style={{
                                    width: 80,
                                }}
                            >
                                <CustomButton
                                    title="ĐỒNG Ý"
                                    onPress={() =>
                                        joinActivity(item.activityId)
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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
                                {type ===
                                'Organization' ? null : !item.isJoin ? (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                        onPress={() => setShowWarning(true)}
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
                                ) : (
                                    <View
                                        style={{
                                            backgroundColor: '#ccc',
                                            borderRadius: 10,
                                            padding: 5,
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
                                )}
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}
const VerifyRoute = ({ navigation }) => {
    const [selectedImages, setSelectedImage] = useState([])

    const [token, setToken] = useState()
    const [ButtonPress, setButtonPress] = useState('')
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
                Toast.show({
                    type: 'warning',
                    text1: 'Cảnh báo',
                    text2: 'Số lượng ảnh phải ít hơn 5!',
                    visibilityTime: 2500,
                })

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
            Toast.show({
                type: 'warning',
                text1: 'Cảnh báo',
                text2: 'Vui lòng chọn ảnh!',
                visibilityTime: 2500,
            })
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
                    Toast.show({
                        type: 'success',
                        text1: 'Thành công',
                        text2: 'Đăng minh chứng thành công!',
                        visibilityTime: 2500,
                    })
                    setSelectedImage([])
                    setButtonPress(false)
                }
            })
            .catch((error) => {
                console.log('API Error:', error)
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Thay đổi minh chứng thất bại!',
                    visibilityTime: 2500,
                })
                setButtonPress(false)
            })
    }

    return (
        <ScrollView style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ zIndex: 0, paddingBottom:50, }}>
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
                        source={ImageUpload}
                        style={{
                            height: 100,
                            width: 100,
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
                            * (Ảnh chụp phải rõ nét, ảnh CCCD là hình gốc không
                            scan hay photocopy, không bị mất góc)
                        </Text>
                    </View>
                </TouchableOpacity>
                <CustomButton
                    onPress={() => handleUpload()}
                    title="ĐĂNG MINH CHỨNG"
                    isLoading={ButtonPress}
                />
            </View>
        </ScrollView>
    )
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: VerifyRoute,
})
const ProfileOrganisation = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [routes, setRoute] = useState([])
    const [phone, setPhone] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setAddress(userStored.address)
        setEmail(userStored.email)
        setIsActive(userStored.isActiveOrganization)
        setPhone(userStored.phone)
    }
    useEffect(() => {
        getUserStored()
    }, [])

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
    const onRefresh = () => {
        getUserStored()
    }
    useFocusEffect(
        React.useCallback(() => {
            // Thực hiện các công việc cần thiết để làm mới màn hình ở đây (ví dụ, gọi hàm onRefresh).
            onRefresh()
        }, [route])
    )
    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: '#6dcf81' }}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
            />
        ),

        error: (props) => (
            <ErrorToast
                {...props}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
            />
        ),
        warning: (props) => (
            <BaseToast
                {...props}
                style={{ borderLeftColor: '#FFE600' }}
                text1Style={{
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#696969',
                }}
            />
        ),
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
                    zIndex: 2,
                }}
            >
                <Toast config={toastConfig} />
            </View>
            <View>
                <View
                    style={{
                        width: '100%',
                        position: 'relative',
                        height: '68%',
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
                        style={{
                            position: 'absolute',
                            top: 15,
                            right: 12,
                            zIndex: 1,
                        }}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Feather name="menu" size={28} color={COLORS.black} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', top: -67 }}>
                        <Image
                            source={avatar}
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
                            {fullname}
                        </Text>
                        {isActive ? (
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
                                    {address}
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
                                    {email}
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
                                    {phone}
                                </Text>
                            </View>
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
            </View>
            <View style={{ flex: 1 }}>
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
