import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import SearchHeader from 'react-native-search-header';
import {withNavigation} from 'react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  PixelRatio,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';

const phoneFontScale = PixelRatio.getFontScale();

const List = ({navigation}) => {
  const searchHeaderRef = React.useRef(null);
  const [header, setHeader] = useState(true);
  const [lyrics, setLyrics] = useState([]);
  const [tags, setTags] = useState([]);
  const [filteredLyrics, setFilteredLyrics] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAPIData = async () => {
    try {
      const querySnapshot = await firestore().collection('lyrics').get();
      const jsonData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const jsonString = JSON.stringify(jsonData);
      await AsyncStorage.setItem('data', jsonString);

      // Fetch tags separately
      const tagsQuerySnapshot = await firestore().collection('tags').get();
      const tagsData = tagsQuerySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const tagsJsonString = JSON.stringify(tagsData);
      await AsyncStorage.setItem('tags', tagsJsonString);

      return jsonData;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const fetchStoredData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('data');
      const storedTags = await AsyncStorage.getItem('tags');
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
        const [apiData, storedData, storedTags] = await Promise.all([
          fetchAPIData(),
          fetchStoredData(),
          fetchStoredTags(),
        ]);
        const jsonData = apiData.length > 0 ? apiData : storedData;
        const tagsData = storedTags.length > 0 ? storedTags : [];
        setLyrics(jsonData);
        setTags(tagsData); // Add this line to set the tags state
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchStoredTags = async () => {
    try {
      const storedTags = await AsyncStorage.getItem('tags');
      return storedTags !== null ? JSON.parse(storedTags) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearch = text => {
    setSearchText(text);
    const filteredItems = filterData(text);
    setFilteredLyrics(filteredItems);
  };

  useLayoutEffect(() => {
    const showSearchBox = () => {
      searchHeaderRef.current.isHidden ? searchHeaderRef.current.show() : null;
    };

    navigation.setOptions({
      headerRight: () => (
        <MaterialCommunityIcons
          name="magnify"
          color="#fff"
          onPress={() => {
            showSearchBox();
            setHeader(false);
          }}
          size={26}
        />
      ),
      headerShown: header,
    });
  }, [navigation, header]);

  const handleTagPress = tag => {
    let newSelectedTags = [];

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(selectedTag => selectedTag !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }

    setSelectedTags(newSelectedTags);

    if (newSelectedTags.length > 0) {
      const filteredItems = lyrics.filter(item => {
        return newSelectedTags.every(selectedTag =>
          item.tags.includes(selectedTag),
        );
      });
      setFilteredLyrics(filteredItems);
    } else {
      setFilteredLyrics([]);
    }
  };

  const filterData = text => {
    if (text) {
      const filteredItems = lyrics.filter(
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
    return lyrics;
  };

  const renderTags = ({item}) => (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selectedTags.includes(item.name)
            ? '#FFC107'
            : '#fff',
        },
      ]}
      onPress={() => handleTagPress(item.name)}>
      <Text style={styles.chipText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    const [apiData, storedData, storedTags] = await Promise.all([
      fetchAPIData(),
      fetchStoredData(),
      fetchStoredTags(),
    ]);
    const jsonData = apiData.length > 0 ? apiData : storedData;
    const tagsData = storedTags.length > 0 ? storedTags : [];
    setLyrics(jsonData);
    setTags(tagsData);
    setFilteredLyrics([]);
    setRefreshing(false);
  };

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
              backgroundColor: '#673AB7',
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

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>No data available</Text>
    </View>
  );

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
          iconColor="#673AB7"
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
          style={styles.searchHeader}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tagsContainer}
          data={tags}
          renderItem={renderTags}
          keyExtractor={item => item.id.toString()}
        />
        <FlatList
          data={
            searchText === '' && selectedTags.length === 0
              ? lyrics.sort((a, b) => a.numbering - b.numbering)
              : filteredLyrics.sort((a, b) => a.numbering - b.numbering)
          }
          renderItem={renderListItem}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              tintColor="#673AB7"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchHeader: {
    header: {
      height: 55,
      backgroundColor: '#fdfdfd',
    },
  },
  tagsContainer: {
    marginTop: 0,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 97,
    paddingLeft: 12,
    paddingRight: 12,
    marginVertical: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: '#673AB7',
  },
  chipText: {
    padding: 8,
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: '#673AB7',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: '70%',
  },
});

export default withNavigation(List);
