import React from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    StatusBar,
    FlatList,
    Dimensions,
    Alert
} from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import { uid } from 'uid';

// component imports
import { SavedRecording, Separator } from './components/savedRecording';
import { ButtonDef, ButtonRec } from './components/recordButton';
import { Filter } from './components/search';

// storage import
import { getRecentRecordings, addRecording, removeRecording, updateName } from './util/recordings'

const screen = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeareaSTORE: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 8,
    },
    safeareaRECORD: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
        backgroundColor: "#2F2F2F",
        width: screen.width,

    },
    safeareaSEARCHBAR: {
        width: '90%',
        marginBottom: 6
    },
});

export default class App extends React.Component {

    state = {
        recording: null,
        isRecording: false,
        isPlaying: false,
        recordings: [],
        currentlyPlaying: null,
        paused: false,
        playbackTime: 0,
        filter: ''
    }

    componentDidMount() {
        this.icon1 = require('../assets/button_def.png');
        this.icon2 = require('../assets/button_record.png');
        Permissions.askAsync(Permissions.AUDIO_RECORDING)
            .then(async ({ status }) => {
                this.setState({
                    recordings: await getRecentRecordings(this.state.filter)
                });
                if (status !== "granted") {
                    throw new Error("Permission to access audio was denied");
                }
            })
            .then(() => {
                return Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    staysActiveInBackground: false,
                    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                    playThroughEarpieceAndroid: false,
                })
            })
            .then(() => {
                this.setState({
                    recordOptions: Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
                })
            });
    }

    startRecording = async () => {
        if (this.state.isPlaying) return null;
        this.setState({
            recording: new Audio.Recording(),
            isRecording: true,
            isPlaying: false
        }, async () => {
            Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
            });
            if (this.state.recording) {
                await this.state.recording.prepareToRecordAsync(this.recordOptions);
                await this.state.recording.startAsync();
            }
        });
    }

    stopRecording = async () => {
        if (this.state.isPlaying) return null;
        if (this.state.recording) {
            await this.state.recording.stopAndUnloadAsync();
            await addRecording({
                id: uid(),
                uri: this.state.recording._uri,
                name: `New Recording ${this.state.recordings.length + 1}`,
                time: this.state.recording._finalDurationMillis,
                date: new Date(),
            });
        }
        this.setState({
            isRecording: false,
            recording: null,
            recordings: await getRecentRecordings(this.state.filter)
        });
    }

    deleteRecording = (id) => {
        if (this.state.isPlaying || this.state.isRecording) return null;
        removeRecording(id)
            .then(async () => {
                return getRecentRecordings(this.state.filter)
            })
            .then((recordings) => {
                this.setState({
                    recordings,
                })
            });
    }

    playbackInstance = null;

    playPause = async (uri) => {
        if (this.state.isRecording) return null;
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        if (this.playbackInstance !== null && this.state.isPlaying) {
            await this.playbackInstance.pauseAsync();
            this.setState({
                isPlaying: false,
                currentlyPlaying: null,
                paused: true
            });
        } else {
            if (this.state.paused) {
                this.setState({
                    isPlaying: true,
                    currentlyPlaying: uri,
                    paused: false
                });
                await this.playbackInstance.playAsync();
            } else {
                this.setState({
                    isPlaying: true,
                    currentlyPlaying: uri
                }, async () => {
                    const initialStatus = {
                        shouldPlay: false,
                        rate: 1.0,
                        shouldCorrectPitch: true,
                        volume: 1.0,
                        isMuted: false
                    };
                    const { sound, status } = await Audio.Sound.createAsync(
                        { uri },
                        initialStatus
                    );
                    sound.setProgressUpdateIntervalAsync(80);
                    sound.setOnPlaybackStatusUpdate(async (status) => {
                        this.setState({
                            playbackTime: status.positionMillis
                        });
                        if (status.didJustFinish === true) {
                            await sound.unloadAsync();
                            this.setState({
                                isPlaying: false,
                                currentlyPlaying: null,
                                playbackTime: 0
                            });
                            this.playbackInstance = null;
                        }
                    })
                    this.playbackInstance = sound;
                    this.playbackInstance.setIsLoopingAsync(false);
                    await this.playbackInstance.playAsync();
                })
            }
        };
    }

    rename = (id, name) => {
        Alert.prompt(
            "Edit Name",
            name,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: newName => updateName(id, newName).then(async () => {
                        this.setState({
                            recordings: await getRecentRecordings(this.state.filter)
                        })
                    })

                }
            ],
        );
    }

    setFilter = (filter) => {
        this.setState({
            filter,
        }, async () => {
            this.setState({
                recordings: await getRecentRecordings(this.state.filter)
            })
        });
    };


    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SafeAreaView style={styles.safeareaSEARCHBAR}>
                    <Filter
                        onChangeText={this.setFilter}
                        value={this.state.filter}
                    />
                </SafeAreaView>
                <SafeAreaView style={styles.safeareaSTORE}>
                    <FlatList
                        data={this.state.recordings}
                        renderItem={({ item }) => (
                            <SavedRecording
                                {...item}
                                name={item.name}
                                date={item.date}
                                onTrashPress={() => this.deleteRecording(item.id)}
                                onPlayPress={() => this.playPause(item.uri)}
                                onPausePress={() => this.playPause(item.uri)}
                                isPlaying={this.state.currentlyPlaying === item.uri}
                                onNamePress={() => this.rename(item.id, item.name)}
                                time={item.time}
                                playbackTime={this.state.currentlyPlaying === item.uri ? this.state.playbackTime : 0}
                            />
                        )}
                        ItemSeparatorComponent={() => <Separator />}
                        keyExtractor={item => item.id}
                    />
                </SafeAreaView>
                <SafeAreaView style={styles.safeareaRECORD}>
                    {
                        this.state.isRecording ?
                            (
                                <ButtonRec onPress={() => this.stopRecording()} icon={this.icon2} />
                            ) : (
                                <ButtonDef onPress={() => this.startRecording()} icon={this.icon1} />
                            )
                    }
                </SafeAreaView>
            </View >
        )
    }
}