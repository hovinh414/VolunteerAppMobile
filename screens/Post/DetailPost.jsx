import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    SafeAreaView,
    KeyboardAvoidingView,
    Image,
    FlatList,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { COLORS, FONTS, SIZES } from '../../constants/theme'
import * as Progress from 'react-native-progress'
import {
    MaterialIcons,
    FontAwesome5,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import { friends, posts } from '../../constants/data'
import { SliderBox } from 'react-native-image-slider-box'

const DetailPost = ({ navigation, route }) => {
    const items = route.params
    function DaysDifference({ exprirationDate }) {
        const [daysDifference, setDaysDifference] = useState(null)

        useEffect(() => {
            const currentDate = new Date()
            const targetDate = new Date(exprirationDate)
            const timeDifference = targetDate - currentDate
            const daysDifference = Math.floor(
                timeDifference / (1000 * 60 * 60 * 24)
            )
            setDaysDifference(daysDifference)
        }, [exprirationDate])

        if (daysDifference === null) {
            return null // Hoặc thay thế bằng UI mặc định khác nếu cần
        }
        if (daysDifference <= 0) {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                >
                    Đã hết hạn đăng ký
                </Text>
            )
        } else {
            return (
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: '500',
                    }}
                >
                    {daysDifference} ngày
                </Text>
            )
        }
    }
    const handleNavigate = data => {
        // console.log(item)
        navigation.navigate('ViewDetailImage', data);
      };
    return (
        <ScrollView
            style={{
                backgroundColor:'#fff'
            }}
        >
            <View style={{ flex: 1, marginBottom: 15 }}>
                {/* <FlatList
                    data={items.media}
                    horizontal={true}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: 430,
                                    height: 300,
                                }}
                            />
                        </View>
                    )}
                /> */}
                <SliderBox
                    images={items.media}
                    paginationBoxVerticalPadding={5}
                    activeOpacity={1}
                    dotColor={COLORS.primary}
                    inactiveDotColor={COLORS.white}
                    sliderBoxHeight={300}
                    dotStyle={{ width: 7, height: 7 }}
                />
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        position: 'absolute',
                        top: 50,
                        left: 20,
                        borderRadius: 50,
                        backgroundColor: '#cccc',
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={26}
                        color={COLORS.black}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 15,
                }}
            >
                <View style={{ flexDirection: 'row', marginRight: 70 }}>
                    <View
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 20,
                            backgroundColor: '#DC143C',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8,
                        }}
                    >
                        <FontAwesome name="group" size={18} color="#fff" />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#696969',
                                marginBottom: 4,
                            }}
                        >
                            Số tình nguyện viên
                        </Text>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '500',
                            }}
                        >
                            {items.participants} người
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View
                        style={{
                            width: 35,
                            height: 35,
                            borderRadius: 20,
                            backgroundColor: '#20B2AA',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 8,
                        }}
                    >
                        <FontAwesome5
                            name="calendar-alt"
                            size={18}
                            color="#fff"
                        />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text
                            style={{
                                fontSize: 14,
                                color: '#696969',
                                marginBottom: 4,
                            }}
                        >
                            Thời gian còn lại
                        </Text>
                        <DaysDifference
                            exprirationDate={items.exprirationDate}
                        />
                    </View>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        margin: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Ionicons
                        name="location-outline"
                        size={22}
                        color="#696969"
                    />
                    <Text
                        style={{
                            fontSize: 13,
                            color: '#696969',
                            marginLeft: 4,
                            marginRight: 15,
                        }}
                    >
                        {items.address}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 15,
                    paddingBottom: 15,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        marginTop: 4,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            color: '#696969',
                        }}
                    >
                        Đăng bởi:
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: COLORS.primary,
                            marginLeft: 4,
                            marginRight: 15,
                            fontWeight: 'bold',
                        }}
                    >
                        {items.ownerDisplayname}{' '}
                        <FontAwesome
                            name="check-circle"
                            size={15}
                            color={COLORS.primary}
                        />
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    paddingHorizontal: 15,
                }}
            >
                <Progress.Bar
                    progress={36 / items.participants}
                    color="#FF493C"
                    height={8}
                    width={SIZES.width - 45}
                    unfilledColor="#D3D3D3"
                    borderColor="#F5F5F5"
                    borderRadius={25}
                />
                <Text
                    style={{
                        paddingVertical: 10,
                        color: '#696969',
                    }}
                >
                    Đã tham gia:
                    <Text
                        style={{
                            fontSize: 14,
                            color: COLORS.primary,
                            marginLeft: 8,
                            marginRight: 15,
                            fontWeight: 'bold',
                        }}
                    >
                        {' '}
                        36/{items.participants} người
                    </Text>
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 15,
                }}
            >
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
                                    padding: 3,
                                }}
                            >
                                <Image
                                    source={item.image}
                                    contentFit="contain"
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 50,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    paddingTop: 25,
                    paddingHorizontal: 15,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 15,
                    }}
                >
                    Câu chuyện
                </Text>
                <Text
                    style={{
                        fontSize: 16,
                        textAlign: 'justify',
                    }}
                >
                    {items.content}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'column',
                    paddingTop: 25,
                    paddingHorizontal: 15,
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        marginBottom: 15,
                    }}
                >
                    Ảnh/Video
                </Text>
                <FlatList
                    style={{
                        marginBottom: 15,
                    }}
                    horizontal={true}
                    data={items.media}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'column',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 4,
                                }}
                                onPress={() => handleNavigate(item)}
                            >
                                <Image
                                    source={{ uri: item }}
                                    style={{
                                        paddingVertical: 4,
                                        width: 100,
                                        height: 100,
                                        borderRadius: 10,
                                        marginRight: 8,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                <View
                    style={{
                        marginBottom: 50,
                    }}
                >
                    <CustomButton
                        onPress={() => console.log('OK')}
                        title="THAM GIA"
                    />
                </View>
            </View>
        </ScrollView>
    )
}

export default DetailPost
