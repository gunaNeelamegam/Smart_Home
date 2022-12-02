import { ALL_RECIVICED_DATA, SET_CONNECTED_DEVICE, SET_SCANNED_DEVICES, SET_ERROR, IS_CONNECTED, SET_TIMESTAMP } from "../actions/action.types"


let intialState = {
    isDeviceConneted: false,
    connectedDevice: [],
    receivedData: null,
    scannedDevices: [],
    error: false,
    isLoading: false,
    timeStamp: []
}


export default (state = intialState, action) => {
    switch (action.type) {
        case SET_CONNECTED_DEVICE:
            return {
                ...state,
                connectedDevice: [...state.connectedDevice, action.payload],
                isDeviceConneted: true,
                error: false,
                isLoading: false,

            }
        case IS_CONNECTED:
            return {
                ...state,
                isLoading: action.payload,
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case SET_SCANNED_DEVICES:
            return {
                ...state,
                scannedDevices: [...state.scannedDevices, action.payload]
            }
        case ALL_RECIVICED_DATA:
            return {
                ...state,
                receivedData: action.payload
            }
        case SET_TIMESTAMP:
            return {
                ...state,
                timeStamp: [...state.timeStamp, action.payload]
            }
        default:
            return state
    }

}