import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, FlatList, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './PostScreenStyle';
import CustomButton from '../../components/CustomButton';
import AsyncStoraged from '../../services/AsyncStoraged';
import ImageAvata from "../../assets/hero2.jpg"
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { addYears, format } from 'date-fns';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'
import { RadioButton } from 'react-native-paper';
import CustomInputDateTime from '../../components/CustomInputDateTime';
import CustomAlert from '../../components/CustomAlert';

const checkin = '../../assets/checkin.png';
const addPicture = '../../assets/add-image.png';
const success = '../../assets/success.png';
const fail = '../../assets/cross.png';
const warning = '../../assets/warning.png';
const Create = () => {
    const [selectedImages, setSelectedImage] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [fullname, setFullname] = useState("");
    const [address, setAddress] = useState('');
    const [token, setToken] = useState();
    const [exprirationDate, setExprirationDate] = useState('');
    useEffect(() => {
        const currentDate = new Date();
        const nextYearDate = addYears(currentDate, 1);
        const formattedDate = format(nextYearDate, 'dd-MM-yyyy'); // Định dạng ngày-tháng-năm
        setExprirationDate(formattedDate);
    }, []);
    const [scope, setScope] = useState('');
    const [content, setContent] = useState('');
    const [participants, setParticipants] = useState('');
    const [ButtonPress, setButtonPress] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [mess, setMess] = useState();
    const [icon, setIcon] = useState();

    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData();
        setAvatar(userStored.avatar);
        setFullname(userStored.fullname);
        setAddress(userStored.address);
    }
    useEffect(() => { getUserStored(); }, []);
    const getToken = async () => {
        const token = await AsyncStoraged.getToken();
        setToken(token);
    }

    useEffect(() => { getToken(); }, []);
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        });
        delete result.cancelled;
        if (!result.canceled) {

            if (!selectedImages) {
                setSelectedImage(result.assets);
            }
            else {
                setSelectedImage([...selectedImages, ...result.assets]);
            }
        }
    };
    function removeImage(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item);
        setSelectedImage(newList);
    }
    function resetForm() {
        setSelectedImage([]);
        setParticipants(null);
        setContent(null);
        setScope(null);
    }
    const formData = new FormData();
    const uploadPost = async () => {
        selectedImages.forEach((images, index) => {
            formData.append('images', {
                uri: images.uri,
                type: 'image/jpeg',
                name: images.fileName,
            });
        });
        formData.append('exprirationDate', exprirationDate);
        formData.append('scope', scope);
        formData.append('content', content);
        formData.append('participants', participants);
        console.log(formData);
        setButtonPress(true);

        if (selectedImages.length === 0 || !content || !scope || !participants) {
            setMess('Vui lòng nhập đầy đủ thông tin và hình ảnh!');
            setIcon();
            setShowWarning(true);
            setButtonPress(false);
            return;
        }
        axios.post(('http://172.20.10.2:3000/api/v1/post'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token,
            },
        })
            .then((response) => {

                if (response.data.status === 'SUCCESS') {
                    setMess('Đăng bài viết thành công!');
                    setIcon('SUCCESS');
                    setShowWarning(true);
                    resetForm();
                    setButtonPress(false);
                }
            })
            .catch((error) => {
                console.error('API Error:', error);
                setMess('Đăng bài viết thất bại!');
                setIcon('FAIL');
                setShowWarning(true);
                setButtonPress(false);
            });


    }
    return (
        <ScrollView style={{ backgroundColor: '#fff' }}>
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
            <View style={{ backgroundColor: '#fff', height: '100%' }}>
                <View style={styles.post}>
                    <View style={styles.header}>
                        <View style={styles.profile}>
                            <Image source={avatar ? { uri: avatar } : ImageAvata} style={styles.profile_img} />
                            <View style={styles.profile_details}>
                                <Text style={styles.author}>{fullname}</Text>
                                <View style={styles.checkin}>
                                    <Image source={require(checkin)} style={styles.checkinIcon} />
                                    <Text style={styles.checkinText}>{address}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 10 }}>
                    <View style={styles.content}>
                        <Text style={styles.headerInput}>Đối tượng</Text>
                        <RadioButton.Group
                            onValueChange={(scope) => setScope(scope)}
                            value={scope}>
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
                                    marginLeft: 10,
                                    marginRight: 50,

                                }}>
                                    <View style={{
                                        borderColor: COLORS.primary, // Thay 'blue' bằng màu viền bạn muốn sử dụng
                                        borderWidth: 2,
                                        borderRadius: 50,
                                        marginRight: 10,
                                    }}><RadioButton value="public" color={COLORS.primary} /></View>
                                    <Text style={{ fontSize: 16 }}>Công khai</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 10,
                                    marginRight: 40,

                                }}>
                                    <View style={{
                                        borderColor: COLORS.primary, // Thay 'blue' bằng màu viền bạn muốn sử dụng
                                        borderWidth: 2,
                                        borderRadius: 50,
                                        marginRight: 10,
                                    }}><RadioButton value="private" color={COLORS.primary} /></View>
                                    <Text style={{ fontSize: 16 }}>Riêng tư</Text>
                                </View>
                            </View>
                        </RadioButton.Group>
                        <Text style={styles.headerInput}>Ngày hết hạn:</Text>
                        <CustomInputDateTime
                            _value={exprirationDate}
                            onChangeText={(exprirationDate) => { (exprirationDate) }}

                        />
                        <Text style={styles.headerInput}>Nhập nội dung bài viết:</Text>
                        <TextInput
                            value={content}
                            placeholderTextColor={'#696969'}
                            onChangeText={(content) => {
                                setContent(content);
                            }}
                            style={styles.content_detail}
                            placeholder="Bạn muốn kêu gọi tình nguyện ở việc gì, ở đâu ..."
                            multiline={true}
                        />

                        <Text style={styles.headerInput}>Số tình nguyện viên:</Text>
                        <TextInput
                            value={participants}
                            placeholderTextColor={'#696969'}
                            onChangeText={(participants) => {
                                setParticipants(participants)
                            }}
                            style={styles.address}
                            placeholder="100"
                            multiline={true}
                            keyboardType='numeric'
                        />

                    </View>
                    <Text style={styles.headerInput}>Hình ảnh bài viết:</Text>
                    <FlatList
                        data={selectedImages}
                        horizontal={true}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <View
                                key={item.id}
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
                                        width: 80,
                                        height: 80,
                                        borderRadius: 12,
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => removeImage(item)}
                                    style={{
                                        position: "absolute",
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
                            flex: 1,
                            flexDirection: 'row',
                            paddingVertical: 10,
                            marginHorizontal: 10,

                        }}
                        onPress={() => handleImageSelection()}
                    >
                        <Image
                            source={require(addPicture)}
                            style={{
                                height: 70,
                                width: 70,
                                marginRight: 15,
                            }}
                        />
                        <View style={{

                            backgroundColor: '#C5C7C7',
                            flex: 1,
                            padding: 10,
                            borderRadius: 5,
                        }}>
                            <Text style={{
                                fontStyle: 'italic',
                                fontSize: 18,
                                color: '#8B0000',
                                backgroundColor: 'transparent',

                            }}>* (Ảnh chụp phải rõ nét, đầy đủ nơi tổ chức tình nguyện)</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <View style={{ width: 200, }}>
                            <CustomButton title='ĐĂNG BÀI' onPress={() => uploadPost()} isLoading={ButtonPress} />
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>

    );
}

export default Create
