import { View, Text, Image, useWindowDimensions, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import { Feather, AntDesign, Ionicons } from '@expo/vector-icons'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { posts } from '../../constants/data'
import AsyncStoraged from '../../services/AsyncStoraged'
import * as ImagePicker from "expo-image-picker";
import ImageAvata from "../../assets/hero2.jpg"
import ImageUpload from "../../assets/photo.png"
import axios from 'axios';
const PostsRoute = () => (
    <View
        style={{
            flex: 1,
            paddingTop: 12,
        }}
    >
        <FlatList
            data={posts}
            numColumns={3}
            renderItem={({ item, index }) => (
                <View
                    style={{
                        flex: 1,
                        aspectRatio: 1,
                        margin: 3,
                    }}
                >
                    <Image
                        key={index}
                        source={item.image}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 12,
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 4,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                            }}
                        >
                            <Ionicons
                                name="eye"
                                size={14}
                                color={COLORS.white}
                            />
                            <Text style={{ color: COLORS.white }}>
                                {item.numOfViews}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color={COLORS.white}
                            />
                            <Text style={{ color: COLORS.white }}>
                                {item.numOfViews}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        />
    </View>
)

const VerifyRoute = (navigation) => {
    const [selectedImage, setSelectedImage] = useState('');
    const [avatar, setAvatar] = useState();
    const [orgId, setOrgId] = useState();
    const [token, setToken] = useState();
    const [username, setUsername] = useState('');


    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData();
        setOrgId(userStored._id);
        setToken(userStored.accessToken);
        setUsername(userStored.username);
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
    const formData = new FormData();
    const randomNum = Math.floor(Math.random() * (10000 - 10 + 1)) + 10;
    const handleUpload = async () => {
        if (!avatar) {
            Alert.alert('Thông báo', 'Vui lòng chọn ảnh!', [

                { text: 'OK' },
            ]);
            return;
        }

        formData.append('images', {
            uri: avatar,
            type: 'image/jpeg',
            name: username + orgId + randomNum,
        });
        axios.put(('http://192.168.1.6:3000/api/v1/org/verify?orgId=' + orgId), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token,
            },
        })
            .then((response) => {

                if (response.data.status === 'SUCCESS') {
                    Alert.alert('Thông báo', 'Đăng minh chứng thành công!', [

                        { text: 'OK', onPress: () => navigation.push('BottomTabNavigation') },
                    ]);

                }
            })
            .catch((error) => {
                console.error('API Error:', error);
            });

    }
    return (
        <ScrollView style={{ flex: 1, paddingTop: 25, }}>
            <TouchableOpacity
                style={{
                    paddingBottom: 15,
                    flex: 1,
                    justifyContent: 'center', // căn giữa theo chiều dọc
                    alignItems: 'center'
                }}
                onPress={() => handleImageSelection()}
            >
                <Image
                    source={avatar ? { uri: avatar } : ImageUpload}
                    style={{
                        height: 350,
                        width: 350,
                        borderRadius: 15,
                    }}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={{
                    backgroundColor: COLORS.primary,
                    height: 44,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={() => handleUpload()}
            >
                <Text
                    style={{
                        fontFamily: 'bold',
                        color: '#FFF',
                    }}
                >
                    ĐĂNG MINH CHỨNG
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const renderScene = SceneMap({
    first: PostsRoute,
    second: VerifyRoute,
})
const ProfileOrganisation = ({ navigation }) => {
    const [avatar, setAvatar] = useState("");
    const [fullname, setFullname] = useState("");
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData();
        setAvatar(userStored.avatar);
        setFullname(userStored.fullname);
        setAddress(userStored.address);
        setEmail(userStored.email);
    }
    useEffect(() => { getUserStored(); }, []);
    function renderProfileCard() {
        return (
            <View
                style={{
                    width: SIZES.width - 44,
                    height: 200,
                    marginHorizontal: 22,
                    paddingHorizontal: 6,
                    paddingVertical: 18,
                    backgroundColor: '#FFFFFF',


                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    {/* Profile image container */}
                    <View>
                        <Image
                            source={avatar ? { uri: avatar } : ImageAvata}
                            resizeMode="contain"
                            style={{
                                height: 90,
                                width: 90,
                                borderRadius: 80,
                                borderWidth: 4,
                                borderColor: '#ffffff',
                            }}
                        />
                    </View>

                    <View
                        style={{
                            flexDirection: 'column',
                            flex: 1,
                            marginLeft: 6,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >

                        </View>

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                            }}
                        >


                            <View
                                style={{
                                    backgroundColor: '#FFF9E8',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    padding: 15,
                                }}
                            >
                                <Text style={{ ...FONTS.body4 }}>Đã tổ chức 24 hoạt động</Text>
                            </View>

                        </View>

                    </View>
                    <Feather
                        style={{

                            paddingLeft: 10,
                        }}
                        name="menu"
                        size={24}
                        color={COLORS.black}
                        onPress={() => navigation.navigate("Settings")}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'column',
                        marginVertical: 12,
                    }}
                >
                    <Text style={{ ...FONTS.body4 }}>{fullname}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body4 }}>Email: </Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.blue }}>
                            @{email}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...FONTS.body4 }}>Địa chỉ: </Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.blue }}>
                            {address}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'first', title: 'Hoạt động', icon: 'team' },
        { key: 'second', title: 'Đăng minh chứng', icon: 'upload' },

    ])

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={{
                backgroundColor: COLORS.primary,
            }}
            renderIcon={({ route, focused, color }) => (
                <AntDesign
                    name={route.icon}
                    size={20}
                    color={focused ? COLORS.black : 'gray'}
                />
            )}
            style={{
                backgroundColor: '#fff',
                height: 64,
            }}
            renderLabel={({ focused, route }) => (
                <Text style={[{ color: focused ? COLORS.black : 'gray' }]}>
                    {route.title}
                </Text>
            )}

        />
    )

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#fff',
            }}
        >
            <View style={{ flex: 1 }}>
                {renderProfileCard()}
                <View
                    style={{
                        flex: 1,
                        marginHorizontal: 22,
                    }}
                >
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={{ width: layout.width }}
                        renderTabBar={renderTabBar}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ProfileOrganisation
