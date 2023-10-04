import { View, Text, Image, Pressable, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../components/Button';
import { signUpApi } from '../../services/UserService';
import Auth from '../Login/Auth';
import CustomInput from '../../components/CustomInput';

const Signup = ({ navigation }) => {
    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);

    const [type, setType] = useState("User");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [usernameErrorMessage, setusernameErrorMessage] = useState('');
    const [fullnameErrorMessage, setfullnameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const showFullNameError = (_fullname) => {
        if (_fullname.length === 0) {
            setfullnameErrorMessage('Tên không được trống');
        }

        else {
            setfullnameErrorMessage('')
        }
    }
    const showEmailMessage = (_email) => {
        if (_email.length === 0) {
            setEmailErrorMessage('Email không được trống')
        } else if (Auth.isValidEmail(_email) === false) {
            setEmailErrorMessage('Email sai định dạng')
        }

        else {
            setEmailErrorMessage('')
        }

    }
    const showUsernameErrorMessage = (_username) => {
        if (_username.length === 0) {
            setusernameErrorMessage('Tên đăng nhập không được trống');
        }

        else {
            setusernameErrorMessage('')
        }
    }
    const showPhonenumberErrorMessage = (_phone) => {
        if (Auth.isValidPhone(_phone) === false) {
            setPhoneErrorMessage('Số điện thoại không đúng');
        } else if (_phone.length !== 10) {
            setPhoneErrorMessage('Số điện thoại phải đủ 10 chữ số');
        }

        else {
            setPhoneErrorMessage('')
        }
    }
    const showPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setPasswordErrorMessage('Mật khẩu không được trống')
        } else if (Auth.isValidPassword(_password) === false) {
            setPasswordErrorMessage('Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số')
        }

        else {
            setPasswordErrorMessage('')
        }

    }
    const handleSignup = async () => {
        try {
            if (!username || !password || !email || !phone || !fullname) {
                Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!', [

                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]);
                return;
            }
            await signUpApi(type, fullname, email, username, password, phone).then((res) => {

                if (res.status === 201) {
                    Alert.alert('Thông báo', 'Đăng ký thành công vui lòng đăng nhập!', [

                        { text: 'OK', onPress: () => navigation.navigate("LoginScreen") },
                    ]);


                }

            })
        } catch (error) {
            Alert.alert('Thông báo', 'Sai thông tin đăng ký vui lòng kiểm tra lại!', [

                { text: 'OK', onPress: () => console.log('Press') },
            ]);
        }

    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 15, }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Đăng Ký
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Vui lòng điền đầy đủ thông tin!</Text>
                </View>
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Họ tên </Text>
                    <CustomInput
                        onChangeText={(fullname) => {
                            setFullname(fullname);
                            showFullNameError(fullname);
                        }}
                        placeholder='Nhập họ tên của bạn'
                        error={fullnameErrorMessage.length !== 0}
                        errorMessage={fullnameErrorMessage}
                    />
                </View>
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Email</Text>

                    <CustomInput
                        onChangeText={(email) => {
                            setEmail(email);
                            showEmailMessage(email);
                        }}
                        placeholder='Nhập email của bạn'
                        error={emailErrorMessage.length !== 0}
                        errorMessage={emailErrorMessage}
                    />
                </View>
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Tài khoản</Text>

                    <CustomInput
                        onChangeText={(username) => {
                            setUsername(username);
                            showUsernameErrorMessage(username);
                        }}
                        placeholder='Nhập tên đăng nhập của bạn'
                        error={usernameErrorMessage.length !== 0}
                        errorMessage={usernameErrorMessage}
                    />
                </View>
                <View>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Số điện thoại</Text>

                    <CustomInput
                        keyboardType={'numeric'}
                        onChangeText={(phone) => {
                            setPhone(phone);
                            showPhonenumberErrorMessage(phone);
                        }}
                        placeholder='Nhập số điện thoại của bạn'
                        error={phoneErrorMessage.length !== 0}
                        errorMessage={phoneErrorMessage}
                    />
                </View>

                <View style={{ marginBottom: 12 }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: 400,
                        marginVertical: 8
                    }}>Mật khẩu</Text>

                    <CustomInput
                        onChangeText={(password) => {
                            setPassword(password);
                            showPasswordMessage(password);
                        }}
                        placeholder='Nhập mật khẩu của bạn'
                        error={passwordErrorMessage.length !== 0}
                        errorMessage={passwordErrorMessage}
                        secureTextEntry={isPasswordShown}

                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordShown(!isPasswordShown)}
                        style={{
                            position: "absolute",
                            right: 12
                        }}
                    >
                        {
                            isPasswordShown == true ? (
                                <Ionicons name="eye-off" size={24} color={COLORS.black} />
                            ) : (
                                <Ionicons name="eye" size={24} color={COLORS.black} />
                            )
                        }

                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'row',
                    marginVertical: 6
                }}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        value={isChecked}
                        onValueChange={setIsChecked}
                        color={isChecked ? COLORS.primary : undefined}
                    />

                    <Text>Tôi đồng ý với các Điều khoản và Điều kiện</Text>
                </View>

                <Button
                    title="Đăng Ký"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}

                    onPress={() => handleSignup()}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                    <Text style={{ fontSize: 14 }}>Hoặc đăng ký với</Text>
                    <View
                        style={{
                            flex: 1,
                            height: 1,
                            backgroundColor: COLORS.grey,
                            marginHorizontal: 10
                        }}
                    />
                </View>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../../assets/facebook.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Facebook</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => console.log("Pressed")}
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            height: 52,
                            borderWidth: 1,
                            borderColor: COLORS.grey,
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    >
                        <Image
                            source={require("../../assets/google.png")}
                            style={{
                                height: 36,
                                width: 36,
                                marginRight: 8
                            }}
                            resizeMode='contain'
                        />

                        <Text>Google</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginVertical: 22
                }}>
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Bạn đã có tài khoản</Text>
                    <Pressable
                        onPress={() => navigation.navigate("LoginScreen")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Đăng nhập</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

export default Signup