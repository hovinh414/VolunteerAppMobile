import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, TextInput, Pressable } from 'react-native';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';
import { COLORS, SIZES } from '../constants/theme';

const CustomInputDateTime = ({ onChangeText, _value }) => {
    const convertDigitIn = (str) => {
        return str.split('/').reverse().join('/');
     }
     const getDateOfBirth = (dateOfBirth) => {
        if(!dateOfBirth) {
            return '01/01/2000';
        }
        const D = new Date(dateOfBirth);
        return D.getDate() + '/' + (D.getMonth() < 10 ?  '0' : '') + (D.getMonth() + 1) + '/' + D.getFullYear();
    }
    const [visibleCalender, setVisibleCalender] = useState(false);
    const [date, setDate] = useState();
    return (
        <React.Fragment>
            <Modal
                visible={visibleCalender}
                animationType='slide'
                onRequestClose={() => {
                    setVisibleCalender(!visibleCalender);
                }}>

                <View style={styles.datetimepicker}>
                    <Text style={styles.headerText}>Chọn ngày tháng năm sinh</Text>
                    <DatePicker
                        style={styles.datepicker}
                        mode='calendar'
                        current='2000-01-01'
                        minimumDate='1950-01-01'
                        maximumDate='2022-01-01'
                        onSelectedChange={date => { 
                            setDate(date);
                        }}
                        options={{
                            textHeaderColor: COLORS.primary,
                            textDefaultColor: COLORS.primary,
                            selectedTextColor: '#fff',
                            mainColor: COLORS.primary,
                            borderColor: 'rgba(122, 146, 165, 0.1)',
                        }}
                        
                    >

                    </DatePicker>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={styles.okeButton}
                            onPress={() => { setVisibleCalender(false) }}>
                            <Text style={styles.okeButtonText}>HỦY</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.okeButton}
                            onPress={() => { setVisibleCalender(false) }}>
                            <Text style={styles.okeButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </Modal>

            <Pressable style={styles.container} onPress={() => { setVisibleCalender(true) }}>
                <View style={styles.flexRow}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        selectTextOnFocus={false}
                        onChangeText={onChangeText}
                        value={date ? convertDigitIn(date) : getDateOfBirth(_value)}
                        
                    >

                    </TextInput>
                    <View style={styles.iconStyle}>
                        <Image
                            style={styles.icon}
                            source={require('../assets/icons8-calendar-64.png')} />
                    </View>
                </View>
            </Pressable>
        </React.Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginHorizontal: 10,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    headerText: {
        flex: 1,
        paddingHorizontal: 20,
        marginVertical: 20,
        textAlign: 'center',
        fontSize: SIZES.h3,
        fontWeight: 'bold'
    },

    datetimepicker: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginVertical: 160,

    },
    okeButton: {
        alignSelf: 'flex-end',
        marginRight: 35,
    },
    okeButtonText: {
        color: COLORS.primary,
        fontSize: SIZES.h3,
        fontWeight: 'bold'
    },
    datepicker: {
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        paddingVertical: 13,
        width: 29,
        color: '#696969',
    },
    iconStyle: {
    },
    icon: {
        width: 25,
        height: 25,
    },
    errorMessage: {
        marginHorizontal: 5,
        color: COLORS.primary
    }
});
export default CustomInputDateTime;