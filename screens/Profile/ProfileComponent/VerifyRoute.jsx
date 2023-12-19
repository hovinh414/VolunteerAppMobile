import {
    View,
    Text,
    FlatList,
    ScrollView,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, images } from '../../../constants'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import AsyncStoraged from '../../../services/AsyncStoraged'
import * as ImagePicker from 'expo-image-picker'
import ImageUpload from '../../../assets/add-image.png'
import axios from 'axios'
import CustomButton from '../../../components/CustomButton'
import API_URL from '../../../interfaces/config'
import { Image } from 'expo-image'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import { SafeAreaView } from 'react-native-safe-area-context'
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
        console.log(result)
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
        <ScrollView style={{ flex: 1, marginHorizontal: 22 }}>
            <View
                style={{
                    zIndex: 2,
                }}
            >
                <Toast config={toastConfig} />
            </View>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    padding: 25,
                    borderBottomColor: '#cccc',
                    zIndex: 2,
                }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
                    Đăng tải minh chứng
                </Text>
            </View>
            <View
                style={{
                    zIndex: 0,
                    paddingBottom: 50,
                }}
            >
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
export default VerifyRoute
