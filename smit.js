import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import SearchHeader from 'react-native-search-header';
import DetailPage from './componet/common/DetailPage';

const Stack = createNativeStackNavigator();

// const List = () => {
//   const searchHeaderRef = React.useRef(null);
//   const navigation = useNavigation();
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   React.useEffect(() => {
//     const getAPIData = async () => {
//       try {
//         const querySnapshot = await firestore().collection('lyrics').get();
//         const jsonData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         const jsonString = JSON.stringify(jsonData);
//         await AsyncStorage.setItem('data', jsonString);
//         setData(jsonData);
//         setIsLoading(false);
//       } catch (error) {
//         console.error(error);
//         setIsLoading(false);
//       }
//     };

//     const fetchDataFromStorage = async () => {
//       try {
//         const storedData = await AsyncStorage.getItem('data');
//         if (storedData !== null) {
//           setData(JSON.parse(storedData));
//           setIsLoading(false);
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     const unsubscribe = NetInfo.addEventListener(async state => {
//       if (state.isConnected) {
//         await getAPIData();
//         fetchDataFromStorage();
//       } else {
//         fetchDataFromStorage();
//       }
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   const handleSearch = text => {
//     if (text) {
//       const filteredItems = data.filter(item =>
//         item.title.toLowerCase().includes(text.toLowerCase()),
//       );
//       setFilteredData(filteredItems);
//     } else {
//       setFilteredData(data);
//     }
//   };

//   React.useLayoutEffect(() => {
//     navigation.setOptions({
//       headerRight: () => (
//         <TouchableOpacity onPress={() => searchHeaderRef.current.show()}>
//           <Text>Search</Text>
//         </TouchableOpacity>
//       ),
//     });
//   }, [navigation]);

//   // React.useLayoutEffect(() => {
//   //   navigation.setOptions({
//   //     headerRight: () => (
//   //       <TouchableOpacity>
//   //         <Text>Search</Text>
//   //       </TouchableOpacity>
//   //     ),
//   //   });
//   // }, [navigation]);

//   if (isLoading) {
//     return (
//       <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//         <ActivityIndicator size="large" color="red" />
//       </View>
//     );
//   }

//   return (
//     <View>
//       <SafeAreaView>
//         {' '}
//         <SearchHeader
//           ref={searchHeaderRef}
//           placeholder="Search..."
//           placeholderColor="gray"
//           onClear={() => {
//             console.log(`Clearing input!`);
//           }}
//           // onGetAutocompletions={async text => {
//           //   handleSearch(text); // Update filtered data based on the search text
//           // }}
//           onSearch={handleSearch} // Add this prop
//         />
//         {searchText === '' ? (
//           <FlatList
//             data={data}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Details', {item})}>
//                 <View
//                   key={item.id}
//                   style={{
//                     borderBottomColor: 'rgba(0,0,0,0.2)',
//                     borderBottomWidth: 2,
//                     padding: 10,
//                     marginHorizontal: 5,
//                   }}>
//                   <Text>Numbering: {item.numbering}</Text>
//                   <Text>Title: {item.title}</Text>
//                   <Text>Artist: {item.artist}</Text>
//                   <Text>Tag: {item.tags.join(', ')}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         ) : (
//           <FlatList
//             data={filteredData}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 onPress={() => navigation.navigate('Details', {item})}>
//                 <View
//                   key={item.id}
//                   style={{
//                     borderBottomColor: 'rgba(0,0,0,0.2)',
//                     borderBottomWidth: 2,
//                     padding: 10,
//                     marginHorizontal: 5,
//                   }}>
//                   <Text>Numbering: {item.numbering}</Text>
//                   <Text>Title: {item.title}</Text>
//                   <Text>Artist: {item.artist}</Text>
//                   <Text>Tag: {item.tags.join(', ')}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         )}
//       </SafeAreaView>
//     </View>
//   );
// };

const List2 = () => {
  const searchHeaderRef = React.useRef(null);
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    const getAPIData = async () => {
      try {
        const querySnapshot = await firestore().collection('lyrics').get();
        const jsonData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        const jsonString = JSON.stringify(jsonData);
        await AsyncStorage.setItem('data', jsonString);
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    const fetchDataFromStorage = async () => {
      try {
        const storedData = await AsyncStorage.getItem('data');
        if (storedData !== null) {
          setData(JSON.parse(storedData));
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected) {
        await getAPIData();
        fetchDataFromStorage();
      } else {
        fetchDataFromStorage();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSearch = text => {
    setSearchText(text); // Update search text state
    if (text) {
      const filteredItems = data.filter(item =>
        item.title.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filteredItems);
    } else {
      setFilteredData(data);
    }
  };

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <TouchableOpacity onPress={() => searchHeaderRef.current.show()}>
  //         <Text>Search</Text>
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  React.useLayoutEffect(() => {
    const [showSearchBox, setShowSearchBox] = React.useState(false);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowSearchBox(true)}>
          {showSearchBox ? (
            <SearchHeader
              placeholder="Search..."
              placeholderColor="gray"
              onClear={() => {
                console.log('Clearing input!');
                handleSearch(''); // Clear the search text and display the entire list
              }}
              onSearch={handleSearch}
            />
          ) : (
            <Text>Search</Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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
        {/* <SearchHeader
          ref={searchHeaderRef}
          placeholder="Search..."
          placeholderColor="gray"
          onClear={() => {
            console.log(`Clearing input!`);
          }}
          onGetAutocompletions={async text => {
            handleSearch(text); // Update filtered data based on the search text
          }}
          onSearch={handleSearch} // Add this prop
        /> */}

        {searchText === '' ? (
          <FlatList
            data={data}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Details', {item})}>
                <View
                  key={item.id}
                  style={{
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    borderBottomWidth: 2,
                    padding: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text>Numbering: {item.numbering}</Text>
                  <Text>Title: {item.title}</Text>
                  <Text>Artist: {item.artist}</Text>
                  <Text>Tag: {item.tags.join(', ')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Details', {item})}>
                <View
                  key={item.id}
                  style={{
                    borderBottomColor: 'rgba(0,0,0,0.2)',
                    borderBottomWidth: 2,
                    padding: 10,
                    marginHorizontal: 5,
                  }}>
                  <Text>Numbering: {item.numbering}</Text>
                  <Text>Title: {item.title}</Text>
                  <Text>Artist: {item.artist}</Text>
                  <Text>Tag: {item.tags.join(', ')}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={List2}
          options={{
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
