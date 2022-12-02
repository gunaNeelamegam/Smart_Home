import * as Location from "expo-location"


import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const MyLocation = () => {

  const [myLocation, setmyLocation] = useState()

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({
        mayShowUserSettingsDialog: true
      })
      setmyLocation(JSON.stringify(location.coords))
    })()
  }, [])


  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Text className="text-black font-bold h-25">
      {myLocation}

      </Text>

    </View>
  )
}

export default MyLocation