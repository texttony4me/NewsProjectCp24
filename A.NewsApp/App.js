// 
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Image, Linking } from 'react-native';

export default function App() {
  const [query, setQuery] = useState('');
  const [news, setNews] = useState([]);

  const handleInputChange = (text) => {
    setQuery(text);
  };

  const searchNews = async () => {
    if (query.trim() === '') return;
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=fe569913525e48e09b9526fed44a8e2b&pageSize=5`);
      const data = await response.json();
      setNews(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
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
        <Image source={{ uri: article.urlToImage }} style={styles.articleImage} />
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
        <Button
          title="Search"
          onPress={searchNews}
          disabled={!query.trim()}
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
