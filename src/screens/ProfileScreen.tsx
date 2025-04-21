import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { name: authName, email: authEmail, setName: setAuthName } = useAuth();

  const [name, setName] = useState(authName ?? '');
  const [email, setEmail] = useState(authEmail ?? '');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    setName(authName ?? '');
    setEmail(authEmail ?? '');
  }, [authName, authEmail]);

  const onSave = () => {
    // Update global name in AuthContext
    setAuthName(name);

    // For now, just alert the updated info
    Alert.alert(
      'Profile Saved',
      `Name: ${name}\nEmail: ${email}\nPassword: ${password}\nLocation: ${location}\nPhone: ${countryCode} ${phoneNumber}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.imageContainer}>
        <View style={styles.profileImage}>
          <Text style={styles.placeholderText}>Profile Image</Text>
        </View>
      </View>

      {/* Name */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Email */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Password */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter new password"
          secureTextEntry
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Location */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter your location"
          placeholderTextColor="#ccc"
        />
      </View>

      {/* Phone Number with Country Code */}
      <View style={styles.phoneContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneInputRow}>
          <TextInput
            style={styles.countryCodeInput}
            value={countryCode}
            onChangeText={setCountryCode}
            keyboardType="phone-pad"
            maxLength={5}
            placeholder="+1"
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.phoneNumberInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#ccc"
          />
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
            <View style={styles.bottomNavBar}>
              <TouchableOpacity onPress={() => navigation.navigate('HomeS')} style={styles.navButton}>
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
    backgroundColor: '#4e54c8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 14,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#6a11cb',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  phoneContainer: {
    marginBottom: 20,
  },
  phoneInputRow: {
    flexDirection: 'row',
  },
  countryCodeInput: {
    width: 60,
    backgroundColor: '#6a11cb',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
    textAlign: 'center',
  },
  phoneNumberInput: {
    flex: 1,
    backgroundColor: '#6a11cb',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#4e54c8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6a11cb',
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default ProfileScreen;

