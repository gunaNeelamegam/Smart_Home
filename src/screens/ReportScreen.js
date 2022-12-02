import { View, Text, SafeAreaView, TextInput, TouchableOpacity, ScrollView, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { Calendar } from "react-native-calendars"
import ReportComponent from '../components/ReportComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import PillSync from "../utils/PillSync";






import { connect, useDispatch } from 'react-redux'
import propTypes from "prop-types"

//TODO IMPLEMENT THE MONGODB LOGIC INSIDE THE APPLIATION


const ReportScreen = ({ navigation, bleState }) => {



  const dispatch = useDispatch()


  const [onClickCalender, setOnClickCalender] = useState(false)
  const [reportData, setReportData] = useState([])


  const removeAllItem = async () => {
    await AsyncStorage.clear()
  }

  const setAllReport = async () => {
    const pillData = await AsyncStorage.getItem("pill_data")

    setReportData(JSON.parse(pillData))
  }


  const loadAllData = async () => {

    try {
      const [connectedDevice] = bleState.connectedDevice
      if (connectedDevice?.id) {
        console.log(connectedDevice.id)
        const Status = await PillSync._connectAndRetrieve(connectedDevice.id)
        const data = await PillSync.readData(connectedDevice.id, dispatch)
        console.log(data, "IN REPORT", Status)
      }
    } catch (error) {
      console.error(error.message)
    }

  }


  const focus = useIsFocused()
  useEffect(() => {

    setAllReport()
    loadAllData()
  }, [focus])




  return (
    <SafeAreaView className="flex-1 bg-white">

      <View
        className="bg-[#59a0f0] h-40 w-full rounded-b-3xl mb-2"
      >
        <View
          className="p-5 m-2"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <Text
          className="text-white font-semibold m-auto text-xl"
        >
          Daily Task
        </Text>
        <View>
        </View>
      </View>

      <View
        className="flex-1 m-5 flex-grow rounded-lg p-2  space-x-2 mt-5"
      >
        <TouchableOpacity onPress={() => {
          setOnClickCalender(data => !data)
        }}
          className="w-full bg-gray-200 rounded-lg p-3 m-2 "
        >
          <View className="justify-between flex-row">
            <Text className="ml-3 text-gray-500 font-semibold">-All-</Text>
            <Ionicons name="chevron-down-circle-outline" size={24} color="gray" />
          </View>
        </TouchableOpacity>
        {onClickCalender && (<Calendar
          className="p-2 bg-gray-200 rounded-lg"
          enableSwipeMonths={true}
          hideExtraDays={true}
          onDayPress={(date) => {
            console.log(date)
          }}

        />)}
{/* 
        <View
          className="m-3 -mr-2 "
        >
          <View
            className=" bg-gray-200 justify-between  flex-row h-10 w-full pl-3  items-center rounded-lg -ml-1 "
          >
            <Text className="text-lg font-semibold m-2  text-black">Pills</Text>
            <Text className="text-lg font-semibold m-2 text-black  ">Status</Text>
            <Text className="text-lg font-semibold m-2  text-black ">Time</Text>
          </View>
        </View> */}

        <FlatList
          className="p-1"
          showsVerticalScrollIndicator={false}
          // ListEmptyComponent={() => (<ActivityIndicator size={40} color="#1B98F5" />)}
          data={reportData}
          keyExtractor={(item) => (item.uid)}
          renderItem={({ item }) => (
            <ReportComponent data={item} />
          )}
        />
      </View>

    </SafeAreaView>
  )
}

ReportScreen.propTypes = {
  bleState: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  bleState: state.bluetooth
})

export default connect(mapStateToProps, null)(ReportScreen)


















/**
 * NOTE :
 * 
 * when even your Data is 
 * 
 * 
 * 
 * 
 * 
 */