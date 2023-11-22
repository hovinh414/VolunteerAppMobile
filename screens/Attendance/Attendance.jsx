import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons'
import AsyncStoraged from '../../services/AsyncStoraged'
import { Image } from 'expo-image'
import axios from 'axios'
import API_URL from '../../interfaces/config'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Modal from 'react-native-modal'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ModalLoading from '../../components/ModalLoading'
import { da } from 'date-fns/locale'
const scan = '../../assets/scan.gif'
const scan1 = '../../assets/scan.png'
const report = '../../assets/comment.png'
const attendance = '../../assets/attendance.png'
const loading = '../../assets/loading.gif'
const Attendance = ({ navigation, route }) => {
    const screenWidth = Dimensions.get('window').width
    const [id, setId] = useState()
    const [fullname, setFullname] = useState('')
    const [avatar, setAvatar] = useState('')
    const [type, setType] = useState('')
    const [isScanner, setIsScanner] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const [scanned, setScanned] = useState(false)
    const [token, setToken] = useState('')
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    // useEffect(() => {
    //     const getBarCodeScannerPermissions = async () => {
    //         const { status } = await BarCodeScanner.requestPermissionsAsync()
    //         setHasPermission(status === 'granted')
    //         console.log(hasPermission)
    //     }
    //     getBarCodeScannerPermissions()
    // }, [])

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true)
        attendanceActivity(data)
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
                navigation.replace('DetailPost', response.data.data)
            }
        } catch (error) {
            console.log('API Error:', error)
        }
    }
    const attendanceActivity = async (data) => {
        setShowLoading(true)
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/activity/attendance/' + data,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })
            if (res.data.status === 'SUCCESS') {
                setShowLoading(false)
                setIsScanner(false)
                Toast.show({
                    type: 'joinToast',
                    text1: 'Thành công',
                    text2: 'Điểm danh thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: () => {
                        //
                        navigation.navigate('DetailPost', res.data.data)
                    },
                })
            }
        } catch (error) {
            if (error) {
                Toast.show({
                    type: 'error',
                    text1: 'Thất bại',
                    text2: 'Điểm danh thất bại!',
                    visibilityTime: 2500,
                })
                console.log('atendance error: ' + error)
            }
        }
    }
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setFullname(userStored.fullname)
        setId(userStored._id)
        setAvatar(userStored.avatar)
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const renderScanQrCodeModal = () => (
        <Modal
            isVisible={isScanner}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: '#fec4b6',
                }}
                onPressOut={() => {
                    setIsScanner(false)
                    setScanned(false)
                }}
            >
                {renderLoading()}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 12,
                        top: 60,
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                    <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Scan QR Code
                    </Text>
                    <MaterialIcons
                        name={'qr-code-scanner'}
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            margin: 12,
                            height: '60%',
                            padding: 12,
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: 25,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                }}
                            >
                                Scan QR để điểm danh
                            </Text>
                        </View>
                        <BarCodeScanner
                            style={{
                                position: 'absolute',
                                width: 300,
                                height: 300,
                            }}
                            onBarCodeScanned={
                                scanned ? undefined : handleBarCodeScanned
                            }
                        />
                        <Image
                            source={require('../../assets/khung.png')}
                            style={{ width: 350, height: 350 }}
                        />
                        <View
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 25,
                            }}
                        >
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 15,
                                }}
                            >
                                Cảm ơn bạn đã tham gia tình nguyện cùng Việc Tử
                                Tế!
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
    const renderLoading = () => (
        <Modal
            isVisible={showLoading}
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ margin: 0 }}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require(loading)}
                    style={{ width: 70, height: 70 }}
                />
            </View>
        </Modal>
    )
    const toastConfig = {
        success: (props) => (
            <BaseToast
                {...props}
                style={{
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                    width: '90%',
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
        joinToast: ({ text1, text2, email }) => (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderLeftColor: '#379A4F',
                    backgroundColor: '#379A4F',
                    borderRadius: 12,
                    padding: 10,
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 5,
                    }}
                >
                    <Ionicons
                        name="checkmark-circle-outline"
                        size={35}
                        color={'#fff'}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'column',
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: '700',
                            color: '#fff',
                        }}
                    >
                        {text1}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fff',
                            marginTop: 5,
                            marginRight: 5,
                        }}
                    >
                        {text2}
                    </Text>
                </View>
            </View>
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
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#F0F0F0',
            }}
        >
            <View
                style={{
                    zIndex: 4,
                }}
            >
                <Toast config={toastConfig} />
            </View>
            <ModalLoading visible={showLoading} />
            {renderScanQrCodeModal()}

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: 13,
                }}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={30}
                    color={COLORS.black}
                />
                <Text
                    style={{
                        color: COLORS.black,
                        fontSize: 17,
                        fontWeight: 'bold',
                    }}
                >
                    Quay lại
                </Text>
            </TouchableOpacity>

            <View
                style={{
                    backgroundColor: '#fec4b6',
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    height: '50%',
                    marginTop: 30,
                    marginHorizontal: 25,
                }}
            >
                {type === 'Organization' ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                        }}
                    >
                        <Text
                            style={{
                                color: COLORS.black,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginBottom: 20,
                                marginTop: 50,
                            }}
                        >
                            Mã QR cá nhân
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 20,
                                borderRadius: 25,
                            }}
                        >
                            <QRCode value={id} size={200} />
                        </View>
                        <Text
                            style={{
                                color: COLORS.black,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 25,
                            }}
                        >
                            {fullname}
                        </Text>
                        {/* <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 10,
                        }}
                    >
                        ID: {id}
                    </Text> */}
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#fff',
                                padding: 10,
                                borderRadius: 25,
                            }}
                        >
                            <Image
                                source={avatar}
                                style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 25,
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                color: COLORS.black,
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 25,
                            }}
                        >
                            {fullname}
                        </Text>
                        {/* <Text
                        style={{
                            color: COLORS.black,
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 10,
                        }}
                    >
                        ID: {id}
                    </Text> */}
                    </View>
                )}
            </View>
            <View
                style={{
                    backgroundColor: '#fff',
                    height: '25%',
                    marginHorizontal: 25,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    {type === 'Organization' ? (
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ShowQr')}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require(scan1)}
                                style={{ width: 50, height: 50 }}
                            />
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 16,
                                    marginTop: 10,
                                }}
                            >
                                Quản lý QR
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={require(attendance)}
                                style={{ width: 50, height: 50 }}
                            />
                            <Text
                                style={{
                                    color: COLORS.black,
                                    fontWeight: '500',
                                    fontSize: 16,
                                    marginTop: 10,
                                }}
                            >
                                HĐ đã điểm danh
                            </Text>
                        </TouchableOpacity>
                    )}
                    {/* <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(scan1)}
                            style={{ width: 50, height: 50 }}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '500',
                                fontSize: 16,
                                marginTop: 10,
                            }}
                        >
                            Quản lý QR
                        </Text>
                    </View> */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={require(report)}
                            style={{ width: 47, height: 47 }}
                        />
                        <Text
                            style={{
                                color: COLORS.black,
                                fontWeight: '500',
                                fontSize: 16,
                                marginTop: 10,
                            }}
                        >
                            Gửi phản ánh
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: 25,
                    borderTopWidth: 1,
                    borderTopColor: '#cccc',
                    borderBottomRightRadius: 25,
                    height: '10%',
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Feed')}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <AntDesign name="home" size={27} color={'#696969'} />
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        top: -40,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            setIsScanner(true)
                            setScanned(false)
                        }}
                        activeOpacity={0.8}
                        style={{
                            height: 80,
                            width: 80,
                            borderRadius: 50,
                            backgroundColor: '#fec4b6',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 3,
                        }}
                    >
                        <Image
                            source={require(scan)}
                            style={{
                                height: 130,
                                width: 130,
                                // Các thiết lập khác của hình ảnh nếu cần
                            }}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('NotificationScreen')
                        }
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons
                            name="notifications-outline"
                            size={27}
                            color={'#696969'}
                        />
                    </TouchableOpacity>
                </View>
                {/* Thêm phần này để ảnh scan nằm giữa đường borderTop */}
            </View>
        </SafeAreaView>
    )
}

export default Attendance
