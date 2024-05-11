import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Recording from './Recording';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recorder</Text>
      <Recording />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop:40
  },
});
