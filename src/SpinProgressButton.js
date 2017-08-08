'use strict';


import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        width: 100,
        height:80
    }
});

const SpinProgressButton = (props) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size= {'large'} color={'red'}/>
        </View>
    );
};
export default SpinProgressButton;