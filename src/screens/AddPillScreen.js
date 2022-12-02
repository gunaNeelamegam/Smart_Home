import * as React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  ToastAndroid

} from "react-native";
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable"
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import PillSync from "../utils/PillSync";
import { connect, useDispatch } from "react-redux"
import { connected_devices, searching_devices } from "../actions/Bluetooth"
import propTypes from "prop-types"
import { SET_CONNECTED_DEVICE, SET_SCANNED_DEVICES } from "../actions/action.types";
const AddPillScreen = ({ connected_devices, searching_devices, bleState }) => {



  const navigation = useNavigation()

  const [pillName, setPillName] = useState()
  const [deviceName, setDeviceName] = useState()
  const [dosage, setDosage] = useState()
  const [onSumbit, setOnSubmit] = useState()
  const [error, setError] = useState("")
  const [onDevice, setOnDevice] = useState(false)
  const [showIndicator, setShowIndicator] = useState(false)
  const [peripheral, setPeriperal] = useState(null)

  const nameSet = new Set()




  const doSumbit = async () => {

    if (!(pillName || dosage || deviceName)) {
      return setError("All Field's Required !")
    }
    if (peripheral?.id) {
      const Status = await PillSync._connectAndRetrieve(peripheral?.id)
      connected_devices(peripheral)
      console.log("STATUS : ", Status, bleState);
    }



    //First Time Storing all the information to the Async Storage

    if (!await AsyncStorage.getItem("pill_data")) {
      const data = {
        uid: Date.now(),
        pillName,
        dosage,
        deviceName
      }

      const stringifyData = JSON.stringify([data])
      await AsyncStorage.setItem("pill_data", stringifyData)
      setDosage("")
      setPillName("")
      setOnSubmit(false)
      return

    }
    const prevData = await AsyncStorage.getItem("pill_data")
    const PillJsonData = JSON.parse(prevData)
    const data = {
      uid: Date.now(),
      pillName,
      dosage,
      deviceName
    }
    const stringifyData = JSON.stringify([...PillJsonData, data])
    await AsyncStorage.setItem("pill_data", stringifyData)


    const response = await AsyncStorage.getItem("pill_data")
    console.log(response)
    setDosage("")
    setPillName("")
    setOnSubmit(false)
  }


  const onSearchDevice = async () => {
    //start Searching for the Device
    await PillSync.getNearbyDevices([], (data) => {
      console.log("REGISTER CALLBACK = ", data)
    }, (data) => {
      console.log("UNREGISTER CALLBACK = ", data)
      if (data.name) {
        setShowIndicator(false)
        nameSet.add(data)
        setPeriperal(data)
        searching_devices(data)
        setDeviceName(data.name)
        nameSet.forEach((data) => {

        })
      }
    })
  }




  return (
    <SafeAreaView

      className="bg-white flex-1 "  >


      <View
        className=" bg-[#59a0f0] h-80 w-full rounded-b-3xl mb-5   "
      >
        <View className="p-3 m-3 flex-row justify-between" >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-circle-outline" size={30} color="white" />

          </TouchableOpacity>
          {onSumbit ? (
            <ActivityIndicator size={30} color="#FFF" />
          ) : (
            <TouchableOpacity
              className="space-x-2 flex-row"
              onPress={() => {
                doSumbit()
                setOnSubmit(data => !data)
              }}
            >

              <Feather name="check-circle" size={24} color="white" />
            </TouchableOpacity>
          )}

        </View>
        <Animatable.View
          animation="fadeIn"
          delay={1000}
          iterationCount={1}

          className="flex-1 top-3 m-auto">
          <TouchableOpacity

          >
            <Image
              source={require("../../assets/icon.png")}
              style={{
                height: 130,
                width: 130,
                resizeMode: "center"
              }}
              className="m-3 p-3"
            />
          </TouchableOpacity>
          <Text
            className="m-auto p-3 font-semibold text-white text-xl -mt-3"
          >Add Pills</Text>
        </Animatable.View>

      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-white m-3 rounded-3xl">
          {error && (
            <View>
              <Text>{error}</Text>
            </View>
          )}
          <View
            className="p-5 space-x-2 space-y-5"
          >
            <Text
              className="font-semibold  text-black text-lg"
            >
              Daily
            </Text>
            <TextInput
              value={pillName}
              onChangeText={(text) => setPillName(text)}
              placeholder="Pill Name"
              className=" rounded-md bg-gray-200 p-3"
            />
          </View>
          <View
            className="p-5 space-x-2 space-y-5"
          >
            <Text
              className="font-semibold text-black text-lg"
            >
              Device
            </Text>
            <TouchableOpacity
              onPress={async () => {
                setOnDevice(data => !data)
                if (onDevice) {
                  setDeviceName("Searching")
                  setShowIndicator(data => !data)
                  await onSearchDevice()
                } else {
                  setDeviceName("Device")
                }
              }}
            >
              <TextInput
                value={deviceName}
                editable={false}
                selectTextOnFocus={false}
                placeholder="Device"
                className=" rounded-md bg-gray-200 p-3"
              >

              </TextInput>
              {showIndicator && (
                <ActivityIndicator size={25} color="#1B98F5" />
              )}
            </TouchableOpacity>

          </View>
          <View
            className="p-5 space-x-2 space-y-5"
          >
            <Text
              className="font-semibold text-black text-lg"
            >
              Time
            </Text>
            <TextInput
              value={dosage}
              onChangeText={text => setDosage(text)}
              blurOnSubmit={true}
              keyboardType={"number-pad"}
              placeholder="Dosage "
              className=" rounded-md bg-gray-200 p-3"
            />
          </View>
        </View>
      </ScrollView>


    </SafeAreaView>


  )
}

AddPillScreen.propTypes = {
  searching_devices: propTypes.func.isRequired,
  connected_devices: propTypes.func.isRequired,
  bleState: propTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  bleState: state.bluetooth
})

const mapDispatchToProps =
{
  connected_devices: (data) => connected_devices(data),
  searching_devices: (data) => searching_devices(data),
}





export default connect(mapStateToProps, mapDispatchToProps)(AddPillScreen);


//There is an Work with the Redux and Stote the things inthe State