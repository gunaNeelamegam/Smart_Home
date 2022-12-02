import { PermissionsAndroid } from "react-native"
import { Permission } from "expo"


export const requestPermission = async () => {

    const reponse = await PermissionsAndroid.requestMultiple(
        [
            "android.permission.ACCESS_COARSE_LOCATION",
            "android.permission.ACCESS_FINE_LOCATION",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.BLUETOOTH_SCAN",
            "android.permission.BLUETOOTH_CONNECT",
            "android.permission.BLUETOOTH_ADVERTISE",
        ]
    )
    console.log(reponse)
    Object.values(reponse).forEach(value => {
        if (value != "granted") {
        }
    })
}