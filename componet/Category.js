import React from 'react';

import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {Card} from 'react-native-elements';

import {NavigationContainer} from '@react-navigation/native';

import {SuperGridSectionList} from 'react-native-super-grid';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const CategoryDisplay = ({navigation}) => {
  const slides = [
    {
      key: '11 MB',
      text: 'FREE ',
      title: 'Mobile ',
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
  ];
  return (
    <View style={{}}>
      <ScrollView>
        <SingleRow navigation={navigation} title="Tags" slides={slides} />
        <SingleRow
          navigation={navigation}
          title="24 Tirthenkar"
          slides={slides}
        />
        <SingleRow navigation={navigation} title="Artist" slides={slides} />
      </ScrollView>
    </View>
  );
};
const SingleRow = ({navigation, title, slides}) => {
  const onPressLearnMore = () => {
    alert('Hello');
  };

  return (
    <View style={{flex: 1}}>
      <Card containerStyle={[styles.cardStyle]}>
        <View style={[styles.cardHeadingStyle]}>
          <Text style={styles.cardHeadingTextStyle}>{title}</Text>
          <Text
            style={{color: '#228B22'}}
            onPress={() => navigation.navigate('Double')}>
            MORE
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginVertical: 5, width: '100%'}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {slides.map((item, key) => (
              <TouchableOpacity
                onPress={() => {
                  alert(item.title);
                }}
                style={{margin: 5}}
                key={key}>
                {item.uri ? (
                  <Image
                    source={{uri: item.uri}}
                    style={{
                      width: 70,
                      height: 70,
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
            ))}
          </ScrollView>
        </View>
      </Card>
    </View>
  );
};

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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleStyle: {
    padding: 16,
    fontSize: 20,
    color: 'white',
    backgroundColor: '#307ecc',
  },
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
  cardStyle: {
    backgroundColor: '#FFFFFF',
    padding: 12,

    borderCurve: 'continuous',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
  },
  cardHeadingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeadingTextStyle: {
    color: '#606070',
    fontWeight: 'bold',
  },
  childViewTextStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const Category = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoryDisplay"
        component={CategoryDisplay}
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
      <Stack.Screen
        name="Double"
        component={DoubleColum}
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

export default Category;
