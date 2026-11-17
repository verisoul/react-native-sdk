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
  // The native SDK samples presses only, so the press is all that is forwarded.
  const handleTouchStart = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    onTouchEvent(pageX, pageY, MotionAction.ACTION_DOWN);
  };
  return (
    <View
      style={style ?? styles.container}
      pointerEvents="box-none" // Ensures child views receive touches
      onTouchStart={handleTouchStart}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
