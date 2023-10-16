import React from 'react';
import { Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomButton from './CustomButton';
const success = '../assets/success.png';
const fail = '../assets/cross.png';
const ModalAlert = ({ onRequestClose, visible, mess, icon, press }) => {
    return (
        <Modal
            visible={visible}
            animationType='fade'
            transparent
            onRequestClose={() =>
                onRequestClose
            }
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
            >
                <View
                    style={{
                        width: 300,
                        height: 200,
                        backgroundColor: '#ffffff',
                        borderRadius: 25,
                        alignItems: 'center', // Đảm bảo nội dung nằm ở giữa
                        justifyContent: 'center', //
                    }}
                >
                    {icon === 'SUCCESS' ?
                        <Image
                            source={require(success)}
                            style={{
                                marginTop: 15,
                                width: 50,
                                height: 50,
                            }}
                        />
                        :
                        <Image
                            source={require(fail)}
                            style={{
                                marginTop: 15,
                                width: 50,
                                height: 50,
                            }}
                        />

                    }
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                    }}>Thông báo</Text>
                    <Text style={{
                        fontSize: 16,
                    }}>{mess}</Text>

                    <View style={{
                        marginTop: 30,
                        width: 200,
                    }}>
                        <CustomButton title='ĐÓNG' onPress={() => press} />
                    </View>
                </View>


            </View>
        </Modal>
    )
}

export default ModalAlert;