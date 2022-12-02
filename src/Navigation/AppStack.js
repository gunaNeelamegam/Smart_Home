import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from "@react-navigation/stack"
import BottomTab from './BottomTab'
import MyLocation from '../components/MyLocation'
import CameraCard from '../components/CameraCard'
import AlanComponent from '../components/AlanComponent'

const Stack = createStackNavigator()

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name='HomeScreen'
      component={BottomTab}
      />
      <Stack.Screen
      options={{
        presentation:"modal"
      }}
      name='MyLocation'
      component={MyLocation}
      />
      <Stack.Screen
      options={{
        presentation:"modal"
      }}
      name='CameraCard'
      component={CameraCard}
      /><Stack.Screen
      options={{
        presentation:"modal"
      }}
      name='Alan'
      component={AlanComponent}
      />

    </Stack.Navigator>
  )
}

export default AppStack