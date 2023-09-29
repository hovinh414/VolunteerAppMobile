import { View, Text, Image , Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from '../../constants/colors';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox"
import Button from '../../components/Button';
import axios from 'axios';
import {toast} from 'react-toastify';
import { loginApi } from '../../services/UserService';
import CustomInput from '../../components/CustomInput';
import Auth from './Auth';
import { shadow } from 'react-native-paper';
const LoginScreen = ({ navigation }) => {


    const [isPasswordShown, setIsPasswordShown] = useState(true);
    const [isChecked, setIsChecked] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [response, setResponse] = useState("");
    const [usernameErrorMessage, setusernameErrorMessage] = useState('');
    // const handleLogin = async () => {
        
    //     if (!username || !password) {
    //         Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ tên đằng nhập và mật khẩu!', [
                
    //             {text: 'OK', onPress: () => console.log('OK Pressed')},
    //           ]);
    //         return;
    //     }
    //     await loginApi(username, password).then((res) => {
            
    //         if (res.status === 200 && res.data.data.accessToken !== null) {
    //             localStorage.setItem("token",res.data.data.accessToken);
    //             localStorage.setItem("user",res.data.data.userResult);
    //             navigation.navigate("Welcome");
    //         } 
    //         else  {
    //             Alert.alert('Thông báo', 'Sai tên đăng nhập hoặc mật khẩu!', [
                
    //                 {text: 'OK', onPress: () => console.log('OK Pressed')},
    //               ]);
    //             return;
    //         }

    //     }).catch(error => {
    //         Alert.alert('Thông báo', error, [
                
    //             {text: 'OK', onPress: () => console.log('OK Pressed')},
    //           ]);
    //         return;
    //     });
        
    // }
    const showEmailandPhoneErrorMessage = (_username) => {
        if (_username.length === 0) {
            setusernameErrorMessage('Tên đăng nhập không được trống');
        }
        
        else {
            setusernameErrorMessage('')
        }
    }
    const showPasswordMessage = (_password) => {
        if (_password.length === 0) {
            setPasswordErrorMessage('Mật khẩu không được trống')
        } else if (Auth.isValidPassword (_password) === false) {
            setPasswordErrorMessage('Mật khẩu bao gồm 8 ký tự, chữ in hoa và chữ số')
        }
        
        else {
            setPasswordErrorMessage('')
        }
        
    }
    
    const handleLogin = async () => {
        
        try {
            if (!username || !password) {
                Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!', [
                            
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]);
                return;
            }
            const res =  await axios( {
                method : 'post',
                url: 'http://localhost:3000/api/v1/login',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                data: {
                    username,
                    password
                },
            });
            
            
            if (res.data.status === 'SUCCESS' && res.data.data.accessToken !== null) {
                
                setResponse(JSON.stringify(res.data));
                console.log(JSON.stringify(res.data));
                // localStorage.setItem("token",res.data.data.accessToken);
                // localStorage.setItem("user",res.data.data.userResult);
                navigation.navigate("Feed");
                
            } else if (res.data.status == 'ERROR') {
                
                return;
            }
            
        } catch (error) {
            // if (error) {
            //     Alert.alert('Thông báo', 'Sai thông tin đăng nhập vui lòng kiểm tra lại!', [
                            
            //         {text: 'OK', onPress: () => console.log('OK Pressed')},
            //     ]);
            // }
            alert('Sai thông tin đăng nhập vui lòng kiểm tra lại!');
            setResponse(JSON.stringify(error))
        }
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, marginHorizontal: 22 }}>
                <View style={{ marginVertical: 22 }}>
                    <Text style={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        marginVertical: 12,
                        color: COLORS.black
                    }}>
                        Xin Chào ! 👋
                    </Text>

                    <Text style={{
                        fontSize: 16,
                        color: COLORS.black
                    }}>Đăng nhập để tiếp tục!</Text>
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
                                showEmailandPhoneErrorMessage(username);
                            }}
                            placeholder='Nhập tài khoản của bạn'
                            error={usernameErrorMessage.length !== 0}
                            errorMessage={usernameErrorMessage}
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

                    <Text>Remember Me</Text>
                </View>

                <Button
                    title="Đăng nhập"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={() => handleLogin()}
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
                    <Text style={{ fontSize: 14 }}>Hoặc</Text>
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
                    <Text style={{ fontSize: 16, color: COLORS.black }}>Bạn chưa có tài khoản ? </Text>
                    <Pressable
                        onPress={() => navigation.navigate("SignupType")}
                    >
                        <Text style={{
                            fontSize: 16,
                            color: COLORS.primary,
                            fontWeight: "bold",
                            marginLeft: 6
                        }}>Đăng ký</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}


export default LoginScreen