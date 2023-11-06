import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import {
    MaterialIcons,
    FontAwesome5,
    Ionicons,
    FontAwesome,
} from '@expo/vector-icons'
import COLOR from '../../constants/colors'
import { COLORS } from '../../constants'
const ViewDetailImage = ({ route, navigation }) => {
    const content = route.params
    return (
        <View style={{ flex: 1 }}>
            {/* Nút "Go Back" */}
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 10,
                    zIndex: 1,
                }}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={30}
                    color={COLORS.black}
                />
            </TouchableOpacity>

            {/* Hiển thị ảnh */}
            <Image
                source={{ uri: content }}
                style={{
                    flex: 1,
                    resizeMode: 'contain',
                }}
            />
        </View>
    )
}

export default ViewDetailImage
