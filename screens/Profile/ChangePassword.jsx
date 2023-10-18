import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Modal
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS, FONTS } from "../../constants/theme";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import Auth from "../Login/Auth";
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import AsyncStoraged from '../../services/AsyncStoraged'
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert";

const success = '../../assets/success.png';
const fail = '../../assets/cross.png';
const warning = '../../assets/warning.png';
const ChangePassword = ({ navigation }) => {
    const [password, setPassword] = useState();
    const [newPassword, setNewPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
    const [newPasswordConfirmErrorMessage, setNewPasswordConfirmErrorMessage] = useState('');
    const [isPasswordShow, setIsPasswordShow] = useState(true);
    const [isNewPasswordShow, setIsNewPasswordShow] = useState(true);
    const [isConfirmPasswordShow, setIsConfỉmPasswordShow] = useState(true);
    const [userId, setUserId] = useState();
    const [token, setToken] = useState();
    const [ButtonPress, setButtonPress] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [mess, setMess] = useState();
    const [icon, setIcon] = useState();

    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData();
        setUserId(userStored._id);
        setToken(userStored.accessToken);
    }
    useEffect(() => { getUserStored(); }, []);
    const handleUpdatePassword = async () => {
        try {
            if (!password || !passwordConfirm || !newPassword) {
                setMess('Vui lòng điền đầy đủ thông tin!');
                setIcon();
                setShowWarning(true);
                return;
            }
            setButtonPress(true);
            const res = await axios({
                method: 'put',
                url: 'http://172.20.10.2:3000/api/v1/user?userid=' + userId,
                headers: {
                    'Authorization': token,
                },
                data: {
                    oldPassword: password,
                    password: passwordConfirm,
                },
            });

            if (res.data.status === 'SUCCESS') {
                setMess('Thay đổi mật khẩu thành công!');
                setIcon('SUCCSESS');
                setShowWarning(true);
                setButtonPress(false);
                navigation.push("BottomTabNavigation");

            }
        } catch (error) {
            alert(error);
            setMess('Thay đổi mật khẩu thất bại!');
            setIcon('FAIL');
            setShowWarning(true);
            setButtonPress(false);
        }

    }
    const showPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setPasswordErrorMessage('Mật khẩu không được trống');
        } else if (Auth.isValidPassword(_password) === false) {
            setPasswordErrorMessage('Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số');
        }

        else {
            setPasswordErrorMessage('');
        }

    }
    const showNewPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setNewPasswordErrorMessage('Mật khẩu không được trống');
        } else if (Auth.isValidPassword(_password) === false) {
            setNewPasswordErrorMessage('Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số');
        }

        else {
            setNewPasswordErrorMessage('')
        }

    }
    const showConfirmNewPasswordMessage = (_password, _newPassword) => {
        if (_password !== _newPassword) {
            setNewPasswordConfirmErrorMessage('Mật khẩu không trùng khớp');
        }
        else {
            setNewPasswordConfirmErrorMessage('')
        }

    }
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',

            }}
        >
            <CustomAlert
                visible={showWarning}
                mess={mess}
                onRequestClose={() =>
                    setShowWarning(false)
                }
                onPress={() => setShowWarning(false)}
                title={'ĐÓNG'}
                icon={icon}
            />
            <View
                style={{

                    marginHorizontal: 12,
                    flexDirection: "row",
                    justifyContent: "center",
                    paddingTop: 22,
                }}
            >
                <TouchableOpacity

                    onPress={() => navigation.goBack()}
                    style={{
                        paddingTop: 19,
                        position: "absolute",
                        left: 0,
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={24}
                        color={COLORS.black}
                    />
                </TouchableOpacity>

                <Text style={{ ...FONTS.h3 }}>Đổi mật khẩu</Text>
            </View>

            <ScrollView
                style={{ paddingHorizontal: 22 }}>
                <View
                    style={{
                        alignItems: "center",
                        marginVertical: 22,
                    }}
                >

                </View>

                <View>
                    <View>
                        <Text style={{
                            ...FONTS.h4,
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}><Text style={{ color: COLORS.primary }}>*</Text> Mật khẩu hiện tại</Text>
                        <CustomInput
                            onChangeText={(password) => {
                                setPassword(password);
                                showPasswordMessage(password);
                            }}
                            placeholder={'Nhập mật khẩu hiện tại'}
                            error={passwordErrorMessage.length !== 0}
                            errorMessage={passwordErrorMessage}
                            secureTextEntry={isPasswordShow}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordShow(!isPasswordShow)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isPasswordShow == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{
                            ...FONTS.h4,
                            fontSize: 16,
                            fontWeight: 400,
                            marginVertical: 8
                        }}><Text style={{ color: COLORS.primary }}>*</Text> Mật khẩu mới</Text>

                        <CustomInput
                            onChangeText={(newPassword) => {
                                setNewPassword(newPassword);
                                showNewPasswordMessage(newPassword);
                            }}
                            placeholder={'Nhập mật khẩu mới'}
                            error={newPasswordErrorMessage.length !== 0}
                            errorMessage={newPasswordErrorMessage}
                            secureTextEntry={isNewPasswordShow}
                        />
                        <TouchableOpacity
                            onPress={() => setIsNewPasswordShow(!isNewPasswordShow)}
                            style={{
                                position: "absolute",
                                right: 12
                            }}
                        >
                            {
                                isNewPasswordShow == true ? (
                                    <Ionicons name="eye-off" size={24} color={COLORS.black} />
                                ) : (
                                    <Ionicons name="eye" size={24} color={COLORS.black} />
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{
                    paddingBottom: 12,
                }}>
                    <Text style={{
                        ...FONTS.h4,
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}><Text style={{ color: COLORS.primary }}>*</Text> Nhập lại mật khẩu mới</Text>

                    <CustomInput
                        placeholder={'Nhập lại mật khẩu mới'}
                        onChangeText={(passwordConfirm) => {
                            setPasswordConfirm(passwordConfirm);
                            showConfirmNewPasswordMessage(newPassword, passwordConfirm);
                        }}
                        error={newPasswordConfirmErrorMessage.length !== 0}
                        errorMessage={newPasswordConfirmErrorMessage}
                        secureTextEntry={isConfirmPasswordShow}

                    />
                    <TouchableOpacity
                        onPress={() => setIsConfỉmPasswordShow(!isConfirmPasswordShow)}
                        style={{
                            position: "absolute",
                            right: 12
                        }}
                    >
                        {
                            isConfirmPasswordShow == true ? (
                                <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={COLORS.black} />
                            )
                        }

                    </TouchableOpacity>
                </View>

                <CustomButton onPress={() => handleUpdatePassword()} title='ĐỔI MẬT KHẨU' isLoading={ButtonPress} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ChangePassword;