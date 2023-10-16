import { StyleSheet } from 'react-native';
import COLOR from '../../constants/colors';
export const styles = StyleSheet.create({
    post: {
        width: '100%',
        marginTop: 50,
        marginHorizontal: 10,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    }
    ,
    profile: {
        display: 'flex',
        flexDirection: 'row'
    }
    ,

    profile_img: {
        height: 70,
        width: 70,
        borderRadius: 50,
        margin: 10
    },

    profile_details: {
        height: 70,
        paddingTop: 24,
        display: 'flex',
        justifyContent: 'space-evenly',
    },
    author: {
        // fontFamily: Roboto_900Black,
        fontWeight: '600',
        fontSize: 20
    },
    checkin: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 7
    },
    checkinText: {
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'italic',
    }
    ,
    checkinIcon: {
        width: 20,
        height: 20,
        opacity: 0.7
    },
    content: {

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        flex: 1,
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    button: {
        marginHorizontal: 16,
    },
    content_detail: {
        height: 150,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLOR.primary,

    },
    headerInput: {
        paddingVertical: 10,
        marginHorizontal: 10,
        fontSize: 18,
        // fontWeight: '500'
    },
    address: {
        height: 35,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: COLOR.primary,
    },
    people: {
        height: 35,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: 'white',
        shadowColor: '#c5c5c5',
        shadowOpacity: 1,
        width: 300,
        borderRadius: 5
    },
    addPicture: {
        width: 60,
        height: 60,
        borderRadius: 5,
    },
    address_people: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});