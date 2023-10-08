import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';
const CustomButton = ({ onPress, title, isLoading }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{
            backgroundColor: COLORS.primary,
            height: 44,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
        }}>
            {isLoading ?
                <ActivityIndicator size='small' color='white' /> :
                <Text style={{
                    fontFamily: 'bold',
                    color: '#FFF',
                }}>{title}</Text>}
        </TouchableOpacity>
    )
}

export default CustomButton;