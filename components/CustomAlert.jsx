import React from 'react';
import { Modal, StyleSheet, Pressable, Text, View, Image } from 'react-native';

const xIcon = '../assets/red-x-icon.jpg';
const CustomAlert = ({ visible, mess, onRequestClose, onPress }) => {
    return (
        <Modal 
            visible={visible} 
            transparent
            onRequestClose={onRequestClose} 
            animationType="fade"
            onBackdropPress={() => this.hideModal()}>
                <View style={styles.containter}>
                    <Pressable onPress={onPress}>
                        <Text style={styles.message}>{mess}</Text>
                        <Image style={styles.icon} source={require(xIcon)} ></Image>
                    </Pressable>
                </View>
    
        </Modal>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1,
        maxHeight: 45,
        justifyContent: 'center',
        marginHorizontal: 30,
        marginTop: 15,
        borderRadius: 5,
        backgroundColor: '#23C552',
    },
    message: {
        fontSize: 16,
        color: 'white',
        marginLeft: 17,
    },
    icon: {
        position: 'absolute',
        marginLeft: 265,
        marginTop: 4,
        width: 16,
        height: 16,
    }
});
export default CustomAlert;