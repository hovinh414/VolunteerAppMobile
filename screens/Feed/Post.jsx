import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    FlatList,
    TextInput,
    RefreshControl,
    Share,
} from 'react-native'
import * as Progress from 'react-native-progress'
import React, { useState, useEffect, useCallback } from 'react'
import CommentModal from '../../components/CommentModal'
import { COLORS, FONTS, SIZES, images } from '../../constants'
import API_URL from '../../interfaces/config'
import {
    MaterialIcons,
    Ionicons,
    Feather,
    FontAwesome,
    MaterialCommunityIcons,
    Fontisto,
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { friends, posts } from '../../constants/data'
import { SliderBox } from 'react-native-image-slider-box'
import DaysDifference from './DaysDifference'
import LongText from './LongText'
import { Image } from 'expo-image'
import axios from 'axios'
import ImageAvata from '../../assets/hero2.jpg'
import AsyncStoraged from '../../services/AsyncStoraged'
import { format } from 'date-fns'
import ModalLoading from '../../components/ModalLoading'
const share = '../../assets/share.png'
const Post = ({
    posts,
    joinedPost,
    fetchNextPage,
    refreshing,
    onRefresh,
    headers,
    footer,
}) => {
    const [token, setToken] = useState('')
    const [orgId, setOrgId] = useState('')
    const [typePost, setTypePost] = useState('normal')
    const [type, setType] = useState()
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [showComment, setShowComment] = useState(false)
    const getToken = async () => {
        const token = await AsyncStoraged.getToken()
        setToken(token)
    }

    useEffect(() => {
        getToken()
    }, [])
    const getUserStored = async () => {
        const userStored = await AsyncStoraged.getData()
        if (userStored) {
            setType(userStored.type)
            setOrgId(userStored._id)
        } else {
            setType(null)
            setOrgId(null)
        }
    }
    useEffect(() => {
        getUserStored()
    }, [])
    const likePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'post',
                url: API_URL.API_URL + '/post/like',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }
    const unLikePost = async (_postId) => {
        try {
            const res = await axios({
                method: 'put',
                url: API_URL.API_URL + '/post/unlike',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                data: {
                    postId: _postId,
                },
            })
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }

    const [postIdComment, setPostIdComment] = useState('')
    const [postLikes, setPostLikes] = useState({})
    const [isLike, setIsLike] = useState([])

    const checkLikes = async (postId) => {
        try {
            const res = await axios({
                method: 'get',
                url: API_URL.API_URL + '/post/like/' + postId,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
            })

            if (res.data.message === 'User not like this post before') {
                setIsLike((prevLikes) => [
                    ...prevLikes,
                    { postId: postId, likeStatus: 0 },
                ])
            } else {
                setIsLike((prevLikes) => [
                    ...prevLikes,
                    { postId: postId, likeStatus: 1 },
                ])
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchLikes = async (postId) => {
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/likes/' + postId
            )

            if (response.data.status === 'SUCCESS') {
                setPostLikes((prevLikes) => ({
                    ...prevLikes,
                    [postId]: response.data.data.totalLikes,
                }))
            }
        } catch (error) {
            console.log('API get total like Error:', error)
        }
    }

    const handleLikeClick = async (postId) => {
        try {
            if (
                isLike.find((like) => like.postId === postId)?.likeStatus === 1
            ) {
                await unLikePost(postId)
                setIsLike((prevLikes) => [
                    ...prevLikes.filter((like) => like.postId !== postId),
                    { postId: postId, likeStatus: 0 },
                ])
            } else {
                await likePost(postId)
                setIsLike((prevLikes) => [
                    ...prevLikes.filter((like) => like.postId !== postId),
                    { postId: postId, likeStatus: 1 },
                ])
            }

            // Fetch updated likes after like/unlike
            await fetchLikes(postId)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        // Check if the user is logged in before fetching likes
        if (token && posts.length > 0) {
            // Iterate through the posts and fetch likes for each post
            posts.forEach(async (post) => {
                await checkLikes(post._id)
                await fetchLikes(post._id)
            })
        } else {
            // Handle the case when the user is not logged in
            // You can add any additional logic here if needed
            console.log('User is not logged in.')
        }
    }, [token, posts])

    const viewDetailPost = async (_postId) => {
        setLoading(true)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/post/' + _postId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate('DetailPost', response.data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log('API Error:', error)
            setLoading(false)
        }
    }

    const viewProfile = async (_orgId) => {
        setLoading(true)
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
        }
        try {
            const response = await axios.get(
                API_URL.API_URL + '/profile/' + _orgId,
                config
            )
            if (response.data.status === 'SUCCESS') {
                navigation.navigate(
                    'ProfileUser',
                    response.data.data.profileResult
                )
                setLoading(false)
            }
        } catch (error) {
            console.log('API Error:', error)
            setLoading(false)
        }
    }
    const removeHashtagsAndUrlsFromContent = (content) => {
        // Regex để tìm kiếm ký tự # và URL
        const hashtagRegex = /#/g
        const urlRegex = /https?:\/\/[^\s]+/g

        // Thay thế tất cả các ký tự # bằng chuỗi trống
        const contentWithoutHashtags = content.replace(hashtagRegex, '')
        // Thay thế tất cả các URL bằng chuỗi trống
        const contentWithoutUrls = contentWithoutHashtags.replace(urlRegex, '')

        return contentWithoutUrls
    }
    function extractUrlsFromContent(content) {
        const urlRegex = /https?:\/\/[^\s]+/g
        const urls = content.match(urlRegex)
        return urls || []
    }
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        const formattedDate = new Date(dateString).toLocaleDateString(
            'en-US',
            options
        )
        return formattedDate
    }
    const sharePost = async (post) => {
        try {
            const cleanedContent = removeHashtagsAndUrlsFromContent(
                post.content
            )
            let mediaContent = ''

            // Duyệt qua mảng media và thêm từng URL vào nội dung chia sẻ
            post.media.forEach((mediaUrl, index) => {
                mediaContent += `Hình ${index + 1}: ${mediaUrl}\n`
            })
            const formattedDate = format(
                new Date(post.exprirationDate),
                'dd-MM-yyyy'
            )
            const result = await Share.share({
                message: `${cleanedContent} \n\nĐịa điểm: ${post.address}\nThời hạn: ${formattedDate}\nSố người tham gia: ${post.participants}`,
                url: extractUrlsFromContent(post.content),
            })
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log(
                        'Share with activity type: ',
                        result.activityType
                    )
                } else {
                    console.log('shared')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed')
            }
        } catch (error) {
            console.error('Error sharing post:', error.message)
        }
    }

    return (
        <View>
            <CommentModal
                visible={showComment}
                onRequestClose={() => setShowComment(false)}
                postId={postIdComment}
            />
            <ModalLoading visible={loading} />
            <FlatList
                data={posts}
                ListHeaderComponent={headers}
                showsVerticalScrollIndicator={false}
                onEndReached={fetchNextPage}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListFooterComponent={footer}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: '#fff',
                            flexDirection: 'column',
                            width: '100%',
                            borderWidth: 1,
                            borderTopColor: '#cccc',
                            borderColor: '#fff',
                            marginVertical: 12,
                        }}
                    >
                        {/* Post header */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 12,
                                paddingBottom: 10,
                            }}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: 8,
                                }}
                                onPress={
                                    item.ownerId === orgId
                                        ? () =>
                                              navigation.navigate(
                                                  'ProfileOrganisation'
                                              )
                                        : () => viewProfile(item.ownerId)
                                }
                            >
                                <Image
                                    source={item.ownerAvatar}
                                    style={{
                                        height: 52,
                                        width: 52,
                                        borderRadius: 26,
                                    }}
                                />

                                <View style={{ marginLeft: 12 }}>
                                    <Text
                                        style={{
                                            ...FONTS.body5,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {item.ownerDisplayname}
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <MaterialCommunityIcons
                                name="dots-vertical"
                                size={24}
                                color={COLORS.black}
                            />
                        </TouchableOpacity>
                        <View>
                            <SliderBox
                                images={item.media}
                                paginationBoxVerticalPadding={5}
                                activeOpacity={1}
                                dotColor={COLORS.primary}
                                inactiveDotColor={COLORS.white}
                                sliderBoxHeight={500}
                                dotStyle={{ width: 7, height: 7 }}
                                onCurrentImagePressed={() =>
                                    viewDetailPost(item._id)
                                }
                                // resizeMode={'contain'}
                            />

                            {/* <FlatList
                                    data={item}
                                    horizontal
                                    renderItem={({ item, index }) => (
                                        <View
                                            style={{
                                                alignItems: 'center',
                                                marginVertical: 8,
                                            }}
                                            key={index}
                                        >
                                            <Image
                                                source={item.media}
                                                style={{
                                                    height: 450,
                                                    width: 450,
                                                    marginRight: 10,
                                                }}
                                            />
                                        </View>
                                    )}
                                /> */}
                        </View>

                        <View
                            style={{
                                marginHorizontal: 8,
                                marginVertical: 8,
                            }}
                        >
                            {item.content.length > 100 ? (
                                <LongText
                                    maxLength={150}
                                    content={item.content}
                                />
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 16,
                                        textAlign: 'justify',
                                    }}
                                >
                                    {item.content}
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => viewDetailPost(item._id)}
                        >
                            <View
                                style={{
                                    paddingLeft: 10,
                                    paddingBottom: 5,
                                }}
                            >
                                <View
                                    style={{
                                        paddingVertical: 10,
                                        marginTop: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View
                                        activeOpacity={0.8}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.black,
                                                fontSize: 15,
                                                marginLeft: 5,
                                            }}
                                        >
                                            Đã tham gia:{' '}
                                            <Text
                                                style={{
                                                    color: COLORS.primary,
                                                    fontSize: 15,
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {item.totalUserJoin} /{' '}
                                                {item.participants}
                                            </Text>
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            flexDirection: 'row',
                                            marginRight: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: COLORS.primary,
                                                fontSize: 15,
                                                marginLeft: 10,
                                            }}
                                        >
                                            {(
                                                (item.totalUserJoin /
                                                    item.participants) *
                                                100
                                            ).toFixed(0)}{' '}
                                            %
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Progress.Bar
                                    progress={
                                        item.totalUserJoin / item.participants
                                    }
                                    color="#FF493C"
                                    height={8}
                                    width={SIZES.width - 20}
                                    unfilledColor="#F5F5F5"
                                    borderColor="#F5F5F5"
                                    borderRadius={25}
                                />
                            </View>
                            <View
                                style={{
                                    margin: 12,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="location-outline"
                                    size={22}
                                    color={COLORS.primary}
                                />
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontFamily: 'regular',
                                        color: COLORS.primary,
                                        marginLeft: 4,
                                        marginRight: 10,
                                    }}
                                >
                                    {item.address}
                                </Text>
                            </View>
                            <View
                                style={{
                                    marginHorizontal: 8,
                                    marginBottom: 8,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={21}
                                    color={COLORS.blue}
                                />
                                <DaysDifference
                                    exprirationDate={item.exprirationDate}
                                />
                            </View>
                        </TouchableOpacity>

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
                                {token ? (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',

                                                alignItems: 'center',
                                                marginRight: SIZES.padding2,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleLikeClick(item._id)
                                                }
                                            >
                                                {isLike.find(
                                                    (like) =>
                                                        like.postId ===
                                                            item._id &&
                                                        like.likeStatus === 1
                                                ) ? (
                                                    <FontAwesome
                                                        name="heart"
                                                        size={28}
                                                        color={COLORS.primary}
                                                    />
                                                ) : (
                                                    <Feather
                                                        name="heart"
                                                        size={28}
                                                        color={COLORS.black}
                                                    />
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowComment(true)
                                                    setPostIdComment(item._id)
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name="comment-text-outline"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => sharePost(item)}
                                                style={{
                                                    flexDirection: 'row',

                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Feather
                                                    name="send"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                ...FONTS.body5,
                                                marginLeft: 5,
                                                marginTop: 8,
                                            }}
                                        >
                                            {postLikes[item._id] || 0} lượt
                                            thích
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: 'column' }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',

                                                alignItems: 'center',
                                                marginRight: SIZES.padding2,
                                            }}
                                        >
                                            <TouchableOpacity
                                                onPress={() =>
                                                    navigation.navigate(
                                                        'LoginScreen'
                                                    )
                                                }
                                            >
                                                <Feather
                                                    name="heart"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate(
                                                        'LoginScreen'
                                                    )
                                                }}
                                                style={{
                                                    flexDirection: 'row',
                                                    marginHorizontal: 8,
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <MaterialCommunityIcons
                                                    name="comment-text-outline"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => sharePost(item)}
                                                style={{
                                                    flexDirection: 'row',

                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Feather
                                                    name="send"
                                                    size={28}
                                                    color={COLORS.black}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                ...FONTS.body5,
                                                marginLeft: 5,
                                                marginTop: 8,
                                            }}
                                        >
                                            {postLikes[item._id] || 0} lượt
                                            thích
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                {type !==
                                'User' ? null : !joinedPost ? null : joinedPost.includes(
                                      item._id
                                  ) ? (
                                    <View
                                        style={{
                                            backgroundColor: '#ccc',
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body5,
                                                color: 'black',
                                            }}
                                        >
                                            Đã tham gia
                                        </Text>
                                    </View>
                                ) : item.isExprired ? (
                                    <View
                                        style={{
                                            backgroundColor: '#cccc',
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body5,
                                                color: 'black',
                                            }}
                                        >
                                            Đã hết hạn
                                        </Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: COLORS.primary,
                                            borderRadius: 10,
                                            padding: 5,
                                        }}
                                        onPress={() => viewDetailPost(item._id)}
                                    >
                                        <Text
                                            style={{
                                                ...FONTS.body5,
                                                color: 'white',
                                            }}
                                        >
                                            Tham Gia
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

export default Post
