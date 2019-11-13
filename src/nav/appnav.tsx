import { createStackNavigator } from 'react-navigation-stack'
import { Home } from '../screen/home'
import { Edit, Update } from '../screen/edit'
import { createAppContainer } from 'react-navigation'

const stack = createStackNavigator({
    Home:{
        screen: Home,
    },
    Edit:{
        screen: Edit
    },
    Update:{
        screen: Update
    }
})

export const Container = createAppContainer(stack)