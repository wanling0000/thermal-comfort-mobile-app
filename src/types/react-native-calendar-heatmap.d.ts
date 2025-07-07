declare module 'react-native-calendar-heatmap' {
    import * as React from 'react';
    import { ViewStyle } from 'react-native';

    export interface CalendarHeatmapValue {
        date: string;
        value: number | null;
    }

    export interface CalendarHeatmapProps {
        values: CalendarHeatmapValue[];
        endDate: string;
        numDays: number;
        squareSize?: number;
        gutterSize?: number;
        horizontal?: boolean;
        showMonthLabels?: boolean;
        getColor?: (value: number | null | undefined) => string;
        onPress?: (item?: CalendarHeatmapValue) => void;
        style?: ViewStyle;
    }

    export const CalendarHeatmap: React.FC<CalendarHeatmapProps>;
}
