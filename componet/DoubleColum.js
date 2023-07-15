import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SuperGridSectionList} from 'react-native-super-grid';

const DoubleColum = () => {
  const slides = [
    {
      title: 'Section 1',
      data: [
        {
          key: '11 MB',
          text: 'FREE ',
          title: 'Mobile ',
          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',

          backgroundColor: '#20d2bb',
        },
        {
          key: '52 MB',
          title: 'Flight ',
          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
          backgroundColor: '#febe29',
        },
        {
          key: '14 MB',
          text: 'FREE',
          title: 'Great ',

          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',

          backgroundColor: '#22bcb5',
        },
        {
          key: '45 MB',
          title: 'Best ',

          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',

          backgroundColor: '#3395ff',
        },
        {
          key: '33 MB',
          title: 'Bus ',
          text: 'FREE',

          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',

          backgroundColor: '#f6437b',
        },
        {
          key: '77 MB',
          title: 'Train ',

          uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',

          backgroundColor: '#febe29',
        },
      ],
    },
  ];

  return (
    <SuperGridSectionList
      itemDimension={100}
      sections={slides}
      style={styles.gridView}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => {
            alert(item.title);
          }}
          style={{margin: 5}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {item.uri ? (
              <Image
                source={{uri: item.uri}}
                style={{
                  width: 90,
                  height: 90,
                  margin: 10,
                  borderRadius: 35,
                }}
              />
            ) : (
              <View
                style={{
                  width: 70,
                  height: 70,
                  margin: 10,
                  borderRadius: 35,
                  backgroundColor: '#ECECEC',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#494949', fontWeight: '200'}}>
                  {item.title.charAt(0)}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{color: '#494949', fontWeight: '200'}}
              onPress={() => {
                alert('Title ' + item.title + ' Clicked');
              }}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      renderSectionHeader={({section}) => (
        <Text style={{color: 'green'}}>{slides.title}</Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  gridView: {
    // paddingTop: 25,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});

export default DoubleColum;
