import { AsyncStorage } from "react-native";

const KEY = "@VoiceMemoApp/recordings";

export const getRecentRecordings = (filter) =>
    AsyncStorage.getItem(KEY).then(str => {
        if (str) {
            const recordings = JSON.parse(str);
            if (filter === '' || !filter) {
                return recordings;
            }
            return recordings.filter(
                existingItem => existingItem.name.toLowerCase().includes(filter.toLowerCase())
            );
        }
        return [];
    });

export const addRecording = item =>
    getRecentRecordings().then(history => {
        const oldHistory = history.filter(
            existingItem => existingItem.id !== item.id
        );
        const newHistory = [item, ...oldHistory];
        return AsyncStorage.setItem(KEY, JSON.stringify(newHistory));
    });

export const removeRecording = id =>
    getRecentRecordings().then(history => {
        const updatedHistory = history.filter(
            existingItem => existingItem.id !== id
        );
        return AsyncStorage.setItem(KEY, JSON.stringify(updatedHistory));
    });

export const updateName = (id, name) =>
    getRecentRecordings().then(history => {
        for (let i = 0; i < history.length; i++) {
            if (id === history[i].id) {
                history[i].name = name
            }
        }
        return AsyncStorage.setItem(KEY, JSON.stringify(history));
    }); 