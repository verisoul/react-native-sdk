import Verisoul from 'verisoul-reactnative';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { useEffect } from 'react';
import { VerisoulEnvironment } from '../../src/utils/Enums';

export default function App() {
  useEffect(() => {
    Verisoul.configure({
      environment: VerisoulEnvironment.production,
      projectId: 'App token',
    });
  }, []);

  return (
    <View style={styles.container}>
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
