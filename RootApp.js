import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from "@react-navigation/native"
import { useFonts } from "expo-font"
import AppStack from './src/Navigation/AppStack'
import App from "./src/App"
import { Provider } from "react-redux"
import store from './src/store'
import { AlanView } from '@alan-ai/alan-sdk-react-native';





const RootApp = () => {



    return (

        <NavigationContainer>
            <Provider store={store}>
                <App />
                <AlanView projectid={'c9c6c16cdb64dc882b0698937f6b20632e956eca572e1d8b807a3e2338fdd0dc/stage'} />
            </Provider>
        </NavigationContainer>


    )
}

export default RootApp