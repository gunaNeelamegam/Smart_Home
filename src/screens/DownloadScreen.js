import { View, Text, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'
import { shareAsync } from "expo-sharing"
import { cacheDirectory, documentDirectory, FileSystemUploadType, getInfoAsync, makeDirectoryAsync } from "expo-file-system"
import * as XLSX from "xlsx";
import AsyncStorage from '@react-native-async-storage/async-storage'

const DownloadScreen = () => {

  const createWorkbook = () => {
    return XLSX.utils.book_new()
  }

  //data processing
  const addDataToSheet = async () => {
    let data = await AsyncStorage.getItem("pill_data")
    const jsonData = await JSON.parse(data)
    return XLSX.utils.json_to_sheet(jsonData)
  }


  const Save = async () => {

    try {

      const wb = createWorkbook()
      const sheet = await addDataToSheet()
      XLSX.utils.book_append_sheet(wb, sheet, "Pill_Data", true)
      var wopts = { bookType: 'xlsx', bookSST: false, type: "" };

      var wbout = await XLSX.writeXLSX(wb, {
        bookSST: false,
        bookType: "xlsx",
         type: "binary"
      })
      ToastAndroid.showWithGravity("File Saved Successfully", ToastAndroid.LONG, ToastAndroid.CENTER)
    } catch (error) {
      console.log(error);
    }

  }

  const share = async () => {
    try {
      //DATA for file is not invoked here 
      const Info = await getInfoAsync(documentDirectory + `/Pills`)
      if (!Info.exists) {
        await makeDirectoryAsync(documentDirectory + `/Pills`)
      }
      await shareAsync(`${documentDirectory}/Pills/${new Date()}.csv`, {
        UTI: "public.item"
      })
    } catch (error) {
      console.log("SHARING FILE ERROR")
    }

  }



  return (
    <SafeAreaView className="flex-1 bg-white p-5 ">
      <View className="justify-evenly flex-1 flex-row items-center space-x-5 absolute bottom-4">
        <View className="m-5 p-5">
          <TouchableOpacity onPress={share}>
            <Ionicons name="share-outline" size={24} color="#1B98F5" />
            <Text className="font-semibold">Share</Text>
          </TouchableOpacity>
        </View>
        <View className="m-5 p-5">
          <TouchableOpacity onPress={Save}>
            <Feather name="save" size={24} color="#1B98F5" />
            <Text className="font-semibold">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  )
}

export default DownloadScreen