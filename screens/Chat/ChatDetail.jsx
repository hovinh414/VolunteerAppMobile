import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView,
} from 'react-native'

import {
    MaterialIcons,
    FontAwesome,
    Feather,
    Ionicons,
} from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { COLORS, FONTS, images } from '../../constants'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'
import * as DocumentPicker from 'expo-document-picker'
import { styles } from './ChatDetailStyle'
import { Image } from 'expo-image'

import AsyncStoraged from '../../services/AsyncStoraged'
import { io } from 'socket.io-client'

const file = '../../assets/file.png'
const video = '../../assets/video.png'
// const socket = SocketIOClient('http://192.168.1.10:3200', {
//   transports: ['websocket'] // you need to explicitly tell it to use websockets
// });
function ChatDetail({ route, navigation}) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [token, setToken] = useState('')
    const [avatar, setAvatar] = useState('')
    const [fullname, setFullname] = useState('')
    const [userId, setUserId] = useState();
    const [selectedImages, setSelectedImage] = useState([])
    let cameraRef = useRef()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const { socket, room } = route.params;
    // const ioService = new SocketIOService();
    // const socket = ioService.reqConnection({ roomId: "5894c675-3e5a-4d25-83d2-eb8eb76946ff" });
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }
    useEffect(() => {
        getToken();
        console.log(`socket: ${socket}`)
        console.log(`room: ${room}`)
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        setAvatar(userStored.avatar)
        setFullname(userStored.fullname)
        setUserId(userStored._id);
    }
    useEffect(() => {
        getUserStored()
    }, [])
    // useEffect(() => {
    //     // const ioService = new SocketIOService();
    //     // const socket = ioService.reqConnection({ roomId: 21 });
    //     socket.on(IOChanel.JOIN_CHAT, (response) => {
    //         if (response?.metadata?.username) {
    //           addViewerIfNotExists(response.metadata.username);
    //           console.error(`response from be: ${response}`)
    //         }
    //         sender= response.metadata.username;
    //       });
    // })
    // useEffect(() => {
    //     ;(async () => {
    //         const cameraPermission =
    //             await Camera.requestCameraPermissionsAsync()
    //         const mediaLibraryPermission =
    //             await MediaLibrary.requestPermissionsAsync()
    //         setHasCameraPermission(cameraPermission.status === 'granted')
    //         setHasMediaLibraryPermission(
    //             mediaLibraryPermission.status === 'granted'
    //         )
    //     })()
    // }, [])

    // if (hasCameraPermission === undefined) {
    //     return <Text>Requesting permissions...</Text>
    // } else if (!hasCameraPermission) {
    //     return (
    //         <Text>
    //             Permission for camera not granted. Please change this in
    //             settings.
    //         </Text>
    //     )
    // }

    let takePic = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
        }

        // let result = await ImagePicker.launchCameraAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     allowsMultipleSelection: true,
        //     aspect: [5, 5],
        //     quality: 1,
        // })

        delete result.cancelled
        if (!result.canceled) {
            if (!photo) {
                setPhoto(result.assets)
            } else {
                setPhoto([...photo, ...result.assets])
            }
        }
    }
    const handleSendMessage = async () => {
        if (message !== "") {
            const messageData = {
            //   room: room,
              avatar: avatar,
              fullname: fullname,
              message: message,
              time: new Date(),
              userId: userId
            };
      
            await socket.emit("send_message", messageData);
            setMessages((list) => [...list, messageData]);
            setMessage("");
          }
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            try {
                setMessages((list) => [...list, data]);
                console.log(`Received data: ${JSON.stringify(data)}`);
            } catch (error) {
                console.error('Error handling received message:', error);
            }
        });
    }, []);
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        console.log(result)
        if (!result.canceled) {
            if (!selectedImages) {
                setSelectedImage(result.assets)
            } else {
                setSelectedImage([...selectedImages, ...result.assets])
            }
        }
    }
    function removeItems(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
        const newPhoto = photo.filter((listItem) => listItem !== item)
        setPhoto(newPhoto)
        const file = selectedFiles.filter((listItem) => listItem !== item)
        setSelectedFiles(file)
    }
    const pickDocument = async () => {
        const result = await DocumentPicker.getDocumentAsync()
        console.log(result)
        if (!result.canceled) {
            if (!selectedFiles) {
                setSelectedFiles(result.assets)
            } else {
                setSelectedFiles([...selectedFiles, ...result.assets])
            }
        } else {
        }
    }

    return (
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={30}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
                <Image source={images.post5} style={styles.avatarDetail} />
                <Text style={{ ...FONTS.h4, marginLeft: 10 }}>
                    Quỹ thiện tâm
                </Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <View
                            style={
                                item.userId === userId
                                    ? styles.myMessage
                                    : styles.theirMessage
                            }
                        >
                            <Text
                                style={
                                    item.userId === userId
                                        ? styles.messageMyText
                                        : styles.messageTheirText
                                }
                            >
                                {item.message}
                            </Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.viewIcon}>
                <View style={styles.viewListImage}>
                    <FlatList
                        data={[...selectedImages, ...photo]}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <View style={styles.viewImage} key={index}>
                                <Image
                                    source={{ uri: item.uri }}
                                    style={styles.image}
                                />
                                <TouchableOpacity
                                    onPress={() => removeItems(item)}
                                    style={styles.btnRemoveImage}
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

                    <FlatList
                        data={selectedFiles}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.viewFile}
                                key={index}
                            >
                                <View style={styles.file}>
                                    {item.mimeType === 'video/mp4' ? (
                                        <Image
                                            source={require(video)}
                                            style={styles.fileIcon}
                                        />
                                    ) : item.mimeType === 'image/jpeg' ? (
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={styles.fileIcon}
                                        />
                                    ) : (
                                        <Image
                                            source={require(file)}
                                            style={styles.fileIcon}
                                        />
                                    )}
                                    <Text style={styles.fileName}>
                                        {item.name}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeItems(item)}
                                    style={styles.btnRemoveFile}
                                >
                                    <MaterialIcons
                                        name="delete"
                                        size={15}
                                        color={COLORS.black}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 15,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            marginLeft: 10,
                        }}
                        onPress={takePic}
                    >
                        <Feather
                            name="camera"
                            size={25}
                            color={'#696969'}
                            style={{ marginRight: 5, marginLeft: 5 }} // Tạo khoảng cách giữa icon và TextInput
                        />
                    </TouchableOpacity>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập nội dung tin nhắn"
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                        />

                        {message ||
                        selectedImages.length !== 0 ||
                        photo.length !== 0 ? (
                            <TouchableOpacity onPress={handleSendMessage}>
                                <FontAwesome
                                    name="send"
                                    size={25}
                                    color={COLORS.primary}
                                    style={{ marginRight: 8 }} // Tạo khoảng cách giữa icon và TextInput
                                />
                            </TouchableOpacity>
                        ) : (
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                <TouchableOpacity
                                    onPress={handleImageSelection}
                                >
                                    <Ionicons
                                        name="image-outline"
                                        size={25}
                                        color={'#696969'}
                                        style={{ marginRight: 12 }} // Tạo khoảng cách giữa icon và TextInput
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={pickDocument}>
                                    <Feather
                                        name="paperclip"
                                        size={25}
                                        color={'#696969'}
                                        style={{ marginRight: 8 }} // Tạo khoảng cách giữa icon và TextInput
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default ChatDetail
