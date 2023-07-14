import React from 'react';

import {Text, View} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const ProfileDisplay = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}>Profile</Text>
    </View>
  );
};

const Profile = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileDisplay"
        component={ProfileDisplay}
        options={{
          headerTitle: 'Jain Dhun',
          headerStyle: {
            backgroundColor: '#673AB7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
        }}
      />
    </Stack.Navigator>
  );
};
export default Profile;
