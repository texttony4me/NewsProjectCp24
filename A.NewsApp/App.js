// 
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image, Linking, Switch,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [query, setQuery] = useState('');
  const [news, setNews] = useState([]);
  const [toDate, setToDate] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [useDateConstraints, setUseDateConstraints] = useState(false);
  const [country, setCountry] = useState('us');

  const handleInputChange = (text) => {
    setQuery(text);
  };

  const handleFromDateChange = (text) => {
    setFromDate(text);
  };

  const handleToDateChange = (text) => {
    setToDate(text);
  };

  const handleToggleDateConstraints = () => {
    setUseDateConstraints((prev) => !prev);
  };


  const handleCountryChange = (value) => {
    setCountry(value);
    searchNewsByCountry();
    
  };


  const searchNews = async () => {
    if (query.trim() === '') return;

    if (useDateConstraints && (!validateDate(fromDate) || !validateDate(toDate))) {
      alert('Please enter valid dates in the format YYYY-MM-DD');
      return;
    }

    try {

      let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}`;

      if (useDateConstraints) {
        url += `&from=${fromDate}&to=${toDate}&sortBy=popularity`;
      }

      url += '&apiKey=fe569913525e48e09b9526fed44a8e2b';

      if (country !== '') {
        if (country === 'us') {
          url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=fe569913525e48e09b9526fed44a8e2b';
        } else if (country === 'ca') {
          url = 'https://newsapi.org/v2/top-headlines?country=ca&apiKey=fe569913525e48e09b9526fed44a8e2b';
        }
      }

      const response = await fetch(url);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const searchNewsByCountry = async () => {
    try {
      let url = '';
  
      if (country === 'us') {
        url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=fe569913525e48e09b9526fed44a8e2b';
      } else if (country === 'ca') {
        url = 'https://newsapi.org/v2/top-headlines?country=ca&apiKey=fe569913525e48e09b9526fed44a8e2b';
      }
  
     
  
      const response = await fetch(url);
      const data = await response.json();
      console.log('Fetched news:', data.articles);
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };


  const validateDate = (date) => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  const getNews = async () => {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=keyword&apiKey=fe569913525e48e09b9526fed44a8e2b&pageSize=5`);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const renderNews = () => {
    return news.map((article, index) => (
      <View key={index} style={styles.articleContainer}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        <Text style={styles.articleAuthor}>{article.author}</Text>

       {article.urlToImage ? (
        <Image source={{ uri: article.urlToImage }} style={styles.articleImage} />
      ) : (
        <Image source={require('./downloadimage.png')} style={styles.articleImage} />
      )}
      <Text style={styles.articleUrl} onPress={() => Linking.openURL(article.url)}>
        {article.url}
      </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NewsApp by ANwabueze</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={query}
          onChangeText={handleInputChange}
        />

</View>
      {useDateConstraints && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="From (YYYY-MM-DD)"
            value={fromDate}
            onChangeText={handleFromDateChange}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="To (YYYY-MM-DD)"
            value={toDate}
            onChangeText={handleToDateChange}
          />
        </View>
      )}
      <View style={styles.switchContainer}>
        <Text>Set Date?</Text>
        <Switch
          value={useDateConstraints}
          onValueChange={handleToggleDateConstraints}
        />

<       View style={styles.inputContainer}>
        <Text>Country:</Text>
        <Picker
           style={{ flex: 1 }}
          selectedValue={country}
          onValueChange={handleCountryChange}
        >
          <Picker.Item label="Select country..." value="" />
          <Picker.Item label="Canada" value="us" />
          <Picker.Item label="U.S.A" value="ca" />
        </Picker>
      </View>
        
        <Button
          title="Search"
          onPress={searchNews}
          disabled={!query.trim() || (useDateConstraints && (!fromDate.trim() || !toDate.trim()))}
        />
      </View>
      <Button
        title="Get News"
        onPress={getNews}
      />
      <ScrollView style={styles.newsContainer}>
        {news.length > 0 ? renderNews() : <Text>No news to display</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },

  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  newsContainer: {
    flex: 1,
  },
  articleContainer: {
    marginBottom: 20,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  articleAuthor: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  articleImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  articleUrl: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  
});
