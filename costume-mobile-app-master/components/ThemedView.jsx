import {SafeAreaView, StyleSheet, Text, useColorScheme, View} from 'react-native'
import React from 'react'
import {colors} from "../Constants/Colors";
const ThemedView = ( {style ,  ...props}) => {
    const colorScheme  = useColorScheme()
    const theme = colors[colorScheme] ?? colors.light

    return (
        <View style={[{backgroundColor:theme.background} ,style ]}
            {...props}
        />

    )
}
export default ThemedView
const styles = StyleSheet.create({})
