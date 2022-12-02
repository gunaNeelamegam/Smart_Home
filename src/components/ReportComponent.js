import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ReportComponent = ({ data }) => {

    const [isClicked, setIsClicked] = useState(false)

    const deletePill = async () => {

    }


    return (
        <View className="flex-1 mt-2 p-6 bg-gray-100 h-18  rounded-lg  " >
            <TouchableOpacity onPress={() => {
                setIsClicked(data => !data)
            }}


                className="flex-row justify-between items-center ">
                <Text className="text-black font-thin text-lg">{data.pillName}</Text>
                {/**Based on the Data check if the Date lesserthan or GreaterThan */}
                <Text className="text-black font-thin text-lg">{data.deviceName}</Text>
                <Text className="text-black font-thin text-lg">{data.dosage}</Text>
                {isClicked && (
                    <TouchableOpacity
                        onPress={deletePill}
                    >
                        <MaterialCommunityIcons name="delete-sweep-outline" size={24} color="black" />
                    </TouchableOpacity>
                )}

            </TouchableOpacity>
        </View>
    )
}

export default ReportComponent