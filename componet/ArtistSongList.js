import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import SearchHeader from 'react-native-search-header';
import {withNavigation} from 'react-navigation';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';

const phoneFontScale = PixelRatio.getFontScale();

const ArtistSongList = ({route, navigation}) => {
  const {artist} = route.params;
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: artist,
    });
  }, [navigation, artist]);

  const renderListItem = ({item}) => {
    const {id, numbering, title, content, publishDate} = item;

    // Calculate the time difference in days between the publish date and today
    const currentDate = new Date();
    const publishDateTime = publishDate.toDate(); // assuming publishDate is a Firebase Timestamp
    const timeDiff = Math.ceil(
      (currentDate - publishDateTime) / (1000 * 60 * 60 * 24),
    );

    // Define the numbering based on the time difference
    let numberingText = timeDiff >= 0 && timeDiff < 7 ? 'NEW' : numbering;

    if (item.artist.toLowerCase() !== artist.toLowerCase()) {
      return null; // Skip rendering if the artist's name doesn't match
    }

    return (
      <Pressable
        onPress={() => {
          navigation.navigate('Details', {item});
          setSearchText('');
          setHeader(true);
          searchHeaderRef.current.hide();
        }}
        style={{marginHorizontal: 5}}>
        <View
          key={id}
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
                borderStyle: 'dashed',
                borderColor: '#673ab7',
                borderWidth: timeDiff >= 0 && timeDiff < 7 ? 2 : 0,
                backgroundColor:
                  timeDiff >= 0 && timeDiff < 7 ? '#FFC107' : '#673AB7',
                color: timeDiff >= 0 && timeDiff < 7 ? '#673AB7' : '#fff',
                paddingLeft: timeDiff >= 0 && timeDiff < 7 ? 20 : 16,
                paddingHorizontal: 16,
                paddingTop: 10,
                flex: 1,
                fontWeight: 'bold',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
              }}>
              {numberingText}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold', fontSize: 16 * phoneFontScale}}>
              {title}
            </Text>
            <Text style={{fontSize: 14 * phoneFontScale}} numberOfLines={1}>
              {content.split('\n')[0]}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyList = () => {
    if (isLoading) {
      // Render the activity indicator while data is being fetched
      return (
        <View style={styles.emptyListContainer}>
          <View style={styles.emptyListText}>
            <ActivityIndicator size={'large'} color={'#673AB7'} />
          </View>
        </View>
      );
    } else {
      // Render the message when there is no data available
      return (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>No data available</Text>
        </View>
      );
    }
  };

  const currentDate = new Date();
  const sortedLyrics = lyrics.sort((a, b) => a.numbering - b.numbering); // Sort by numbering

  // Filter the lyrics based on publish date within 7 days and numbering
  const filteredLyric = sortedLyrics.filter(item => {
    const publishDateTime = item.publishDate.toDate(); // assuming publishDate is a Firebase Timestamp
    const timeDiff = Math.ceil(
      (currentDate - publishDateTime) / (1000 * 60 * 60 * 24),
    );
    return timeDiff >= 0 && timeDiff < 7;
  });

  // Filter the remaining lyrics based on numbering
  const remainingLyrics = sortedLyrics.filter(
    item => !filteredLyric.includes(item),
  );

  // Concatenate the filtered lyrics with the remaining lyrics
  const mergedLyrics = [...filteredLyric, ...remainingLyrics];

  const dismissKeyboard = () => {
    if (searchHeaderRef.current) {
      searchHeaderRef.current.hide();
    }
  };

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x: 0, y: 0}}
      scrollEnabled={true}>
      <View>
        <SafeAreaView>
          <View>
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
              }}
              onEnteringSearch={event => {
                handleSearch(event.nativeEvent.text);
              }}
              onSearch={event => {
                handleSearch(event.nativeEvent.text);
              }}
              style={styles.searchHeader}
            />
          </View>
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: header ? 0 : 55}}
                data={tags}
                renderItem={renderTags}
                keyExtractor={item => item.id.toString()}
              />
              <FlatList
                scrollEnabled={false}
                data={
                  searchText === '' && selectedTags.length === 0
                    ? mergedLyrics
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
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </View>
    </KeyboardAwareScrollView>
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
    height: 36,
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

export default withNavigation(ArtistSongList);
