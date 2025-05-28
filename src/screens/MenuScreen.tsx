import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, name, email } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {/* User Profile Picture Placeholder */}
        <View style={styles.profilePicturePlaceholder}>
          <Text style={styles.iconText}>Profile Pic</Text>
        </View>
        {/* User Name */}
        <Text style={styles.userName}>{name || user}</Text>
        {/* User Email */}
        <Text style={styles.userEmail}>{email || 'user@example.com'}</Text>
        {/* Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.buttonText}>User Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AboutUs')}
        >
          <Text style={styles.buttonText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Blogs')}
        >
          <Text style={styles.buttonText}>Blogs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ReportProblem')}
        >
          <Text style={styles.buttonText}>Report Problem</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, styles.logoutButtonText]}>Log out</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          {/* Placeholder for Home Icon */}
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={styles.navButton}>
          {/* Placeholder for Scan Icon */}
          <Text style={styles.iconText}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')} style={styles.navButton}>
          {/* Placeholder for Location Icon */}
          <Text style={styles.iconText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MenuScreen')} style={styles.navButton}>
          {/* Placeholder for Menu Icon */}
          <Text style={styles.iconText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A5CECA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    flex: 1,
  },
  profilePicturePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#5B913B',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    color: '#000',
    fontSize: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#000',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    backgroundColor: '#5B913B',
    paddingVertical: 12,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
  },
  logoutButtonText: {
    color: '#fff',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#A5CECA',
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
});

export default MenuScreen;
