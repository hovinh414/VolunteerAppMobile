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
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Modal from 'react-native-modal'

const scan = '../../assets/scan.gif'
const scan1 = '../../assets/scan.png'
const report = '../../assets/comment.png'
const attendance = '../../assets/attendance.png'
const Attendance = ({ navigation, route }) => {
    const screenWidth = Dimensions.get('window').width
    const [id, setId] = useState()
    const [fullname, setFullname] = useState('')
    const [type, setType] = useState('')
    const [isScanner, setIsScanner] = useState(false)
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setFullname(userStored.fullname)
        setId(userStored._id)
        setType(userStored.type)
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const renderScanQrCodeModal = () => (
        <Modal
            isVisible={isScanner}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            style={{ margin: 0 }}
        >
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    flex: 1,
                    backgroundColor: '#fec4b6',
                }}
                onPressOut={() => setIsScanner(false)}
            >
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
                        justifyContent:'center',
                        alignItems:'center'
                        }}
                >
                    <View
                        style={{
                            backgroundColor:COLORS.white,
                            margin:12,
                            height:'60%',
                            padding:12,
                            borderRadius:20,
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
    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#F0F0F0',
            }}
        >
            {renderScanQrCodeModal()}
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
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
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-start',
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
                            marginTop: 25,
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
                            onPress={() =>
                                navigation.navigate('ShowQr')
                            }
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
                <View
                    style={{
                        position: 'absolute',
                        top: -40,
                        right: screenWidth / 3,
                        alignSelf: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setIsScanner(true)}
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
            </View>
        </SafeAreaView>
    )
}

export default Attendance
