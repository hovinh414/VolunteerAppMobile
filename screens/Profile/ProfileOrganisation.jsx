import {
    View,
    Text,
    useWindowDimensions,
    FlatList,
    ScrollView,
    TouchableOpacity,
    Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { Feather, AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { posts } from '../../constants/data'
import AsyncStoraged from '../../services/AsyncStoraged'
import * as ImagePicker from 'expo-image-picker'
import ImageAvata from '../../assets/hero2.jpg'
import ImageUpload from '../../assets/add-image.png'
import axios from 'axios'
import CustomButton from '../../components/CustomButton'
import CustomAlert from '../../components/CustomAlert'
import API_URL from '../../interfaces/config'
import { Image } from 'expo-image';

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
const success = '../../assets/success.png'
const fail = '../../assets/cross.png'
const warning = '../../assets/warning.png'
const VerifyRoute = ({ navigation }) => {
    const [selectedImages, setSelectedImage] = useState([])
    const [avatar, setAvatar] = useState()
    const [orgId, setOrgId] = useState()
    const [token, setToken] = useState()
    const [ButtonPress, setButtonPress] = useState('')
    const [showWarning, setShowWarning] = useState(false)
    const [mess, setMess] = useState()
    const [icon, setIcon] = useState()

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
                console.error('API Error:', error)
                setMess('Đăng minh chứng thất bại!')
                setIcon('FAIL')
                setShowWarning(true)
                setButtonPress(false)
            })
    }

    return (
        <ScrollView style={{ flex: 1, paddingTop: 25 }}>
            <CustomAlert
                visible={showWarning}
                mess={mess}
                onRequestClose={() => setShowWarning(false)}
                onPress={() => setShowWarning(false)}
                title={'ĐÓNG'}
                icon={icon}
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
                            justifyContent:'center',
                            alignContent:'center',
                            alignItems:'center',
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
    const [routes] = useState([
        { key: 'first', title: 'Hoạt động', icon: 'team' },
        { key: 'second', title: 'Đăng minh chứng', icon: 'upload' },
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
            <View style={{ flex: 1 }}>
                {renderProfileCard()}
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

export default ProfileOrganisation
