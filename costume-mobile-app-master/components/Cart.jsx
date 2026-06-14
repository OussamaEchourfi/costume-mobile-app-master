import { Image, TouchableOpacity, StyleSheet } from 'react-native';

const FloatingLogo = () => {
    return (
        <TouchableOpacity style={styles.floatingPicture1}>
            <Image
                source={require('../assets/cartsuit.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingPicture1: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 8,           // Border thickness
        borderColor: 'black',     // Border color
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
});