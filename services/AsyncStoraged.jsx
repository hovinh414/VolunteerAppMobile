import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStoraged {
    storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('Authorized', jsonValue);
        } catch (error) {
            console.error('Store' + error);
        }
    }

    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('Authorized')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('get store', error);
        }
    }

    removeData = async () => {
        try {
            await AsyncStorage.removeItem('Authorized');
        } catch (e) {
            console.error(e);
        }
        console.log('Done.')
    }

    getToken = async () => {
        let jwt = '';
        await AsyncStorage.getItem('Authorized')
            .then((data) => { jwt = data.token; })
            .catch(error => { console.error(error); });
        return jwt;
    };

    storeDataBykey = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue);
        } catch (error) {
            console.error('Store' + error);
        }
    }
    getDataByKey = async (postKey) => {
        try {
            const jsonValue = await AsyncStorage.getItem(postKey)
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error('get store', error);
        }
    }
}
export default new AsyncStoraged();