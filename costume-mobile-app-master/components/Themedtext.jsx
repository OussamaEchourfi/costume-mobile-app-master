import React from 'react';
import { Text, StyleSheet } from 'react-native';

const ThemedText = ({
                        children,
                        style,
                        type = 'body',
                        ...props
                    }) => {
    return (
        <Text style={[styles[type], style]} {...props}>
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    body: {
        fontSize: 16,
        color: '#000',
    },
    caption: {
        fontSize: 14,
        color: '#666',
    },
    util:{
        fontSize:13,
        color:"#000",
        opacity:0.8,
        fontWeight:'500'
    }
});

export default ThemedText;