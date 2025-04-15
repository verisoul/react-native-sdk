import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import Verisoul, {
  VerisoulEnvironment,
  VerisoulTouchRootView,
  // @ts-ignore
} from '@verisoul_ai/react-native-verisoul';

export default function App() {
  const [sessionID, setSessionID] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Verisoul.configure({
          environment: VerisoulEnvironment.sandbox,
          projectId: '<YOUR_PROJECT_ID>',
        });
        const sessionData = await Verisoul.getSessionID();
        setSessionID(sessionData);
      } catch (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    })();
  }, []);

  return (
    <VerisoulTouchRootView>
      <View style={styles.container}>
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
    </VerisoulTouchRootView>
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
