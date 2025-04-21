import React, { useState } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,ScrollView,Image,Platform,} from 'react-native';
const ReportProblem: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [problemType, setProblemType] = useState('');
  const [description, setDescription] = useState('');


  const handleSubmit = () => {
    // Here you can handle form submission, e.g., send data to backend
    navigation.navigate('MenuScreen');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.box}>
          <Text style={styles.label}>Problem Type</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Write the problem type here..."
            value={problemType}
            onChangeText={setProblemType}
          />

          <Text style={styles.label}>Problem Description</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            placeholder="Describe the issue here..."
            value={description}
            onChangeText={setDescription}
          />

        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // to avoid bottom nav bar overlap
  },
  box: {
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownOptions: {
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    marginBottom: 20,
  },
  dropdownOption: {
    padding: 12,
    borderBottomColor: '#6a11cb',
    borderBottomWidth: 1,
  },
  dropdownOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    color: '#fff',
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  imageUploadBox: {
    height: 150,
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadText: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#6a11cb',
    fontSize: 18,
    fontWeight: '700',
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
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ReportProblem;
