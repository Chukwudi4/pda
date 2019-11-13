import React, { ReactNode } from 'react'
import Types from 'prop-types'
import { Text, ViewPropTypes, StyleSheet, View } from 'react-native'

export class Note extends React.Component{

    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: ViewPropTypes.style,
        text: Types.string
    }

    render(): ReactNode{

        let { text, style, textStyle } = this.props

        return(
            <View style={[styles.circle, style]} >
                <Text style={textStyle} >{text}</Text>
            </View>
        )
        
    }
}

let CIRCLE_RADIUS = 100;
let styles = StyleSheet.create({
  circle: {
    backgroundColor: "skyblue",
    width: CIRCLE_RADIUS,
    height: CIRCLE_RADIUS,
    borderRadius: 10
  }
});