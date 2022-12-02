import { View, Text, SafeAreaView, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Camera, CameraType } from "expo-camera"
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'


const CameraCard = () => {


    const [startCamera, setStartCamera] = useState(false)
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = React.useState('off')
    const [camera, setCamera] = useState(null)
    const getMicroPhonePermission = async () => {

        const { status } = await Camera.requestMicrophonePermissionsAsync()
        if (!status) {
            ToastAndroid.showWithGravity("recording audio permission denied", ToastAndroid.LONG, ToastAndroid.CENTER)
        }

    }




    useEffect(() => {
        (async () => {
            try {
                if (Camera.isAvailableAsync) {
                    getMicroPhonePermission()
                    setStartCamera(true)
                    const { status } = await Camera.requestCameraPermissionsAsync()
                    if (!status) {
                        ToastAndroid.showWithGravity("camera permission denied")
                        return;
                    }
                }
            } catch (error) {
            }

        })()
    })

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }

    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync()
        console.log(photo)
    }
    return (

        <SafeAreaView
            className="flex-1  "
        >

         
                <Camera
                    ref={(r) => setCamera(r)}
            className="flex-1 "
                >
            <View
                className="space-y-3 "
            >
                <TouchableOpacity
                    onPress={toggleCameraType}
                    className=" bg-black p-3 rounded-full"
                >
                    <Ionicons name="ios-camera-outline" size={26} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        __handleFlashMode()
                    }}
                    className=" bg-black p-3 rounded-full"
                >
                    <Ionicons name="ios-flash-outline" size={26} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                    className=" bg-black p-3 rounded-full"
                >
                    <Feather name="video" size={26} color="white" />
                </TouchableOpacity>
            </View>
        </Camera>

    


<View
    className="p-5 bg-black justify-center items-center "
>
    <TouchableOpacity
        onPress={__takePicture}

        className="bg-white h-20 w-20 rounded-full"
    >
    </TouchableOpacity>
</View>


        </SafeAreaView >

    )

}

export default CameraCard