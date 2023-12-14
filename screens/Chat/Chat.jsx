import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from './ChatStyle'
import { Image } from 'expo-image'
import axios from 'axios'
import AsyncStoraged from '../../services/AsyncStoraged'
import { IOChanel, SocketIOService } from '../../scripts/socket'
import API_URL from '../../interfaces/config'
const ioService = new SocketIOService()

const Chat = ({ navigation }) => {
    const [roomId, setRoomId] = useState('')

    const [isLoading, setIsLoading] = useState(true)
    const [showChat, setShowChat] = useState(false)
    const joinRoom = (item) => {
        // if (username !== "" && room !== "") {
        const socket = ioService.reqConnection({
            roomId: item.groupid,
        })
        socket.emit('join_room', item.groupid)
        setShowChat(true)
        navigation.navigate('ChatDetail', {
            socket: socket,
            room: item.groupid,
            data: item,
        })
        // }
    }
    const [token, setToken] = useState('')
    const [filteredChat, setFilteredChat] = useState([])
    const [searchText, setSearchText] = useState('')
    const handleSearchTextChange = (text) => {
        setSearchText(text)
        // Lọc danh sách chat dựa trên tên tìm kiếm
        const filtered = filteredChat.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        )
        setFilteredChat(filtered)
    }
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const getGroupChats = async () => {
        setIsLoading(true)
        const config = {
            headers: {
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/groups/join',
                config
            )

            if (response.data.status === 'SUCCESS') {
                setFilteredChat(response.data.data)
            }
        } catch (error) {
            console.log('API Error get group:', error)
        }
    }
    useEffect(() => {
        getGroupChats()
    }, [token])
    return (
        <SafeAreaView style={styles.container}>
            <>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons
                            name="keyboard-arrow-left"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>
                    <Text style={{ ...FONTS.h4, marginLeft: 8 }}>Tin nhắn</Text>
                </View>
                <View style={styles.searchInput}>
                    <MaterialIcons
                        name="search"
                        size={20}
                        color={'#ccc'}
                        style={{ marginRight: 8 }}
                    />
                    <TextInput
                        style={styles.searchText}
                        placeholder="Tìm kiếm..."
                        value={searchText}
                        onChangeText={handleSearchTextChange}
                    />
                </View>
                {filteredChat.length === 0 ? (
                    <ActivityIndicator size={'large'} visible={isLoading} />
                ) : (
                    <FlatList
                        data={filteredChat}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.chat}
                                key={index}
                                onPress={() => joinRoom(item)}
                            >
                                <View style={styles.viewChat}>
                                    <Image
                                        source={item.avatar}
                                        style={styles.avatar}
                                    />
                                    {token ? (
                                        <View style={{ marginLeft: 12 }}>
                                            <Text
                                                style={{
                                                    ...FONTS.h3,
                                                    fontSize: 16,
                                                    marginBottom: 6,
                                                }}
                                            >
                                                {' '}
                                                {item.name}{' '}
                                            </Text>
                                            {/* <Text style={{ fontSize: 14 }}>
                                            {' '}
                                            {item.lastMessage.length > 28
                                                ? `${item.lastMessage.slice(
                                                      0,
                                                      28
                                                  )}...`
                                                : item.lastMessage}
                                        </Text> */}
                                        </View>
                                    ) : (
                                        <View style={{ marginLeft: 12 }}>
                                            <Text
                                                style={{
                                                    ...FONTS.h3,
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                    marginBottom: 6,
                                                }}
                                            >
                                                {' '}
                                                {item.name}{' '}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {' '}
                                                {item.lastMessage.length > 28
                                                    ? `${item.lastMessage.slice(
                                                          0,
                                                          28
                                                      )}...`
                                                    : item.lastMessage}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {/* <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text style={{ fontSize: 13, color: '#777' }}>
                                    {' '}
                                    {item.lastMessageTime}{' '}
                                </Text>
                                {item.isSeen ? (
                                    <Text
                                        style={{
                                            fontSize: 30,
                                            color: 'white',
                                            marginRight: 5,
                                        }}
                                    >
                                        •
                                    </Text>
                                ) : (
                                    <Text
                                        style={{
                                            fontSize: 35,
                                            color: '#FF493C',
                                            marginRight: 5,
                                        }}
                                    >
                                        •
                                    </Text>
                                )}
                            </View> */}
                            </TouchableOpacity>
                        )}
                    />
                )}
            </>
        </SafeAreaView>
    )
}
export default Chat
