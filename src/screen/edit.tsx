import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TextInput, Text, TimePickerAndroid, Switch, DatePickerAndroid, TouchableWithoutFeedback } from 'react-native'
import { Db } from '../model/dbase';
import { Button } from 'react-native-elements';
import { SingleNote } from '../model/manager';
import { useNavigation, useNavigationEvents } from 'react-navigation-hooks';
import { scheduleNotif, isNotifPermission, createChannels, requestNotifPermission, cancelNotif } from '../model/notif'
import obsv from '../model/manager'
import {Icon} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
export var Edit=()=>{
    var notifId
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('')
    const [date, setDate] = useState(new Date())
    const { goBack, getParam } = useNavigation()
    const [remind, setRemind] = useState(false)
    var db = new Db()
    //db.addColumn() use this line to add column to DATABASE
    function saveToDb(){
        console.log('caller')
        var schDate = remind ? date.getTime() : null
        var note = new SingleNote(0, title, detail, schDate, undefined)
        db.newNote(note, goBack)
    }

    async function displayTime(){
        createChannels()
        try{
            var now = new Date()
            const {action, hour, minute} = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false, // Will display '2 PM'
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                
                var temp = date;
                temp.setHours(hour)
                temp.setMinutes(minute)
                setDate(temp)
                notifId = scheduleNotif({
                    time: temp.getTime(),
                    title: title,
                    detail: detail
                })
                saveToDb()
              }
        }catch({message}){
            console.warn(message)
        }
    }

    if(!isNotifPermission()){
        return(
            <View style={{flex:1, }} >
                <TouchableWithoutFeedback style={{backgroundColor: 'purple', borderRadius: 0.3,marginTop: 32}}  onPress={()=> requestNotifPermission()} >
                <Text style={{color: "white"}} >Let pda send you notifications</Text>
            </TouchableWithoutFeedback>
            </View>
            
        )
    }

    return(
        <View style={styles.view} >
            <TextInput value={title} placeholder='title..' onChangeText={text=> {setTitle(text)}} style={styles.input} />
            <TextInput value={detail} multiline placeholder='detail...' onChangeText={text=> {setDetail(text)}} style={styles.input}/>
            <View style={{flexDirection: 'row'}} >
            <Switch
                value={remind}
                onValueChange={val=> setRemind(val)}
            />
            <Text>Send me a reminder</Text>
            </View>

            <Text>{`${date.getHours()}`}:{date.getMinutes()}</Text>
                        
            <Button title="Submit" 
                onPress={()=> {
                    if(remind){
                        displayTime() 
                    }else{
                        saveToDb()
                    }
                    }} />

            <Icon
                name="md-trash"
                size={40}
                color='darkgreen'
                type='ionicon'
                onPress={()=> {
                    cancelNotif(notifId)
                    goBack()
                    }}/>
            
        </View>
    )
}

export function Update(){

    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('')
    const [date, setDate] = useState(new Date())
    const [query, updateQuery] = useState('query update')
    const { goBack, getParam } = useNavigation()
    var currentIndex = parseInt(getParam('index'))
    const note: SingleNote = obsv.list[currentIndex]
    var defaultTitle = note.title
    var defaultDefault = note.detail
    var db = new Db()

    useNavigationEvents(event=> {
        if(event.type=='didFocus' || event.type =='willFocus'){
            console.log('i')
            var schDate = new Date()
            if(note.timeStamp!= undefined) schDate.setTime(note.timeStamp)
            
            setTitle(note.title)
            setDate(date)
            setDetail(note.detail)
        }
    })
    
/*     useEffect(()=>{
        console.log('i')
        setTitle(note.title)
        setDetail(note.detail)

        {
	"resource": "/c:/Users/T430/Documents/workspace/pda/src/screen/edit.tsx",
	"owner": "typescript",
	"code": "2322",
	"severity": 8,
	"message": "Type '{ mode: \"datetime\"; }' is not assignable to type '(IntrinsicAttributes & Readonly<Readonly<ViewProps & BaseOptions & { maximumDate?: Date; minimumDate?: Date; }> & { date?: Date; locale?: string; minuteInterval?: 2 | 1 | 12 | 20 | 10 | ... 5 more ... | 30; mode?: IOSMode; timeZoneOffsetInMinutes?: number; }> & { ...; }) | (IntrinsicAttributes & ... 1 more ... & { ....'.\n  Property 'value' is missing in type '{ mode: \"datetime\"; }' but required in type 'Readonly<Readonly<ViewProps & BaseOptions & { maximumDate?: Date; minimumDate?: Date; }> & { date?: Date; locale?: string; minuteInterval?: 2 | 1 | 12 | 20 | 10 | 3 | 4 | 5 | 6 | 15 | 30; mode?: IOSMode; timeZoneOffsetInMinutes?: number; }>'.",
	"source": "ts",
	"startLineNumber": 25,
	"startColumn": 14,
	"endLineNumber": 25,
	"endColumn": 28,
	"relatedInformation": [
		{
			"startLineNumber": 25,
			"startColumn": 3,
			"endLineNumber": 25,
			"endColumn": 8,
			"message": "'value' is declared here.",
			"resource": "/c:/Users/T430/Documents/workspace/pda/node_modules/@react-native-community/datetimepicker/src/index.d.ts"
		}
	]
}
    }) */

    function saveToDb(){
        
        db.updateNote(` title='${title}', detail= '${detail}', timeStamp= '${date.getTime()}'`,`id= ${note.id}`, goBack)
    }

    var updateTitle=(text: string)=>{
        setTitle(text)
    }

    return(
        <View style={styles.view} >
            <TextInput defaultValue={defaultTitle} placeholder='title..'  onChangeText={text=> updateTitle(text)} style={styles.input} />
            <TextInput defaultValue={defaultDefault} placeholder='detail..' multiline onChangeText={text=> setDetail(text)} style={styles.input}/>
            <TouchableOpacity>
                <Text>{date}</Text>
            </TouchableOpacity>
            <Button title="Save" onPress={()=> saveToDb()} />

            
            <Icon
                name="md-trash"
                size={40}
                color='darkgreen'
                type='ionicon'
                onPress={()=> db.deleteRecord(note.id, goBack)}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view:{
        flex: 1,
        paddingTop: 25,
        padding: 12,
    },
    input:{
        fontSize:20,
        borderWidth: 1,
        margin: 10
    }
})