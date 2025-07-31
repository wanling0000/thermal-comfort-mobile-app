import React from "react";
import {View, StyleProp, FlatList, ViewStyle, TouchableOpacity} from "react-native";
import Card from "../Card/Card";
import PointLine from "../PointLine/PointLine";
import { ITimeline, ITimelineData } from "../../models";
/**
 * ? Local Imports
 */
import styles from "./Item.style";

interface ItemProps {
  style?: StyleProp<ViewStyle>;
  data: ITimeline;
  list: ITimelineData[];
  isLastMember: boolean;
}

const Item: React.FC<ItemProps> = ({
  style,
  data,
  list,
  isLastMember,
  ...rest
}) => {
  const renderItem = (item: ITimelineData, index: number) => {
    return (
        <TouchableOpacity key={index} onPress={item.onPress}>
          <Card {...rest} isCard data={item} />
        </TouchableOpacity>
    );
  };

  return (
      <View style={[styles.container, style]}>
        <PointLine
            {...rest}
            date={data.date}
            length={list.length}
            isLastMember={isLastMember}
        />
        <View style={styles.insideListContainer}>
          <FlatList
              data={list}
              renderItem={({ item, index }) => renderItem(item, index)}
              keyExtractor={(_, index) => index.toString()}
          />
        </View>
      </View>
  );
};

export default Item;
