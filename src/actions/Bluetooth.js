import { ALL_RECIVICED_DATA, SET_SCANNED_DEVICES, SET_CONNECTED_DEVICE, ALL_TRANSMITTED_DATA, SET_TIMESTAMP } from "./action.types.js"


export const searching_devices = (data) => ({
    type: SET_SCANNED_DEVICES,
    payload: data
})

export const connected_devices = (data) => ({
    type: SET_CONNECTED_DEVICE,
    payload: data
})

export const all_transmitted_data = (data) => ({
    type: ALL_TRANSMITTED_DATA,
    payload: data
})

export const all_recivied_data = (data) => ({
    type: ALL_RECIVICED_DATA,
    payload: data
})
export const set_timeStamp = (data) => ({
    type: SET_TIMESTAMP,
    payload: data

})