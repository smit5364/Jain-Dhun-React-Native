import React, {useState, useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
// ...

import {Dimensions, StatusBar} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeStack from './componet/HomeStack';
import Category from './componet/Category';
import Profile from './componet/Profile';
import SplashScreen from './componet/SplashScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [tagData, setTagData] = useState([]);
  const [artistData, setArtistData] = useState([]);

  const netInfo = useNetInfo();

  useEffect(() => {
    if (netInfo.isConnected) {
      fetchData();
    }
  }, [netInfo.isConnected]);

  const fetchData = async () => {
    try {
      // Check if there is an internet connection
      if (!netInfo.isConnected) {
        // Use the cached data from AsyncStorage if there is no internet connection
        const cachedTagData = await AsyncStorage.getItem('tagData');
        const cachedArtistData = await AsyncStorage.getItem('artistData');
        if (cachedTagData && cachedArtistData) {
          setTagData(JSON.parse(cachedTagData));
          setArtistData(JSON.parse(cachedArtistData));
        }
        return;
      }

      // Fetch data from Firestore or any other data source
      const tagData = await fetchTagData();
      const artistData = await fetchArtistData();

      // Store data in AsyncStorage
      await AsyncStorage.setItem('tagData', JSON.stringify(tagData));
      await AsyncStorage.setItem('artistData', JSON.stringify(artistData));

      // Update state with fetched data
      setTagData(tagData);
      setArtistData(artistData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchTagData = async () => {
    try {
      const tagSnapshot = await firestore().collection('collections').get();
      const tagData = tagSnapshot.docs.map(doc => doc.data());
      return tagData;
    } catch (error) {
      console.error('Error fetching tag data:', error);
      return [];
    }
  };

  const fetchArtistData = async () => {
    try {
      const artistSnapshot = await firestore().collection('artists').get();
      const artistData = artistSnapshot.docs.map(doc => doc.data());
      return artistData;
    } catch (error) {
      console.error('Error fetching artist data:', error);
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1300); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <StatusBar backgroundColor="#673AB7" />
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeStack}
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Category"
              component={Category}
              options={{
                tabBarLabel: 'Category',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="menu" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                title: 'Jain Dhun',
                tabBarLabel: 'Profile',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="account"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default App;
