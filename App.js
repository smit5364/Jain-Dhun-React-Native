import React, {useEffect, useLayoutEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

import {
  ActivityIndicator,
  Button,
  PixelRatio,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
  SafeAreaView,
} from 'react-native';
import SearchHeader from 'react-native-search-header';
import MaterialSearchBar from './components/MaterialSearchBar';

const DEVICE_WIDTH = Dimensions.get(`window`).width;
const phoneFontScale = PixelRatio.getFontScale();

const List = ({navigation}) => {
  const searchHeaderRef = React.useRef(null);
  const [header, setHeader] = useState(true);
  // const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');

  const fetchAPIData = async () => {
    try {
      const querySnapshot = await firestore().collection('lyrics').get();
      const jsonData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const jsonString = JSON.stringify(jsonData);
      await AsyncStorage.setItem('data', jsonString);
      return jsonData;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('data');
      return storedData !== null ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getData = async () => {
    const isConnected = await NetInfo.isConnected.fetch();
    let jsonData = [];
    if (isConnected) {
      jsonData = await fetchAPIData();
    }
    const storedData = await fetchStoredData();
    return jsonData.length > 0 ? jsonData : storedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [apiData, storedData] = await Promise.all([
          fetchAPIData(),
          fetchStoredData(),
        ]);
        const jsonData = apiData.length > 0 ? apiData : storedData;
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterData = text => {
    if (text) {
      const filteredItems = data.filter(
        item =>
          item.title.toLowerCase().includes(text.toLowerCase()) ||
          item.artist.toLowerCase().includes(text.toLowerCase()) ||
          item.numbering.toString().includes(text.toString()) ||
          item.tags.some(tag =>
            tag.toLowerCase().includes(text.toLowerCase()),
          ) ||
          item.content.toLowerCase().includes(text.toLowerCase()),
      );
      return filteredItems;
    }
    return data;
  };

  const handleSearch = text => {
    setSearchText(text);
    const filteredItems = filterData(text);
    setFilteredData(filteredItems);
  };

  useLayoutEffect(() => {
    const showSearchBox = () => {
      searchHeaderRef.current.isHidden ? searchHeaderRef.current.show() : null;
    };

    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Search"
          onPress={() => {
            showSearchBox();
            setHeader(false);
          }}
        />
      ),
      headerShown: header,
    });
  }, [navigation, header]);

  const renderListItem = ({item}) => (
    <Pressable
      onPress={() => {
        navigation.navigate('Details', {item});
        setSearchText('');
        setHeader(true);
        searchHeaderRef.current.hide();
      }}
      style={{marginHorizontal: 5}}>
      <View
        key={item.id}
        style={{
          borderBottomColor: 'rgba(0,0,0,0.2)',
          borderBottomWidth: 1,
          padding: 10,
          height: 70,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <View style={{height: 40}}>
          <Text
            style={{
              marginRight: 20,
              backgroundColor: 'red',
              color: '#fff',
              paddingHorizontal: 16,
              paddingTop: 10,
              flex: 1,
              fontWeight: 'bold',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}>
            {item.numbering}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', fontSize: 16 * phoneFontScale}}>
            {item.title}
          </Text>
          <Text style={{fontSize: 14 * phoneFontScale}}>
            {item.content.split('\n')[0]}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  if (isLoading) {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <View>
      <SafeAreaView>
        <SearchHeader
          ref={searchHeaderRef}
          placeholder="Search..."
          placeholderColor="gray"
          autoFocus={true}
          dropShadowed={true}
          visibleInitially={false}
          persistent={false}
          enableSuggestion={false}
          entryAnimation="from-right-side"
          topOffset={1}
          iconColor="red"
          onHide={event => {
            setHeader(true);
            setSearchText('');
          }}
          onEnteringSearch={event => {
            handleSearch(event.nativeEvent.text);
          }}
          onSearch={event => {
            handleSearch(event.nativeEvent.text);
          }}
          style={{
            header: {
              height: 55,
              backgroundColor: `#fdfdfd`,
            },
          }}
        />
        <FlatList
          style={{marginTop: header ? 0 : 55}}
          data={
            searchText === ''
              ? data.sort((a, b) => a.numbering - b.numbering)
              : filteredData.sort((a, b) => a.numbering - b.numbering)
          }
          renderItem={renderListItem}
          keyExtractor={item => item.id.toString()}
        />
      </SafeAreaView>
    </View>
  );
};
const DetailPage = ({route, navigation}) => {
  const {item} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({title: `${item.numbering}. ${item.title}`});
  }, [navigation, item.title]);

  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 16, marginBottom: 10}}>
          Artist : {item.artist}
        </Text>
        <View style={{padding: 0}}>
          <Text style={{fontSize: 16, textAlign: 'justify', color: '#000'}}>
            {item.content}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={List}
          options={{
            title: 'Jain Dhun',
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailPage}
          options={{
            headerStyle: {
              backgroundColor: 'red',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
