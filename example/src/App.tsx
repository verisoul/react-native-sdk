import {
  View,
  StyleSheet,
  Button,
  PanResponder,
  Image,
  Text,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import Verisoul, {
  MotionAction,
  VerisoulEnvironment,
} from '@verisoul_ai/react-native-verisoul';

export default function App() {
  const [sessionID, setSessionID] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Verisoul.configure({
          environment: VerisoulEnvironment.production,
          projectId: '0000-0000-0000-0000',
        });
        const sessionData = await Verisoul.getSessionID();
        setSessionID(sessionData);
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    })();
  }, []);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      // User touches down
      onPanResponderGrant: (_, gestureState) => {
        Verisoul.onTouchEvent(
          gestureState.x0,
          gestureState.y0,
          MotionAction.ACTION_DOWN
        );
      },

      // User moves finger on screen
      onPanResponderMove: (_, gestureState) => {
        Verisoul.onTouchEvent(
          gestureState.moveX,
          gestureState.moveY,
          MotionAction.ACTION_MOVE
        );
      },

      // User lifts finger
      onPanResponderRelease: (_, gestureState) => {
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
      <View style={styles.imgContainer}>
        <Image
          style={styles.img}
          source={require('../assets/verisoul-logo-light.png')}
        />
      </View>
      <Text style={styles.textBoldLarge}>React Native Sample App</Text>
      <Text style={styles.textNormal}>{`SessionId: ${sessionID}`} </Text>

      <Button
        onPress={async () => {
          try {
            const sessionData = await Verisoul.getSessionID();
            setSessionID(sessionData);
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
  img: {
    width: '100%',
    height: '100%',
  },
  imgContainer: {
    width: '80%',
    height: '10%',
    marginVertical: 10,
  },
  textBoldLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  textNormal: {
    fontSize: 16,
    color: 'black',
    marginVertical: 10,
    marginHorizontal: 10,
    textAlign: 'center',
  },
});
