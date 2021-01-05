import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Image } from 'react-native';


const screen = Dimensions.get('window');
const styles = StyleSheet.create({
    buttonDef: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25
    },
    buttonRec: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 25
    },
});

export const ButtonDef = ({
    onPress = () => { },
    icon
}) => (
    <TouchableOpacity onPress={onPress} >
        <Image
            style={styles.buttonDef}
            source={icon}
        />
    </TouchableOpacity>
);

export const ButtonRec = ({
    onPress = () => { },
    icon
}) => (
    <TouchableOpacity onPress={onPress} >
        <Image
            style={styles.buttonRec}
            source={icon}
        />
    </TouchableOpacity>
);