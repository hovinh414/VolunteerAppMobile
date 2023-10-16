import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  SafeAreaView,
  Alert,
  Pressable
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants/theme";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import CustomInput from "../../components/CustomInput";
import Auth from "../Login/Auth";
import ImageAvata from "../../assets/hero2.jpg"
import AsyncStoraged from '../../services/AsyncStoraged'
import CustomButton from "../../components/CustomButton";


const success = '../../assets/success.png';
const fail = '../../assets/cross.png';
const warning = '../../assets/warning.png';
const EditProfile = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [avatar, setAvatar] = useState();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [fullnameErrorMessage, setfullnameErrorMessage] = useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [address, setAddress] = useState('');
  const [userId, setUserId] = useState();
  const [token, setToken] = useState();
  const [ButtonPress, setButtonPress] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [mess, setMess] = useState();
  const [icon, setIcon] = useState();

  const getUserStored = async () => {
    const userStored = await AsyncStoraged.getData();
    setFullname(userStored.fullname);
    setUsername(userStored.username);
    setPhone(userStored.phone);
    setEmail(userStored.email);
    setAddress(userStored.address);
    setAvatar(userStored.avatar);
    setUserId(userStored._id);
  }
  useEffect(() => { getUserStored(); }, []);

  const showFullNameError = (_fullname) => {
    if (_fullname.length === 0) {
      setfullnameErrorMessage('Tên không được trống');
    }

    else {
      setfullnameErrorMessage('')
    }
  }
  const showUserNameError = (_username) => {
    if (_username.length === 0) {
      setUsernameErrorMessage('Tên đăng nhập không được trống');
    }

    else {
      setUsernameErrorMessage('')
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


  const getToken = async () => {
    const token = await AsyncStoraged.getToken();
    setToken(token);
  }
  useEffect(() => { getToken(); }, []);
  const formData = new FormData();
  const randomNum = Math.floor(Math.random() * (10000 - 10 + 1)) + 10;
  const handleUpdateUser = async () => {
    if (!fullname || !username || !email || !phone) {
      setMess('Vui lòng điền đầy đủ thông tin!');
      setIcon();
      setShowWarning(true);
      return;
    }
    if (selectedImage.length > 0) {
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
      formData.append('avatar', {
        uri: selectedImage,
        type: 'image/jpeg',
        name: username + userId + randomNum,
      });
    } else {
      formData.append('fullname', fullname);
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('address', address);
    }

    setButtonPress(true);
    axios.put(('http://172.20.10.2:3000/api/v1/user?userid=' + userId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token,
      },
    })
      .then((response) => {
        if (response.data.status === 'SUCCESS') {
          AsyncStoraged.storeData(response.data.data.userResultForUpdate);
          setMess('Thay đổi thông tin thành công!');
          setIcon('SUCCESS');
          setShowWarning(true);
          setButtonPress(false);
          navigation.push('BottomTabNavigation');

        }
      })
      .catch((error) => {
        setMess('Thay đổi thông tin thất bại!');
        setIcon('FAIL');
        setShowWarning(true);
        setButtonPress(false);
      });
  }

  const handleCheckUsername = async (_username) => {

    try {

      const res = await axios({
        method: 'get',
        url: 'http://172.20.10.2:3000/api/v1/checkUsername?username=' + _username,
      });

      if (res.data.status === 'SUCCESS') {

      }
    } catch (error) {
      setUsernameErrorMessage('Tên đăng nhập đã được sử dụng!');
    }

  };


  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [5, 5],
      quality: 1,
    });
    delete result.cancelled;

    if (!result.canceled) {

      setSelectedImage(result.assets[0].uri);
      setAvatar(result.assets[0].uri);

    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',

      }}
    >
      <Modal
        visible={showWarning}
        animationType='fade'
        transparent
        onRequestClose={() =>
          setShowWarning(false)
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
              padding: 20,
            }}
          >
            {
              icon === 'SUCCESS' ?
                <Image
                  source={require(success)}
                  style={{
                    marginTop: 15,
                    width: 50,
                    height: 50,
                  }}
                />
                :
                icon === 'FAIL' ?
                  <Image
                    source={require(fail)}
                    style={{
                      marginTop: 15,
                      width: 50,
                      height: 50,
                    }}
                  />
                  :
                  <Image
                    source={require(warning)}
                    style={{
                      marginTop: 15,
                      width: 50,
                      height: 50,
                    }}
                  />

            }
            <Text style={{
              fontWeight: 'bold',
              fontSize: 18,
            }}>Thông báo</Text>
            <Text style={{
              fontSize: 16,
            }}>{mess}</Text>

            <View style={{
              marginTop: 15,
              width: 200,
            }}>
              <CustomButton title='ĐÓNG' onPress={() => setShowWarning(false)} />
            </View>
          </View>


        </View>
      </Modal>
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

        <Text style={{ ...FONTS.h3 }}>Chỉnh sửa thông tin</Text>
      </View>

      <ScrollView
        style={{ paddingHorizontal: 22 }}>
        <View
          style={{
            alignItems: "center",
            marginVertical: 22,
          }}
        >
          <TouchableOpacity onPress={handleImageSelection}>
            <Image
              source={avatar ? { uri: avatar } : ImageAvata}
              style={{
                height: 140,
                width: 140,
                borderRadius: 85,
              }}
            />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 58,
                zIndex: 9999,
              }}
            >
              <MaterialIcons
                name="photo-camera"
                size={24}
                color={'black'}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8
            }}>Họ tên </Text>
            <CustomInput
              value={fullname}
              onChangeText={(fullname) => {
                setFullname(fullname);
                showFullNameError(fullname);
              }}
              error={fullnameErrorMessage.length !== 0}
              errorMessage={fullnameErrorMessage}
            />
          </View>
          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8
            }}>Tên đăng nhập </Text>
            <CustomInput
              value={username}
              onChangeText={(username) => {
                handleCheckUsername(username);
                setUsername(username);
                showUserNameError(username);

              }}
              error={usernameErrorMessage.length !== 0}
              errorMessage={usernameErrorMessage}
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
              value={email}
              error={emailErrorMessage.length !== 0}
              errorMessage={emailErrorMessage}
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
              value={phone}
              error={phoneErrorMessage.length !== 0}
              errorMessage={phoneErrorMessage}
            />
          </View>

        </View>

        <View>
          <Text style={{
            fontSize: 16,
            fontWeight: 400,
            marginVertical: 8
          }}>Địa chỉ</Text>
          <CustomInput
            value={address}
            onChangeText={(address) => {
              setAddress(address);
            }}
          />
        </View>

        <CustomButton onPress={() => handleUpdateUser()} title='THAY ĐỔI THÔNG TIN' isLoading={ButtonPress} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;