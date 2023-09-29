import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
    TextInput,
} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONTS, SIZES, images } from '../constants'
import {
    MaterialIcons,
    Ionicons,
    Feather,
    Foundation,
    MaterialCommunityIcons,
} from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { friends, posts } from '../constants/data'

const users = [images.user1, images.user2, images.user3, images.user4]

const Feed = () => {
    function renderHeader() {
        return (
            <View
                style={{
                    padding:12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            ...FONTS.body2,
                            marginRight: 4,
                        }}
                    >
                        Việc Tử Tế
                    </Text>
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={24}
                        color={COLORS.black}
                    />
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            shadowColor: '#18274B',
                            shadowOffset: {
                                width: 0,
                                height: 4.5,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 6.5,
                            elevation: 2,
                            borderRadius: 22,
                        }}
                    >
                        <Ionicons
                            name="filter"
                            size={24}
                            color={COLORS.black}
                        />
                    </TouchableOpacity>

                    <LinearGradient
                        colors={['#D4145A', '#FBB03B']}
                        style={{
                            height: 50,
                            width: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            shadowColor: '#18274B',
                            shadowOffset: {
                                width: 0,
                                height: 4.5,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 6.5,
                            elevation: 2,
                            borderRadius: 22,
                            marginLeft: 12,
                        }}
                    >
                        <Feather name="plus" size={24} color={COLORS.white} />
                    </LinearGradient>
                </View>
            </View>
        )
    }

    function renderSuggestionsContainer() {
        return (
            <View style={{
                paddingBottom:5,
                borderBottomWidth:1,
                borderBottomColor:'#fff',
            }}>
                <View style={{ marginVertical: 8 }}>
                    
                </View>

                <FlatList
                    horizontal={true}
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => console.log('Pressed')}
                                style={{
                                    paddingVertical: 4,
                                    marginLeft:12,
                                }}
                            >
                            
                                <Image
                                    source={item.image}
                                    resizeMode="contain"
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 80,
                                        borderWidth: 3,
                                    
                                        borderColor: '#FF493C',
                                    }}
                                />
                            </TouchableOpacity>
                            
                        </View>
                    )}
                />
            </View>
        )
    }

    function renderFeedPost() {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    flexDirection: 'column',
                    width: '100%',
                    borderWidth: 1,
                    borderTopColor: '#FDF6ED',
                    borderColor: '#fff',
                    marginVertical: 12,
                }}
            >
                {/* Post header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 8,
                        }}
                    >
                        <Image
                            source={images.user1}
                            style={{
                                height: 52,
                                width: 52,
                                borderRadius: 20,
                            }}
                        />

                        <View style={{ marginLeft: 12 }}>
                            <Text
                                style={{ ...FONTS.body3, fontWeight: 'bold' }}
                            >
                                Hồ Thành Vinh
                            </Text>
                            
                        </View>
                    </View>

                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={COLORS.black}
                    />
                </View>
                {/* Post image */}
                <FlatList 
                    data={friends} 
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => 
                    <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 8,
                    }}
                >
                    <Image
                            source={item.image}
                            style={{
                                height: 450,
                                width: 450,
                                marginRight:10,
                            }}
                        />
                </View>
                }/ > 

                {/* Post content */}

                <View
                    style={{
                        marginHorizontal: 8,
                        marginVertical: 8,
                    }}
                >
                    <Text style={{ ...FONTS.body4, fontWeight: 'bold' }}>
                        Hello cả nhà
                    </Text>
                    <Text style={{ ...FONTS.body4 }}>
                        Ủng hộ đồng bào lũ lụt miền trung qua momo 0967626483 nha.
                    </Text>
                </View>

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name="location-outline"
                        size={21}
                        color={COLORS.primary}
                    />
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'regular',
                            color: COLORS.primary,
                            marginLeft: 4,
                        }}
                    >
                        Thủ Đức | 10 phút trước
                    </Text>
                </View>

                {/* Posts likes and comments */}

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 6,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                                marginRight: SIZES.padding2,
                            }}
                        >
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                10
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="message-text-outline"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                03
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text
                                style={{ ...FONTS.body4, fontWeight: 'bold' }}
                            >
                                Tham gia 36/100
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                            }}
                        >
                            {users.map((user, index) => (
                                <Image
                                    source={user}
                                    key={index}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 999,
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        marginLeft: -5,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* comment section */}

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 8,
                        paddingVertical: 18,
                        borderTopWidth: 1,
                        borderTopColor: '#FFF',
                    }}
                >
                    <Image
                        source={images.user2}
                        resizeMode="contain"
                        style={{
                            height: 52,
                            width: 52,
                            borderRadius: 26,
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            height: 52,
                            borderRadius: 26,
                            borderWidth: 1,
                            borderColor: '#CCC',
                            marginLeft: 12,
                            paddingLeft: 12,
                            justifyContent: 'center',
                        }}
                    >
                        <TextInput
                            placeholder="Thêm bình luận"
                            placeholderTextColor="#CCC"
                        />
                    </View>
                </View>
            </View>
        )
    }
    function renderFeedPost1() {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    flexDirection: 'column',
                    width: '100%',
                    borderWidth: 1,
                    borderTopColor: '#FDF6ED',
                    borderColor: '#fff',
                    marginVertical: 12,
                }}
            >
                {/* Post header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 8,
                        }}
                    >
                        <Image
                            source={images.user3}
                            style={{
                                height: 52,
                                width: 52,
                                borderRadius: 20,
                            }}
                        />

                        <View style={{ marginLeft: 12 }}>
                            <Text
                                style={{ ...FONTS.body4, fontWeight: 'bold' }}
                            >
                                Lê Đỗ Thành Đạt
                            </Text>
                            
                        </View>
                    </View>

                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={COLORS.black}
                    />
                </View>
                {/* Post image */}
                <FlatList 
                    data={posts} 
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => 
                    <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 8,
                    }}
                >
                    <Image
                            source={item.image}
                            style={{
                                height: 450,
                                width: 450,
                                marginRight:10,
                            }}
                        />
                </View>
                }/ > 
                {/* Post content */}

                <View
                    style={{
                        marginHorizontal: 8,
                        marginVertical: 8,
                    }}
                >
                    <Text style={{ ...FONTS.body4, fontWeight: 'bold' }}>
                        Tao là Đạt
                    </Text>
                    <Text style={{ ...FONTS.body4 }}>
                        Hehehehehehe
                    </Text>
                </View>

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name="location-outline"
                        size={21}
                        color={COLORS.primary}
                    />
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'regular',
                            color: COLORS.primary,
                            marginLeft: 4,
                        }}
                    >
                        Phú Nhuận | 2 ngày trước
                    </Text>
                </View>

                {/* Posts likes and comments */}

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 6,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                                marginRight: SIZES.padding2,
                            }}
                        >
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                10
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="message-text-outline"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                03
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text
                                style={{ ...FONTS.body4, fontWeight: 'bold' }}
                            >
                                Tham gia 100/150
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                            }}
                        >
                            {users.map((user, index) => (
                                <Image
                                    source={user}
                                    key={index}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 999,
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        marginLeft: -5,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* comment section */}

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 8,
                        paddingVertical: 18,
                        borderTopWidth: 1,
                        borderTopColor: '#fff',
                    }}
                >
                    <Image
                        source={images.user2}
                        resizeMode="contain"
                        style={{
                            height: 52,
                            width: 52,
                            borderRadius: 26,
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            height: 52,
                            borderRadius: 26,
                            borderWidth: 1,
                            borderColor: '#CCC',
                            marginLeft: 12,
                            paddingLeft: 12,
                            justifyContent: 'center',
                        }}
                    >
                        <TextInput
                            placeholder="Thêm bình luận"
                            placeholderTextColor="#CCC"
                        />
                    </View>
                </View>
            </View>
        )
    }
    function renderFeedPost2() {
        return (
            <View
                style={{
                    backgroundColor: '#fff',
                    flexDirection: 'column',
                    width: '100%',
                    borderWidth: 1,
                    borderTopColor: '#FDF6ED',
                    borderColor: '#fff',
                    marginVertical: 12,
                }}
            >
                {/* Post header */}
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 8,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 8,
                        }}
                    >
                        <Image
                            source={images.user5}
                            style={{
                                height: 52,
                                width: 52,
                                borderRadius: 20,
                            }}
                        />

                        <View style={{ marginLeft: 12 }}>
                            <Text
                                style={{ ...FONTS.body4, fontWeight: 'bold' }}
                            >
                                Nguyễn Nguyên Trung
                            </Text>
                            
                        </View>
                    </View>

                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={COLORS.black}
                    />
                </View>
                {/* Post image */}
                <FlatList 
                    data={posts} 
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => 
                    <View
                    style={{
                        alignItems: 'center',
                        marginVertical: 8,
                    }}
                >
                    <Image
                            source={item.image}
                            style={{
                                height: 450,
                                width: 450,
                                marginRight:10,
                            }}
                        />
                </View>
                }/ >               
                {/* Post content */}

                <View
                    style={{
                        marginHorizontal: 8,
                        marginVertical: 8,
                    }}
                >
                    <Text style={{ ...FONTS.body4, fontWeight: 'bold' }}>
                        Đau mắt quá
                    </Text>
                    <Text style={{ ...FONTS.body4 }}>
                        Bị đau mắt đỏ vào ngày 25/09/2023
                    </Text>
                </View>

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name="location-outline"
                        size={21}
                        color={COLORS.primary}
                    />
                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'regular',
                            color: COLORS.primary,
                            marginLeft: 4,
                        }}
                    >
                        Quận 2 | 2 giờ trước
                    </Text>
                </View>

                {/* Posts likes and comments */}

                <View
                    style={{
                        marginHorizontal: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingBottom: 6,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                                marginRight: SIZES.padding2,
                            }}
                        >
                            <Feather
                                name="heart"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                14
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                            }}
                        >
                            <MaterialCommunityIcons
                                name="message-text-outline"
                                size={20}
                                color={COLORS.black}
                            />
                            <Text style={{ ...FONTS.body4, marginLeft: 2 }}>
                                10
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text
                                style={{ ...FONTS.body4, fontWeight: 'bold' }}
                            >
                                Tham gia 12/50
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: 10,
                            }}
                        >
                            {users.map((user, index) => (
                                <Image
                                    source={user}
                                    key={index}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        borderRadius: 999,
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        marginLeft: -5,
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* comment section */}

                <View
                    style={{
                        flexDirection: 'row',
                        marginHorizontal: 8,
                        paddingVertical: 18,
                        borderTopWidth: 1,
                        borderTopColor: '#FDF6ED',
                    }}
                >
                    <Image
                        source={images.user2}
                        resizeMode="contain"
                        style={{
                            height: 52,
                            width: 52,
                            borderRadius: 26,
                        }}
                    />

                    <View
                        style={{
                            flex: 1,
                            height: 52,
                            borderRadius: 26,
                            borderWidth: 1,
                            borderColor: '#CCC',
                            marginLeft: 12,
                            paddingLeft: 12,
                            justifyContent: 'center',
                        }}
                    >
                        <TextInput
                            placeholder="Thêm bình luận"
                            placeholderTextColor="#CCC"
                        />
                    </View>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={{ flex: 1}}>
                {renderHeader()}
                <ScrollView>
                    {renderSuggestionsContainer()}
                    {renderFeedPost()}
                    {renderFeedPost1()}
                    {renderFeedPost2()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Feed
