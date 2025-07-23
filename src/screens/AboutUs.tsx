import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

const backgroundImage = require('../../images/Backgorund.jpg');

const AboutUs: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();

  const handleHomeNavigation = () => {
    if (user) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Login');
    }
  };
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={backgroundImage} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.box}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.description}>
              At Safa Cycle, we’re revolutionizing waste management with smart, sustainable solutions.
            </Text>
            <Text style={styles.description}>
              Our mission is to make waste disposal more efficient and eco-friendly by using cutting-edge technology like IoT and data analytics. With real-time tracking and personalized recommendations, we aim to optimize waste collection, reduce waste production, and encourage recycling.
            </Text>
            <Text style={styles.description}>
              Join us in building smarter, cleaner communities for a greener tomorrow!
            </Text>
          </View>
        </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomNavBar}>
          <TouchableOpacity onPress={handleHomeNavigation} style={styles.navButton}>
            <Text style={styles.iconText}>🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
            <Text style={styles.iconText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TrackVehicle')} style={styles.navButton}>
            <Text style={styles.iconText}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)', // 30% fill overlay
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingBottom: 100, // Space for bottom navigation
  },
  box: {
    backgroundColor: '#ffffff', // Background color for the box
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20, // Space between logo and text
  },
  textContainer: {
    alignItems: 'center',
  },
  description: {
    color: '#000', // Change text color to black for better contrast
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A5CE9B',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default AboutUs;
