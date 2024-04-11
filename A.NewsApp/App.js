import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Modal, Image, Linking, Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'fe569913525e48e09b9526fed44a8e2b';

const Tab = createBottomTabNavigator();

export default function App() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handleSave = (article) => {
    const newFavorites = [...favorites, article];
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    Alert.alert('Saved', 'Story saved successfully!', [{ text: 'OK', onPress: () => { } }]);
  };

  const handleDelete = (url) => {
    const updatedFavorites = favorites.filter(article => article.url !== url);
    setFavorites(updatedFavorites);
    saveFavorites(updatedFavorites);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#007bff',
          inactiveTintColor: '#6c757d',
          labelStyle: { fontSize: 16, fontWeight: 'bold' },
          style: { backgroundColor: '#f8f9fa' },
        }}
      >
        <Tab.Screen name="News">
          {() => <NewsScreen handleSave={handleSave} />}
        </Tab.Screen>
        <Tab.Screen name="Favourites">
          {() => <FavouritesScreen favorites={favorites} handleDelete={handleDelete} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function NewsScreen({ handleSave }) {
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newsData, setNewsData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const searchNews = (query = '') => {
    let apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}&pageSize=30`;
    if (startDate && endDate) {
      apiUrl += `&from=${startDate}&to=${endDate}&sortBy=popularity`;
    }
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setNewsData(data.articles))
      .catch(error => console.error('Error fetching data:', error));
  };

  const getNews = () => {
    fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=${API_KEY}&pageSize=30`)
      .then(response => response.json())
      .then(data => setNewsData(data.articles))
      .catch(error => console.error('Error fetching data:', error));
  };

  const validateDate = (date) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
  };

  const handleSearch = () => {
    if (startDate && !validateDate(startDate)) {
      Alert.alert('Invalid Start Date', 'Please enter a valid start date in the format YYYY-MM-DD');
      return;
    }
    if (endDate && !validateDate(endDate)) {
      Alert.alert('Invalid End Date', 'Please enter a valid end date in the format YYYY-MM-DD');
      return;
    }
    searchNews(searchInput);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Image source={{ uri: item.urlToImage || 'https://via.placeholder.com/150' }} style={styles.image} />
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.url}>{item.url}</Text>
      </TouchableOpacity>
      <Button title="Save" onPress={() => handleSave(item)} color="#007bff" />
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        onChangeText={text => setSearchInput(text)}
        value={searchInput}
      />
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Start Date (YYYY-MM-DD)"
          onChangeText={text => setStartDate(text)}
          value={startDate}
        />
        <TextInput
          style={styles.dateInput}
          placeholder="End Date (YYYY-MM-DD)"
          onChangeText={text => setEndDate(text)}
          value={endDate}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Get News" onPress={getNews} color="#007bff" />
        <Button title="Search" onPress={handleSearch} color="#007bff" />
      </View>
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={item => item.url}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.successMessage}>Story saved successfully!</Text>
        </View>
      </Modal>
    </View>
  );
}

function FavouritesScreen({ favorites, handleDelete }) {
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>{item.author}</Text>
      <Image source={{ uri: item.urlToImage || 'https://via.placeholder.com/150' }} style={styles.image} />
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.url}>{item.url}</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => handleDelete(item.url)} color="#dc3545" />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={item => item.url}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ced4da',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  author: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 5,
    borderRadius: 5,
  },
  url: {
    color: '#007bff',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: '#28a745',
  },
});
