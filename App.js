import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/MyCardsScreen';
import ContactsScreen from './screens/ContactsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddBusinessCardScreen from './screens/AddBusinessCardScreen';
import BusinessCardScreen from './screens/BusinessCardScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import ArchivedCardsScreen from './screens/ArchivedCardsScreen';
import EditBusinessCardScreen from './screens/EditBusinessCardScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'; 

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: 'black' },
  headerTintColor: '#0096FF',
  headerTitleStyle: { color: '#fff' },
  headerTitleAlign: 'center',
};

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName='Home'
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        let iconSize = 24; // Adjust the size of the icons

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Contacts') {
          iconName = 'contacts';
        } else if (route.name === 'Tools') {
          iconName = 'build';
        } else if (route.name === 'Updates') {
          iconName = 'update';
        } else if (route.name === 'Settings') {
          iconName = 'settings';
        }

        return (
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={color}
            style={{ marginBottom: -3 }} // Adjust the icon's position vertically
          />
        );
      },
      tabBarActiveTintColor: '#0096FF',
      tabBarInactiveTintColor: '#777777',
      tabBarLabelStyle: {
        fontSize: 12, // Adjust the font size of the labels
        fontWeight: 'bold',
        marginTop: -3, // Adjust the spacing between icon and label
      },
      tabBarStyle: {
        backgroundColor: 'black',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Contacts" component={ContactsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AddBusinessCard" component={AddBusinessCardScreen}/>
        <Stack.Screen name="BusinessCard" component={BusinessCardScreen}/>
        <Stack.Screen name="QRScanner" component={QRScannerScreen}/>
        <Stack.Screen name="ArchivedCards" component={ArchivedCardsScreen}/>
        <Stack.Screen name="EditBusinessCard" component={EditBusinessCardScreen}/>
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
