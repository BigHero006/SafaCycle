import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const Home: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user, logout, name } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Welcome');
  };

  // Placeholder data for news articles
  const newsArticles = [
    { id: 1, title: 'Waste Management Tips', description: 'Learn how to manage your waste effectively.' },
    { id: 2, title: 'Recycling Benefits', description: 'Discover the benefits of recycling.' },
    { id: 3, title: 'Community Clean-up', description: 'Join local clean-up events in your area.' },
  ];

  const scrollX = useRef(new Animated.Value(0)).current;

  const renderNewsArticles = () => {
    return newsArticles.map((article, index) => (
      <View key={article.id} style={styles.newsCard}>
        {/* Placeholder for News Image */}
        <View style={styles.newsImagePlaceholder}>
          <Text style={styles.iconText}>Image</Text>
        </View>
        <Text style={styles.newsTitle}>{article.title}</Text>
        <Text style={styles.newsDescription}>{article.description}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {/* App Name */}
      <Text style={styles.appName}>Safa Cycle</Text>

      {/* Welcome Message */}
      <Text style={styles.welcomeMessage}>Welcome, {name || user}!</Text>
      <Text style={styles.subtitle}>Let's turn your trash into some cash</Text>

      {/* Notification and Profile */}
      <View style={styles.topIconsContainer}>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('NotificationAndAlert')}
        >
          {/* Placeholder for Notification Icon */}
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>🔔</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          {/* Placeholder for User Profile Picture */}
          <View style={styles.profilePicturePlaceholder}>
            <Text style={styles.iconText}>Profile Pic</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Reward Points Section */}
      <TouchableOpacity
        style={styles.rewardPointsContainer}
        onPress={() => navigation.navigate('ExchangePoints')}
      >
        {/* Placeholder for Reward Icon */}
        <View style={styles.rewardIconPlaceholder}>
          <Text style={styles.iconText}>🏆</Text>
        </View>
        <Text style={styles.rewardPointsText}>You have 120 reward points</Text>
      </TouchableOpacity>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TrashCalendar')}
        >
          {/* Placeholder for TrashCalendar Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <Text style={styles.buttonText}>Trash Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('VehicleTrack')}
        >
          {/* Placeholder for VehicleTrack Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>🚚</Text>
          </View>
          <Text style={styles.buttonText}>Vehicle Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('ExchangePoints')}
        >
          {/* Placeholder for ExchangePoints Icon */}
          <View style={styles.buttonIconPlaceholder}>
            <Text style={styles.iconText}>💰</Text>
          </View>
          <Text style={styles.buttonText}>Exchange Points</Text>
        </TouchableOpacity>
      </View>

      {/* News Articles Section */}
      <Animated.ScrollView
        style={styles.newsContainer}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderNewsArticles()}
      </Animated.ScrollView>

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
    backgroundColor: '#4e54c8',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  welcomeMessage: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notificationButton: {
    padding: 10,
  },
  profileButton: {
    padding: 10,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#6a11cb',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicturePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#6a11cb',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 18,
  },
  rewardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6a11cb',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  rewardIconPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: '#4e54c8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rewardPointsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6a11cb',
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonIconPlaceholder: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newsContainer: {
    flexGrow: 0,
    marginBottom: 20,
  },
  newsCard: {
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    width: width - 80,
  },
  newsImagePlaceholder: {
    height: 120,
    backgroundColor: '#4e54c8',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  newsDescription: {
    color: '#ddd',
    fontSize: 14,
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
});

export default Home;
