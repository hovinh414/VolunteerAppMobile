import React, { useRef, useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Animated,
    Button,
    TouchableOpacity,
    Dimensions,
} from 'react-native'
import { AntDesign, Entypo } from '@expo/vector-icons'

const ModalAlert = () => {
    const windowHeight = Dimensions.get('window').height
    const popAnim = useRef(new Animated.Value(windowHeight * -1)).current
    const [status, setStatus] = useState(null);
    const successColor = '#6dcf81'
    const successHeader = 'Thành công!'
    const successMessage = 'Thành công nha'
    const failColor = '#bf6060'
    const failHeader = 'Thất bại!'
    const failMessage = 'Thất bại rồi'
    const warningColor = '#FFE600'
    const warningHeader = 'Cảnh báo!'
    const warningMessage = 'Cảnh cáo mày'

    const popIn = () => {
        Animated.timing(popAnim, {
            toValue: windowHeight * 0.35 * -1,
            duration: 300,
            useNativeDriver: true,
        }).start(popOut())
    }

    const popOut = () => {
        setTimeout(() => {
            Animated.timing(popAnim, {
                toValue: windowHeight * -1,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }, 2000)
    }

    const instantPopOut = () => {
        Animated.timing(popAnim, {
            toValue: windowHeight * -1,
            duration: 150,
            useNativeDriver: true,
        }).start()
    }

    return (
        <View>
            <Animated.View
                style={[
                    styles.toastContainer,
                    {
                        transform: [{ translateY: popAnim }],
                    },
                ]}
            >
                <View style={styles.toastRow}>
                    <AntDesign
                        name={
                            status === 'success'
                                ? 'checkcircleo'
                                : status === 'fail'
                                ? 'closecircleo'
                                : 'exclamationcircleo'
                        }
                        size={24}
                        color={
                            status === 'success'
                                ? successColor
                                : status === 'fail'
                                ? failColor
                                : warningColor
                        }
                    />
                    <View style={styles.toastText}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                            {status === 'success'
                                ? successHeader
                                : status === 'fail'
                                ? failHeader
                                : warningHeader}
                        </Text>
                        <Text style={{ fontSize: 12 }}>
                            {status === 'success'
                                ? successMessage
                                : status === 'fail'
                                ? failMessage
                                : warningMessage}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={instantPopOut}>
                        <Entypo name="cross" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </Animated.View>
            <Button
                title="Success Message"
                onPress={() => {
                    setStatus('success')
                    popIn()
                }}
                style={{ marginTop: 30 }}
            ></Button>
            <Button
                title="Fail Message"
                onPress={() => {
                    setStatus('fail')
                    popIn()
                }}
                style={{ marginTop: 30 }}
            ></Button>
        </View>
    )
}

export default ModalAlert

const styles = StyleSheet.create({
    toastContainer: {
        height: 60,
        width: 350,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    toastRow: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    toastText: {
        width: '70%',
        padding: 2,
    },
})
