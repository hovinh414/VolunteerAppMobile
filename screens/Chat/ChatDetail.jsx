import React, { useState, useRef, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Image,
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

function ChatDetail({ navigation }) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [selectedImages, setSelectedImage] = useState([])
    let cameraRef = useRef()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
    const [photo, setPhoto] = useState([])

    useEffect(() => {
        ;(async () => {
            const cameraPermission =
                await Camera.requestCameraPermissionsAsync()
            const mediaLibraryPermission =
                await MediaLibrary.requestPermissionsAsync()
            setHasCameraPermission(cameraPermission.status === 'granted')
            setHasMediaLibraryPermission(
                mediaLibraryPermission.status === 'granted'
            )
        })()
    }, [])

    if (hasCameraPermission === undefined) {
        return <Text>Requesting permissions...</Text>
    } else if (!hasCameraPermission) {
        return (
            <Text>
                Permission for camera not granted. Please change this in
                settings.
            </Text>
        )
    }

    let takePic = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })

        delete result.cancelled
        if (!result.canceled) {
            if (!photo) {
                setPhoto(result.assets)
            } else {
                setPhoto([...photo, ...result.assets])
            }
        }
    }
    const handleSendMessage = () => {
        if (message) {
            setMessages([...messages, { text: message, sender: 'me' }])
            setMessage('')
        }
    }
    const handleImageSelection = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            aspect: [5, 5],
            quality: 1,
        })
        delete result.cancelled
        if (!result.canceled) {
            if (!selectedImages) {
                setSelectedImage(result.assets)
            } else {
                setSelectedImage([...selectedImages, ...result.assets])
            }
        }
    }
    function removeImage(item) {
        const newList = selectedImages.filter((listItem) => listItem !== item)
        setSelectedImage(newList)
        const newPhoto = photo.filter((listItem) => listItem !== item)
        setPhoto(newPhoto)
    }
    return (
        <KeyboardAvoidingView
            KeyboardAvoidingView
            style={styles.container}
            behavior="height"
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
                <Image source={images.friend5} style={styles.avatarDetail} />
                <Text style={{ ...FONTS.h4, marginLeft: 10 }}>Thanh Thuận</Text>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={
                            item.sender === 'me'
                                ? styles.myMessage
                                : styles.theirMessage
                        }
                    >
                        <Text
                            style={
                                item.sender === 'me'
                                    ? styles.messageMyText
                                    : styles.messageTheirText
                            }
                        >
                            {item.text}
                        </Text>
                    </View>
                )}
            />

            <View style={styles.viewIcon}>
                <View
                    style={{
                        marginTop: 12,
                        marginLeft:20,
                        marginRight:20,
                        marginBottom: 12,
                    }}
                >
                    <FlatList
                        data={[...selectedImages, ...photo]}
                        horizontal={true}
                        renderItem={({ item, index }) => (
                            <View
                                style={{
                                    position: 'relative',
                                    flexDirection: 'column',
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                key={index}
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
                                        position: 'absolute',
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

                        {message || selectedImages.length !== 0 || photo.length !== 0 ? (
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
                                <TouchableOpacity onPress={handleSendMessage}>
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

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 51,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        paddingRight: 12,
        paddingLeft: 12,
    },
    avatarDetail: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    viewIcon: {
        borderTopWidth: 0.5,
        borderColor: '#ccc',
        flexDirection: 'column',
        marginBottom: 20,
    },
    myMessage: {
        backgroundColor: COLORS.primary,
        alignSelf: 'flex-end',
        margin: 5,
        padding: 10,
        borderRadius: 20,
        marginRight: 15,
    },
    theirMessage: {
        backgroundColor: '#D3D3D3',
        alignSelf: 'flex-start',
        margin: 5,
        padding: 10,
        borderRadius: 20,
        marginLeft: 15,
    },
    messageMyText: {
        color: '#fff',
        fontSize: 16,
    },
    messageTheirText: {
        color: '#000',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 55,
        marginBottom: 12,
        marginLeft: 12,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        fontSize: 16,
        
    },
    input: {
        flex: 1,
        height: 25,
        margin: 5,
    },
    sendButton: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
}

export default ChatDetail
