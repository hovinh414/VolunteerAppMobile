import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Modal,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS } from '../../constants/theme'
import { MaterialIcons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import CustomButtonV2 from '../../components/CustomButtonV2'
import AsyncStoraged from '../../services/AsyncStoraged'

const question = '../../assets/question.png'
const Settings = ({ navigation }) => {
    const removeData = async () => {  
        await AsyncStoraged.removeData()
    }
    const removeToken = async () => {  
        await AsyncStoraged.removeToken()
    }
    const [showWarning, setShowWarning] = useState(false)
    const [mess, setMess] = useState()

    const navigateToEditProfile = () => {
        navigation.push('EditProfile')
    }

    const navigateToSecurity = () => {
        console.log('Security function')
    }

    const navigateToNotifications = () => {
        console.log('Notifications function')
    }

    const navigateToPrivacy = () => {
        navigation.navigate('ChangePassword')
    }

    const navigateToSubscription = () => {
        console.log('Subscription function')
    }

    const navigateToSupport = () => {
        console.log('Support function')
    }

    const navigateToTermsAndPolicies = () => {
        console.log('Terms and Policies function')
    }

    const navigateToFreeSpace = () => {
        console.log('Free Space function')
    }

    const navigateToDateSaver = () => {
        console.log('Date saver')
    }

    const navigateToReportProblem = () => {
        console.log('Report a problem')
    }

    const addAccount = () => {
        console.log('Aadd account ')
    }

    const logout = () => {
        setMess('Bạn có muốn đăng xuất?')
        setShowWarning(true)
        // Alert.alert('Thông báo', 'Bạn có muốn đăng xuất', [
        //   {
        //     text: 'Hủy',
        //     onPress: () => console.log('Cancel Pressed'),
        //     style: 'cancel',
        //   },
        //   { text: 'Đồng ý', onPress: () => navigation.push('LoginScreen') },
        // ]);
    }

    const accountItems = [
        {
            icon: 'person-outline',
            text: 'Chỉnh sửa thông tin',
            action: navigateToEditProfile,
        },
        { icon: 'security', text: 'Bảo mật', action: navigateToSecurity },
        {
            icon: 'notifications-none',
            text: 'Thông báo',
            action: navigateToNotifications,
        },
        {
            icon: 'lock-outline',
            text: 'Đổi mật khẩu',
            action: navigateToPrivacy,
        },
    ]

    const supportItems = [
        {
            icon: 'credit-card',
            text: 'Điều khoản sử dụng',
            action: navigateToSubscription,
        },
        { icon: 'help-outline', text: 'Hỗ trợ', action: navigateToSupport },
        {
            icon: 'info-outline',
            text: 'Giới thiệu',
            action: navigateToTermsAndPolicies,
        },
    ]

    const actionsItems = [
        {
            icon: 'outlined-flag',
            text: 'Báo cáo',
            action: navigateToReportProblem,
        },
        // { icon: "people-outline", text: "Thêm taid", action: addAccount },
        { icon: 'logout', text: 'Đăng xuất', action: logout },
    ]

    const renderSettingsItem = ({ icon, text, action }) => (
        <TouchableOpacity
            onPress={action}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 8,
                paddingLeft: 12,
                backgroundColor: COLORS.gray,
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
                            {mess}
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
                                    onPress={() => (
                                        removeData(),
                                        removeToken(),
                                        navigation.push('BottomTabNavigation'),
                                        setShowWarning(false)
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <MaterialIcons name={icon} size={26} color="black" />
            <Text
                style={{
                    marginLeft: 36,
                    ...FONTS.semiBold,
                    fontWeight: 600,
                    fontSize: 16,
                }}
            >
                {text}{' '}
            </Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View
                style={{
                    marginHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: 22,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        paddingTop: 18,
                        position: 'absolute',
                        left: 0,
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <Text style={{ ...FONTS.h3 }}>Cài đặt</Text>
            </View>

            <ScrollView style={{ marginHorizontal: 12 }}>
                {/* Account Settings */}
                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Tài khoản
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {accountItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Support and About settings */}

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Hỗ trợ{' '}
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {supportItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>

                {/* Actions Settings */}

                <View style={{ marginBottom: 12 }}>
                    <Text style={{ ...FONTS.h4, marginVertical: 10 }}>
                        Thao tác
                    </Text>
                    <View
                        style={{
                            borderRadius: 12,
                            backgrounColor: COLORS.gray,
                        }}
                    >
                        {actionsItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {renderSettingsItem(item)}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Settings
