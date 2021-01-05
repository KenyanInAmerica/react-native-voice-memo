import React from 'react';
import { SearchBar } from 'react-native-elements';
import {
    StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: "#1F1F1F",
        borderTopColor: "#1F1F1F",
        borderBottomColor: "#1F1F1F",
        borderWidth: 0,

    }
});

export const Filter = ({
    onChangeText,
    value,
}) => (
    <SearchBar
        placeholder={"Search"}
        onChangeText={onChangeText}
        value={value}
        containerStyle={styles.searchBar}
        showCancel={true}
        round={true}
        inputContainerStyle={{ backgroundColor: "#2F2F2F" }}
    />
);