import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../../src/screens/WelcomeScreen';
import LoginScreen from '../../src/screens/LoginScreen';
import SignupScreen from '../../src/screens/SignupScreen';
import Home from '../../src/screens/HomeScreen';
import MenuScreen from '../../src/screens/MenuScreen';
import ProfileScreen from '../../src/screens/ProfileScreen';
import Settings  from '../../src/screens/Settings'
import AboutUs from '../../src/screens/AboutUs';
import NotificationAndAlert from '../../src/screens/NotificationScreen';
import ReportProblem from '../../src/screens/ReportProblemScreen';
import Blogs from '@/src/screens/BlogScreen';
import appConfig from '../../app.json';
import { AuthProvider } from '../../src/context/AuthContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MenuScreen" component={MenuScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="Blogs" component={Blogs} />
          <Stack.Screen name="NotificationAndAlert" component={NotificationAndAlert} />
          <Stack.Screen name="ReportProblem" component={ReportProblem} />
        </Stack.Navigator>
      </>
    </AuthProvider>
  );
};

AppRegistry.registerComponent(appConfig.expo.name, () => App);

export default App;
