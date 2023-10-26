import {
    View,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, images } from '../../constants'
import { MaterialIcons } from '@expo/vector-icons'
import { styles } from './ChatStyle'
import { tr } from 'date-fns/locale'

const Chat = ({ navigation }) => {
    const chat = [
        {
            id: '1',
            name: 'Lan Anh',
            image: images.friend1,
            lastMessage: 'Thành Vinh đẹp trai',
            lastMessageTime: '10 phút',
            isSeen: false,
        },
        {
            id: '2',
            name: 'Kim Khánh',
            image: images.friend2,
            lastMessage: 'Bạn: Xin chào',
            lastMessageTime: '12 phút',
            isSeen: true,
        },
        {
            id: '3',
            name: 'Trung',
            image: images.friend3,
            lastMessage: 'Đang bán cơm',
            lastMessageTime: '15 phút',
            isSeen: false,
        },
        {
            id: '4',
            name: 'Đạt',
            image: images.friend4,
            lastMessage: 'Bạn: Chào em trai thầy Toàn',
            lastMessageTime: 'Hôm qua',
            isSeen: true,
        },
        {
            id: '5',
            name: 'Thanh Thuận',
            image: images.friend5,
            lastMessage: 'Mới quay lại vui quá hehehehe',
            lastMessageTime: 'Hôm qua',
            isSeen: false,
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
                    style={{ marginRight: 8 }} // Tạo khoảng cách giữa icon và TextInput
                />
                <TextInput
                    style={styles.searchText} // Để TextInput mở rộng theo chiều ngang
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChangeText={(searchText) =>
                        handleSearchTextChange(searchText)
                    }
                />
            </View>
            <FlatList
                data={filteredChat}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={styles.chat} key={index} onPress={() => navigation.navigate('ChatDetail')}>
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
                                        {item.lastMessage}{' '}
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
                                        {item.lastMessage}{' '}
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
        </SafeAreaView>
    )
}

export default Chat
