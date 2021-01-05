import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,

} from 'react-native';
import moment from 'moment';
import ProgressBar from 'react-native-progress/Bar';

const screen = Dimensions.get('window');
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        padding: 10,
        flexWrap: 'wrap',
        backgroundColor: '#2F2F2F',
        borderRadius: 10
    },
    header: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    subHeading: {
        flexDirection: 'row',
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textName: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#fff',
        flex: 1
    },
    textDate: {
        color: '#6e7f8d',
        fontSize: 15,
        marginTop: 5
    },
    textTime: {
        color: '#6e7f8d',
        fontSize: 15,
        marginTop: 5
    },
    actions: {
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        width: 20,
        height: 20,
        tintColor: '#fff'
    },
    bar: {
        width: screen.width / 1.1,
    },
    progressBar: {
        width: screen.width * 0.9,
        height: 2,
        color: '#fff',
        borderWidth: 0,
    }
});


const _millisToMinutesAndSeconds = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

export const SavedRecording = ({
    name,
    date,
    onTrashPress,
    onPlayPress,
    onPausePress,
    isPlaying,
    onNamePress,
    time,
    playbackTime,
}) => (
    <View style={styles.row}>
        <View>
            <View style={styles.header}>
                <Text style={styles.textName} onPress={onNamePress}>{name}</Text>
            </View>
            <View style={styles.subHeading}>
                <Text style={styles.textDate}>
                    {moment(date).format('MMMM Do, YYYY')}
                </Text>
                <Text style={styles.textTime}>
                    {_millisToMinutesAndSeconds(time)}
                </Text>
            </View>

            <View style={styles.bar}>
                <ProgressBar
                    progress={isNaN(playbackTime / time) ? 0 : playbackTime / time}
                    width={styles.progressBar.width}
                    height={styles.progressBar.height}
                    color={styles.progressBar.color}
                    borderWidth={styles.progressBar.borderWidth}
                    useNativeDriver={true}
                    unfilledColor='#1F1F1F'

                />
            </View>

            <View style={styles.actions}>
                {
                    isPlaying ?
                        (
                            <TouchableOpacity onPress={onPlayPress}>
                                <Image
                                    style={styles.icon}
                                    source={require('../../assets/pause.png')}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={onPausePress}>
                                <Image
                                    style={styles.icon}
                                    source={require('../../assets/play.png')}
                                />
                            </TouchableOpacity>
                        )
                }
                <TouchableOpacity onPress={onTrashPress}>
                    <Image
                        style={styles.icon}
                        source={require('../../assets/trash.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    </View >
);
export const Separator = () => (
    <View style={{ height: 1, flex: 1, padding: 5 }} />
);