import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ScrollView,
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
import Modal from 'react-native-modal'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'
import ModalLoading from '../../components/ModalLoading'
const loading = '../../assets/loading.gif'
const ScanQR = ({ navigation, route }) => {
    const screenWidth = Dimensions.get('window').width
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
                Toast.show({
                    type: 'joinToast',
                    text1: 'Thành công',
                    text2: 'Điểm danh thành công',
                    visibilityTime: 2500,
                    autoHide: true,
                    onHide: () => {
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
        <View
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
            <View
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: '#fec4b6',
                }}
            >
                <ModalLoading visible={showLoading} />
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
                        color={'#fec4b6'}
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
            </View>
        </View>
    )
}

export default ScanQR
