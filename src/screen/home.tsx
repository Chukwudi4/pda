import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { Note } from './note'
import { Icon } from 'react-native-elements'
import { useNavigation, useNavigationEvents } from 'react-navigation-hooks'
import { Db } from '../model/dbase'
import { observer } from 'mobx-react'
import obsv from '../model/manager'


export var Home= observer(()=>{
    let db = new Db()
    let { navigate } = useNavigation()
    useNavigationEvents(event=> {
        if(event.type=='didFocus'){
            db.viewNotes()
        }
    })

    let list = obsv.list

    return(
        
        <View style={styles.view} >
            <Note style={styles.note} text="Finish my course" textStyle={styles.textStyling} />
            <ScrollView>
            {list.map((note, index)=> 
            <TouchableOpacity onPress={()=> navigate('Update', {index: `${index}`})} >
                <Note key={index} style={styles.note} text={note.title} textStyle={styles.textStyling} />
            </TouchableOpacity>
                
            )}
            </ScrollView>
            <TouchableOpacity onPress={()=> navigate("Edit")} style={styles.addButton}>
                <Icon name="add" size={30} />
            </TouchableOpacity>
        </View>
    )
})

let styles = StyleSheet.create({
    view:{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        paddingTop: 44
    },
    note:{
        backgroundColor: 'lightgreen',
        justifyContent:'center',
        alignItems:'center'
    },
    textStyling:{
        color: 'red',
        fontSize: 20,
    },
    addButton:{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'lightgreen',
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        bottom: 30,
        right: 30
    }
})