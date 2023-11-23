import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
    Linking,
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
import ImageAvata from '../../assets/hero2.jpg'
import CustomButton from '../../components/CustomButton'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image'
import { useNavigation } from '@react-navigation/native'
import CustomViewInfo from '../../components/CustomViewInfo'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import Post from '../Feed/Post'
const loading = '../../assets/loading.gif'
const cover = '../../assets/cover.jpg'
const PostsRoute = () => {
    const [orgId, setOrgId] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [token, setToken] = useState('')
    const [type, setType] = useState('')
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
    const RenderLoader = () => {
        return (
            <View>
                {isLoading ? (
                    <View
                        style={{
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
    return (
        <View
            style={{
                flex: 1,
                paddingTop: 12,
            }}
        >
            <Post
                posts={posts}
                fetchNextPage={fetchNextPage}
                refreshing={refreshing}
                onRefresh={onRefresh}
                footer={RenderLoader}
            />
        </View>
    )
}
const VerifyRoute = ({ navigation }) => {
    const [selectedImages, setSelectedImage] = useState([])

    const [token, setToken] = useState()
    const [ButtonPress, setButtonPress] = useState('')
    const [orgId, setOrgId] = useState()
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setOrgId(userStored._id)
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
            <View style={{ zIndex: 0, paddingBottom: 50 }}>
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

const InfoRoute = ({ navigation }) => {
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAddress(userStored.address)
        setEmail(userStored.email)
        setPhone(userStored.phone)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const handleMap = () => {
        const mapAddress = encodeURIComponent(address)
        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`
        Linking.openURL(googleMapsUrl)
    }
    const handlePhone = () => {
        const phoneUrl = `tel:${phone}`
        Linking.openURL(phoneUrl)
    }
    const handleEmail = () => {
        const emailUrl = `mailto:${email}`;
        Linking.openURL(emailUrl);
      };
    return (
        <ScrollView style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleMap}
                    value={address}
                    icon={'location-outline'}
                    height={70}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handleEmail}
                    value={email}
                    icon={'mail-outline'}
                    height={48}
                />
            </View>
            <View style={{ paddingTop: 20 }}>
                <CustomViewInfo
                    onPress={handlePhone}
                    value={phone}
                    icon={'call-outline'}
                    height={48}
                />
            </View>
        </ScrollView>
    )
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: VerifyRoute,
    third: InfoRoute,
})
const ProfileOrganisation = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [isActive, setIsActive] = useState(false)
    const [follower, setFollower] = useState('')
    const [routes, setRoute] = useState([])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setIsActive(userStored.isActiveOrganization)
        setFollower(userStored.follower)
    }
    const getUserStoredEdit = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    useEffect(() => {
        if (!isActive) {
            setRoute([
                { key: 'first', title: 'Hoạt động', icon: 'home' },
                { key: 'second', title: 'Đăng minh chứng', icon: 'upload' },
            ])
        } else {
            setRoute([
                { key: 'first', title: 'Hoạt động', icon: 'home' },
                { key: 'third', title: 'Thông tin', icon: 'user' },
            ])
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
        getUserStoredEdit()
    }
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            onRefresh()
        })

        return unsubscribe
    }, [navigation])
    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                }}
                text1Style={{
                    color: '#fff',
                    fontSize: 18,
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={SuccessToast}
            />
        ),

        error: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#FF0035',
                    backgroundColor: '#FF0035',
                    borderRadius: 12,
                }}
                text1Style={{
                    fontSize: 18,
                    color: '#fff',
                }}
                text2Style={{
                    fontSize: 16,
                    color: '#fff',
                }}
                renderLeadingIcon={ErrorToast}
            />
        ),
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
    const SuccessToast = () => {
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
                    name="checkmark-circle-outline"
                    size={35}
                    color={'#fff'}
                />
            </View>
        )
    }
    const ErrorToast = () => {
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
                    name="close-circle-outline"
                    size={35}
                    color={'#fff'}
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
            <View>
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
                            height: 'auto',
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
                            style={{
                                position: 'absolute',
                                top: 15,
                                right: 12,
                                zIndex: 1,
                            }}
                            onPress={() => navigation.navigate('Settings')}
                        >
                            <Feather
                                name="menu"
                                size={28}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', top: -67 }}>
                            <Image
                                source={avatar ? { uri: avatar } : ImageAvata}
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

                            <View
                                style={{ flexDirection: 'row', paddingTop: 15 }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width: 160,
                                        height: 36,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: COLORS.primary,
                                        borderRadius: 15,
                                        marginHorizontal: 10,
                                    }}
                                    onPress={() =>
                                        navigation.navigate('EditProfile')
                                    }
                                >
                                    <Text
                                        style={{
                                            ...FONTS.body5,
                                            color: '#fff',
                                        }}
                                    >
                                        Chỉnh sửa thông tin
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
                                        {follower}
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
            </View>
            <View style={{ flex: 1, top: -67 }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </SafeAreaView>
    )
}

export default ProfileOrganisation
