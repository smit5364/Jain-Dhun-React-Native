import React, {useState, useEffect} from 'react';
import {ScrollView, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailPage = ({route, navigation}) => {
  const {item} = route.params;
  const [isSaved, setIsSaved] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({title: `${item.numbering}. ${item.title}`});
  }, [navigation, item.title]);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const savedData = await AsyncStorage.getItem('saved');
        if (savedData !== null) {
          const savedLyrics = JSON.parse(savedData);
          const isItemSaved = savedLyrics.some(lyric => lyric.id === item.id);
          setIsSaved(isItemSaved);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkIfSaved();
  }, []);

  const handleFABClick = async () => {
    setIsSaved(prevSaved => !prevSaved);

    try {
      const savedData = await AsyncStorage.getItem('saved');
      let savedLyrics = savedData !== null ? JSON.parse(savedData) : [];

      if (isSaved) {
        savedLyrics = savedLyrics.filter(lyric => lyric.id !== item.id);
      } else {
        savedLyrics.push(item);
      }

      await AsyncStorage.setItem('saved', JSON.stringify(savedLyrics));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{height: '100%'}}>
      <ScrollView>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 16, marginBottom: 10}}>
            Artist: {item.artist}
          </Text>
          <View style={{padding: 0}}>
            <Text style={{fontSize: 16, textAlign: 'justify', color: '#000'}}>
              {item.content}
            </Text>
          </View>
        </View>
      </ScrollView>
      <FAB
        icon={() => (
          <MaterialCommunityIcons
            name={isSaved ? 'heart' : 'heart-outline'}
            color="#fff"
            size={25}
          />
        )}
        color="#673AB7"
        placement="right"
        onPress={handleFABClick}
      />
    </View>
  );
};

export default DetailPage;
