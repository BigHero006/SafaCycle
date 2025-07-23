import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');

const exampleArticles = [
  { id: '1', title: 'Waste Management Tips', description: 'Learn how to manage your waste effectively with these practical tips and strategies for sustainable living.' },
  { id: '2', title: 'Recycling Benefits', description: 'Discover the environmental and economic benefits of recycling materials in your daily life.' },
  { id: '3', title: 'Community Clean-up', description: 'Join local clean-up events in your area and make a positive impact on your neighborhood environment.' },
  { id: '4', title: 'Reducing Plastic Use', description: 'Practical tips and alternatives to reduce plastic consumption and help protect our oceans and wildlife.' },
  { id: '5', title: 'Composting Basics', description: 'How to start composting at home with simple steps to turn organic waste into nutrient-rich soil.' },
  { id: '6', title: 'Energy Conservation', description: 'Save energy with simple habits and techniques that reduce your carbon footprint and utility bills.' },
  { id: '7', title: 'Sustainable Living', description: 'Adopt sustainable lifestyle choices that benefit both the environment and your personal well-being.' },
  { id: '8', title: 'Water Conservation', description: 'Effective ways to conserve water daily and reduce your environmental impact while saving money.' },
  { id: '9', title: 'Eco-friendly Products', description: 'Choose products that are good for the environment and discover sustainable alternatives for everyday items.' },
  { id: '10', title: 'Climate Change Awareness', description: 'Understand the impact of climate change and learn how individual actions can make a difference.' },
];

const ITEM_HEIGHT = 150; // Set a fixed height for each item

const Blogs: React.FC<{ navigation: any }> = ({ navigation }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const renderArticle = ({ item }: { item: typeof exampleArticles[0] }) => (
    <View style={styles.articleCard}>
      <View style={styles.articleImagePlaceholder}>
        <Text style={styles.imageText}>Image</Text>
      </View>
      <Text style={styles.articleTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
      <Text style={styles.articleDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Recent blog posts</Text>

      <Animated.FlatList
        data={exampleArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT + 20} // Adjust for vertical snapping
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />} // Adjust for vertical spacing
      />

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.navButton}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ABE5dA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff',
    marginBottom: 20,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  articleCard: {
    backgroundColor: '#A5CECA',
    borderRadius: 15,
    padding: 15,
    height: ITEM_HEIGHT, // Set height for vertical layout
    justifyContent: 'space-between',
  },
  articleImagePlaceholder: {
    height: 60,
    backgroundColor: '#4e54c9',
    borderRadius: 10,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  imageText: {
    color: '#fff',
    fontSize: 16,
  },
  articleTitle: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  articleDescription: {
    color: '#000',
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
    lineHeight: 18,
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
});

export default Blogs;
