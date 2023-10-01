import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";

import * as ImagePicker from "expo-image-picker";
import { COLORS, FONTS } from "../../constants/theme";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { RadioButton } from 'react-native-paper';
import CustomInput from "../../components/CustomInput";
import CustomInputDateTime from "../../components/CustomInputDateTime";
import Auth from "../Login/Auth";
import ImageAvata from "../../assets/images/user3.jpg"
import AsyncStoraged from '../../services/AsyncStoraged'

const EditProfile = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState();
  const [fullname, setFullname] = useState('');
  const [fullnameErrorMessage, setfullnameErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneErrorMessage, setPhoneErrorMessage] = useState('');
  const [address, setAddress] = useState("25/27 đường 6, Phường Hiệp Phú");
  const [dateOfBirth, setDateOfBirth] = useState(new Date('2002-03-10'));
  const [sex, setSex] = useState('male');

  const getUserStored = async () => {
    const userStored = await AsyncStoraged.getData();
    setFullname(userStored.userResult.fullname);
    setPhone(userStored.userResult.avatar);
    setEmail(userStored.userResult.email);
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



  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage();
    }
  };

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
              source={ImageAvata}
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
                color={'#fff'}
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
            }}>Giới tính</Text>
            <RadioButton.Group
              onValueChange={(sex) => setSex(sex)}
              value={sex}>
              <View style={{
                marginRight: 60,
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginVertical: 5,
              }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 70,
                }}>
                  <RadioButton value="male" color={COLORS.primary} />
                  <Text>Nam</Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 70,
                }}>
                  <RadioButton value="female" color={COLORS.primary} />
                  <Text>Nữ</Text>
                </View>
              </View>
            </RadioButton.Group>
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

          <View>
            <Text style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8
            }}>Ngày sinh</Text>

            <CustomInputDateTime

              _value={dateOfBirth}
              onChangeText={(text) => { setDateOfBirth(text) }}
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

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 44,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              ...FONTS.body3,
              color: '#fff',
            }}
          >
            <AntDesign
              name={'checkcircleo'}
              size={22}
              color={'#fff'}
            />
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;