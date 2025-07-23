import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

type Waste = {
  id: number;
  name: string;
  type: string;
  imageUri: string;
};

type Props = {
  navigation: any;
};

const ScanScreen: React.FC<Props> = ({ navigation }) => {
  // State to hold scanned wastes
  const [scannedWastes, setScannedWastes] = useState<Waste[]>([
    // Example dummy data
    { id: 1, name: 'Plastic Bottle', type: 'Plastic', imageUri: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Glass Jar', type: 'Glass', imageUri: 'https://via.placeholder.com/50' },
  ]);

  const handleUploadPress = () => {
    Alert.alert('Upload', 'This is where the user uploads the waste pic ');
    // Here you would add logic to upload and scan waste, then update scannedWastes state
  };

  const handleResultsPress = () => {
    navigation.navigate('ScannedWastes', { scannedWastes });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Scan Waste</Text>
        <Text style={styles.description}>Upload an image to scan and classify waste.</Text>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
                  {/* Placeholder for Home Icon */}
                  <Text style={styles.iconText}>🏠</Text>
                </TouchableOpacity>
        <TouchableOpacity onPress={handleUploadPress} style={styles.navButton}>
          <Text style={styles.iconText}>⬆️</Text>
          <Text style={styles.navText}>Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleResultsPress} style={styles.navButton}>
          <Text style={styles.iconText}>📄</Text>
          <Text style={styles.navText}>Results</Text>
        </TouchableOpacity>
    
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A5CECA',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ScanScreen;
