import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from './ChatStyle'
import { Image } from 'expo-image'
import ChatDetail from './ChatDetail'
import { IOChanel, SocketIOService } from "../../scripts/socket";
const ioService = new SocketIOService();
const socket = ioService.reqConnection({ roomId: "5894c675-3e5a-4d25-83d2-eb8eb76946ff" });

const Chat = ({ navigation }) => {
    const [room, setRoom] = useState("");
    const [username, setUsername] = useState("");
    const [showChat, setShowChat] = useState(false);
    const joinRoom = () => {
        // if (username !== "" && room !== "") {
        socket.emit("join_room", "5894c675-3e5a-4d25-83d2-eb8eb76946ff");
        setShowChat(true);
        navigation.navigate('ChatDetail', {
            socket: socket,
            room: "5894c675-3e5a-4d25-83d2-eb8eb76946ff",
        });
        // }
    };

    const chat = [
        {
            id: '1',
            name: 'Quỹ từ thiện Việt Nam',
            image: images.post4,
            lastMessage: 'Bạn cần tìm hoạt động như nào vậy?',
            lastMessageTime: '10 phút',
            isSeen: false,
        },
        {
            id: '2',
            name: 'Quỹ thiện tâm',
            image: images.post5,
            lastMessage:
                'Bạn: Cho mình xin thêm thông tin về hoạt động này với?',
            lastMessageTime: '12 phút',
            isSeen: true,
        },
        {
            id: '3',
            name: 'Sài gòn xanh',
            image: images.user7,
            lastMessage: 'Hoạt động này sẽ hết hạn đăng ký sau 10 ngày nha bạn',
            lastMessageTime: '15 phút',
            isSeen: false,
        },
        {
            id: '4',
            name: 'Đạt',
            image: images.user4,
            lastMessage: 'Bạn: Cho mình hỏi hiện tại đang có những hoạt động nào?',
            lastMessageTime: 'Hôm qua',
            isSeen: true,
        },
    ]
    const [filteredChat, setFilteredChat] = useState(chat)
    const [searchText, setSearchText] = useState('')
    const handleSearchTextChange = (text) => {
        setSearchText(text)
        // Lọc danh sách chat dựa trên tên tìm kiếm
        const filtered = chat.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        )
        setFilteredChat(filtered)
    }
    return (
        <SafeAreaView style={styles.container}>
            <>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => setShowChat(true)}>
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
                <FlatList
                    data={filteredChat}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={styles.chat}
                            key={index}
                            onPress={() => joinRoom()}
                        >
                            <View style={styles.viewChat}>
                                <Image source={item.image} style={styles.avatar} />
                                {item.isSeen ? (
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
                                        <Text style={{ fontSize: 14 }}>
                                            {' '}
                                            {item.lastMessage.length > 28
                                                ? `${item.lastMessage.slice(0, 28)}...`
                                                : item.lastMessage}
                                        </Text>
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
                                                ? `${item.lastMessage.slice(0, 28)}...`
                                                : item.lastMessage}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <View
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
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </>
        </SafeAreaView>
    );
}
export default Chat
