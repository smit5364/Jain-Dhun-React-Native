import React from 'react';

import {Text, View} from 'react-native';
const Category = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 26, fontWeight: 'bold'}}>Category</Text>
    </View>
  );
};

export default Category;
