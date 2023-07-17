import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SingleRow from './SingleRow';

const {height} = Dimensions.get('window');

const CategoryDisplay = ({navigation}) => {
  const [tagData, setTagData] = useState([]);
  const [artistData, setArtistData] = useState([]);
  const [tirtankarData, setTirtankarData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedTagData = await AsyncStorage.getItem('tagData');
      const storedArtistData = await AsyncStorage.getItem('artistData');

      if (storedTagData) {
        setTagData(JSON.parse(storedTagData));
      }

      if (storedArtistData) {
        setArtistData(JSON.parse(storedArtistData));
      }

      setTirtankarData([
        {id: 1, name: 'Rishabhanatha', displayName: 'ઋષભનાથ'},
        {id: 2, name: 'Ajitanatha', displayName: 'અજિતનાથ'},
        {id: 3, name: 'Sambhavanatha', displayName: 'સંભવનાથ'},
        {id: 4, name: 'Abhinandananatha', displayName: 'અભિનંદનાથ'},
        {id: 5, name: 'Sumatinatha', displayName: 'સુમતિનાથ'},
        {id: 6, name: 'Padmaprabha', displayName: 'પદ્મપ્રભ'},
        {id: 7, name: 'Suparshvanatha', displayName: 'સુપર્શ્વનાથ'},
        {id: 8, name: 'Chandraprabha', displayName: 'ચંદ્રપ્રભ'},
        {id: 9, name: 'Pushpadanta', displayName: 'પુષ્પદંત'},
        {id: 10, name: 'Shitalanatha', displayName: 'શીતલનાથ'},
        {id: 11, name: 'Shreyanasanatha', displayName: 'શ્રેયાંશનાથ'},
        {id: 12, name: 'Vasupujya', displayName: 'વાસુપૂજ્ય'},
        {id: 13, name: 'Vimalanatha', displayName: 'વિમલનાથ'},
        {id: 14, name: 'Anantanatha', displayName: 'અનંતનાથ'},
        {id: 15, name: 'Dharmanatha', displayName: 'ધર્મનાથ'},
        {id: 16, name: 'Shantinatha', displayName: 'શાંતિનાથ'},
        {id: 17, name: 'Kunthunatha', displayName: 'કુંથુનાથ'},
        {id: 18, name: 'Aranatha', displayName: 'આરનાથ'},
        {id: 19, name: 'Mallinatha', displayName: 'મલ્લિનાથ'},
        {id: 20, name: 'Munisuvrata', displayName: 'મુનિસુવ્રત'},
        {id: 21, name: 'Naminatha', displayName: 'નમિનાથ'},
        {id: 22, name: 'Neminatha', displayName: 'નેમિનાથ'},
        {id: 23, name: 'Parshvanatha', displayName: 'પાર્શ્વનાથ'},
        {id: 24, name: 'Mahavira', displayName: 'મહાવીર'},
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        height,
        backgroundColor: '#fff',
      }}>
      <SingleRow
        navigation={navigation}
        redirect={'CatagoryList'}
        title="Tags"
        data={tagData}
      />
      <SingleRow
        navigation={navigation}
        title="24 Tirthenkar"
        data={tirtankarData}
      />
      <SingleRow
        navigation={navigation}
        title="Artist"
        redirect={'ArtistSongList'}
        data={artistData}
      />
    </View>
  );
};

export default CategoryDisplay;
