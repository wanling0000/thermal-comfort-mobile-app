import React, {useEffect, useState} from 'react';
import {CartesianChart, Line} from "victory-native";
import {View} from "react-native";


const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    highTmp: 40 + 30 * Math.random(),
}));

export default function TestScreen() {

    return (
        <View style={{ height: 300 }}>
            <CartesianChart
                data={DATA}
                xKey="day"
                yKeys={["highTmp"]}
            >
                {({ points }) => (
                    <Line points={points.highTmp} color="red" strokeWidth={3} />
                )}
            </CartesianChart>
        </View>
    );
}
