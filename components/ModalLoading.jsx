import React, { useRef, useState } from 'react'
import { Modal, Image, View, TouchableOpacity } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COLORS } from '../constants'


const loading = '../assets/loading.gif'
const ModalLoading = ({ visible, onRequestClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            >
                <Image source={require(loading)} style={{width:70, height:70}}/>
            </View>
        </Modal>
    )
}

export default ModalLoading
