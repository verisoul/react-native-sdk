import Verisoul, { MotionAction } from 'verisoul-reactnative';
import { View, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { useEffect, useRef } from 'react';
import { VerisoulEnvironment } from '../../src/utils/Enums';

export default function App() {
  useEffect(() => {
    Verisoul.configure({
      environment: VerisoulEnvironment.production,
      projectId: 'App token',
    });
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      // User touches down
      onPanResponderGrant: (_, gestureState) => {
        console.log('Touch Down:', gestureState.x0, gestureState.y0);
        Verisoul.onTouchEvent(
          gestureState.x0,
          gestureState.y0,
          MotionAction.ACTION_DOWN
        );
      },

      // User moves finger on screen
      onPanResponderMove: (_, gestureState) => {
        console.log('Touch Move:', gestureState.moveX, gestureState.moveY);
        Verisoul.onTouchEvent(
          gestureState.moveX,
          gestureState.moveY,
          MotionAction.ACTION_MOVE
        );
      },

      // User lifts finger
      onPanResponderRelease: (_, gestureState) => {
        console.log('Touch Up:', gestureState.x0, gestureState.x0);
        Verisoul.onTouchEvent(
          gestureState.x0,
          gestureState.y0,
          MotionAction.ACTION_UP
        );
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Button
        onPress={async () => {
          try {
            const sessionData = await Verisoul.getSessionID();
            Alert.alert('Session ID', sessionData);
          } catch (e) {
            console.error(e);
          }
        }}
        title="Get Session ID"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
