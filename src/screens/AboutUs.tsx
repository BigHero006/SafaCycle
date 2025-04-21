import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AboutUs: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <View style={styles.container}>
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
    justifyContent: 'space-between', // Ensures the bottom nav bar stays at the bottom
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: '#ffffff', // Background color for the box
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 50, // Space from the top
    marginBottom: 20, // Space from the bottom nav bar
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6a11cb',
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
    fontSize: 14,
  },
});

export default AboutUs;