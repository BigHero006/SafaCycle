import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';

type Waste = {
  id: number;
  name: string;
  type: string;
  imageUri: string;
};

type RootStackParamList = {
  Home: undefined;
  ScanScreen: undefined;
  LocationScreen: undefined;
  MenuScreen: undefined;
  ScannedWastes: { scannedWastes: Waste[] };
};

const ScannedWastes: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const scannedWastes = (route.params as { scannedWastes: Waste[] })?.scannedWastes || [];

  const handleReturnToScan = () => {
    navigation.navigate('ScanScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {scannedWastes.map((waste) => (
          <View key={waste.id} style={styles.wasteBox}>
            <Image source={{ uri: waste.imageUri }} style={styles.wasteImage} />
            <View style={styles.wasteInfo}>
              <Text style={styles.wasteName}>{waste.name}</Text>
              <Text style={styles.wasteType}>{waste.type}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.returnButton} onPress={handleReturnToScan}>
          <Text style={styles.returnButtonText}>Return back to scanning</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4e54c8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  wasteBox: {
    flexDirection: 'row',
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  wasteImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  wasteInfo: {
    flex: 1,
  },
  wasteName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wasteType: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 4,
  },
  returnButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  returnButtonText: {
    color: '#6a11cb',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 24,
  },
});

export default ScannedWastes;
