import React, { useState, useEffect } from "react";
import {
    Image,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    Linking
} from "react-native";
import { FontAwesome, } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable"
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location"
import propType from "prop-types"
import { connect } from "react-redux";
import PillSync from "../utils/PillSync";



const Home = ({ bleState, navigation }) => {


    const isFocused = useIsFocused()
    const [locationStatus, setLocationStatus] = useState()


    const enableLocation = async () => {
        try {
            if (Platform.OS === "android") {
                const providerStatus = await Location.getProviderStatusAsync()
                setLocationStatus(providerStatus.locationServicesEnabled)
                if (!providerStatus.locationServicesEnabled) {
                    await Location.getCurrentPositionAsync({
                        mayShowUserSettingsDialog: true
                    })

                }
            } else {
                const providerStatus = await Location.getProviderStatusAsync()
                if (!providerStatus.locationServicesEnabled) {
                    //await Linking.openSettings(":app-settings")
                    await Location.getCurrentPositionAsync({
                        mayShowUserSettingsDialog: true
                    })
                }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        enableLocation()
        PillSync.init()
        PillSync.getNearbyDevices();
    }, [isFocused])

    return (
        <View>
            <SafeAreaView className="flex-0  bg-[#59a0f0]"></SafeAreaView>
            <SafeAreaView className="bg-white flex-1 " style={[]} >
                <View className="space-x-2 space-y-5  ">

                    <View
                        className="flex-1  absolute bg-[#59a0f0] h-80 w-full rounded-b-3xl  "
                    >
                        <View className="p-3 m-3" >
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Alan")}
                            >
                                <FontAwesome name="user-o" size={25} color="white" />
                            </TouchableOpacity>
                        </View>
                        <Animatable.View
                            animation="fadeIn"
                            delay={1000}
                            iterationCount={1}

                            className="flex-1 top-3  m-auto">
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
                            >My Home</Text>
                        </Animatable.View>
                    </View>

                    {/**Create the FlatList to Iterate Over that Tablet that  */}
                </View>




            </SafeAreaView>
        </View>

    )
}


Home.propType = {
    bleState: propType.object.isRequired
}

const mapStateToProps = (state) => ({
    bleState: state.bluetooth
})



export default connect(mapStateToProps, null)(Home);





