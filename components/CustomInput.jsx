import React from 'react';
import {View,Text, TextInput, StyleSheet, Image } from 'react-native';
import {COLORS, SIZES} from '../constants/theme';

const CustomInput = ({value, placeholder, keyboardType, secureTextEntry, onChangeText, error, errorMessage}) => {
    return(
        <React.Fragment>
        <View style={{
                        width: "100%",
                        height: 48,
                        borderColor: error ? COLORS.primary : COLORS.black,
                        borderWidth: 1,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        paddingLeft: 22
                    }}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.black}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                style={{
                    width: "100%"
                }}/>
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    
    errorMessage: {
        paddingTop:4,
        marginHorizontal: 5,
        color: COLORS.primary
    }
});
export default CustomInput;