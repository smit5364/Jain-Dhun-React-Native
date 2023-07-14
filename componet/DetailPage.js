import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {FAB} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailPage = ({route, navigation}) => {
  const {item} = route.params;
  const [save, setSave] = useState();

  React.useLayoutEffect(() => {
    navigation.setOptions({title: `${item.numbering}. ${item.title}`});
  }, [navigation, item.title]);

  return (
    <View style={{height: '100%'}}>
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
      <FAB
        icon={() => (
          <MaterialCommunityIcons
            name={save ? 'heart' : 'heart-outline'}
            color="#fff"
            onPress={() => {
              setSave(!save);
            }}
            size={25}
          />
        )}
        color="#673AB7"
        placement="right"
      />
    </View>
  );
};

export default DetailPage;
