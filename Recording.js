import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, FlatList, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons';

export default function App() {
  const [recording, setRecording] = useState();
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioList, setAudioList] = useState([]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  const startRecording = async () => {
    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
    } catch (error) {
      console.log('Error starting recording: ', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const info = await FileSystem.getInfoAsync(uri);
      setAudioList([...audioList, { uri, name: `Track ${audioList.length + 1}` }]);
      setRecording(undefined);
    } catch (error) {
      console.log('Error stopping recording: ', error);
    }
  };

  const playSound = async (audio) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audio.uri });
      setSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.log('Error playing sound: ', error);
    }
  };

  const stopSound = async () => {
    try {
      await sound.stopAsync();
      setIsPlaying(false);
    } catch (error) {
      console.log('Error stopping sound: ', error);
    }
  };

  const deleteAudio = (index) => {
    const newList = [...audioList];
    newList.splice(index, 1);
    setAudioList(newList);
  };

  const renderAudioItem = ({ item, index }) => (
    <View style={styles.audioItem}>
      <Text style={styles.audioName}>{item.name}</Text>
      <View style={styles.audioControls}>
        <TouchableOpacity onPress={() => playSound(item)}>
          <AntDesign name="play" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteAudio(index)}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button
          title={recording ? 'Stop Recording' : 'Start Recording'}
          onPress={recording ? stopRecording : startRecording}
        />
      </View>
      <FlatList
        style={styles.audioList}
        data={audioList}
        renderItem={renderAudioItem}
        keyExtractor={(item, index) => index.toString()}
      />
      {isPlaying && (
        <View style={styles.stopPlayback}>
          <Button title="Stop Playback" onPress={stopSound} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20,
    marginTop:40
  },
  controls: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  audioList: {
    flex: 1,
    width: '100%',
  },
  audioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  audioName: {
    fontSize: 16,
  },
  audioControls: {
    flexDirection: 'row',
  },
  stopPlayback: {
    position: 'absolute',
    bottom: 20,
  },
});
