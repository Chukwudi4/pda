import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import { ToastAndroid } from 'react-native'

export async function requestNotifPermission(){
    let {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if(status!= "granted"){
        return false
    }

    return true
}

export async function isNotifPermission(){
    let { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)

    if(status != "granted"){
        return requestNotifPermission()
    }

    return true
}

export function createChannels(){
    Notifications.createChannelAndroidAsync('todo', {
        name: 'Upcoming tasks',
        badge: true,
        sound: true,
        vibrate: true,
        priority: "high"
    })
}

export async function cancelNotif(id: number){
    await Notifications.cancelScheduledNotificationAsync(id)
}

export async function scheduleNotif(notif){

    var notifer = Notifications.scheduleLocalNotificationAsync({
        title: notif.title,
        
        body: notif.detail.slice(0, 15) + '...',
        android:{
            channelId: 'todo',
            color: 'peach',
        },
    },{
        time: notif.time
    })
    console.warn(notif)
    return notif
}