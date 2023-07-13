import React from 'react';
import {ScrollView, Text, View} from 'react-native';

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

export default DetailPage;
