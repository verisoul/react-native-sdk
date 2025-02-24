import { type PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import type { GestureResponderEvent } from 'react-native/Libraries/Types/CoreEventTypes';
import { onTouchEvent } from '../modules/Verisoul';
import { MotionAction } from '../utils/Enums';

export interface VerisoulTouchRootViewProps
  extends PropsWithChildren<ViewProps> {}

export const VerisoulTouchRootView = ({
  style,
  ...rest
}: VerisoulTouchRootViewProps) => {
  const handleTouch = (event: GestureResponderEvent, action: MotionAction) => {
    const { locationX, locationY } = event.nativeEvent;
    onTouchEvent(locationX, locationY, action);
    console.log(action.toString());
  };
  return (
    <View
      style={style ?? styles.container}
      pointerEvents="box-none" // Ensures child views receive touches
      onTouchStart={(event) => handleTouch(event, MotionAction.ACTION_DOWN)} // Touch Down
      onTouchCancel={(event) => handleTouch(event, MotionAction.ACTION_UP)} // Touch Up ch Up
      onTouchEnd={(event) => handleTouch(event, MotionAction.ACTION_UP)} // Touch Up
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
