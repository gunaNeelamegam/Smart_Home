import { View, Text, Image } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AntDesign, FontAwesome5, Fontisto, Ionicons, MaterialIcons, Octicons, SimpleLineIcons } from '@expo/vector-icons';
//Screens

import AddPillScreen from "../screens/AddPillScreen"
import ReportScreen from "../screens/ReportScreen"
import DownloadScreen from "../screens/DownloadScreen"
const Tab = createBottomTabNavigator()
import HomeScreen from '../screens/HomeScreen'
//screen's inside the App

const BottomTab = () => {
    return (
        <Tab.Navigator
            initialRouteName='Home'

            screenOptions={
                {
                    tabBarStyle: {
                        backgroundColor: "#59a0f0",
                        height: 60
                    },
                    tabBarHideOnKeyboard: true,
                    headerShown: false,
                    tabBarLabel: ({ color, position }) => false,
                    tabBarActiveTintColor: "#FFF",


                }
            }

        >
            <Tab.Screen

                options={{
                    tabBarIcon: ({ focused, color, size }) => (<AntDesign name="home" size={size} color={focused ? color : "#000"} />)
                }}
                name='Home'
                component={HomeScreen}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ focused, color, size }) => (<MaterialIcons name="add-task" size={size}color={focused ? color : "#000"} />)
                }}
                name='AddPillScreen'
                component={AddPillScreen}
            />
            <Tab.Screen
                options={{
                    tabBarIcon: ({ color, focused, size }) => (<FontAwesome5 name="tasks" size={size}color={focused ? color : "#000"} />)
                }}
                name='ReportScreen'
                component={ReportScreen}
            /><Tab.Screen
                options={{
                    tabBarIcon: ({ size, focused, color }) => (

                        <SimpleLineIcons  name="cloud-download" size={24} color={focused ? color : "#000"} />
                    )
                }}
                name='DownloadScreen'
                component={DownloadScreen}
            />

        </Tab.Navigator>

    )
}

export default BottomTab