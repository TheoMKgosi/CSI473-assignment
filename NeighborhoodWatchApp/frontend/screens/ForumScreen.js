import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const ForumScreen = () => {
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);

  // Fetch posts (placeholder, to be implemented once backend is fixed)
  useEffect(() => {
    // Replace with actual API call
    // axios.get('https://<your-codespace>.github.dev:8000/api/forum/', {
    //   headers: { Authorization: `Token <your-token>` }
    // }).then(response => setPosts(response.data));
  }, []);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }
    try {
      const response = await axios.post(
        'https://<your-codespace>.github.dev:8000/api/forum/',
        { content: postContent },
        { headers: { Authorization: 'Token <your-token>' } }
      );
      setPosts([...posts, response.data]);
      setPostContent('');
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postMeta}>Posted at: {item.created_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Forum</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a post..."
        value={postContent}
        onChangeText={setPostContent}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCreatePost}>
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postList: {
    flex: 1,
    width: '100%',
  },
  postContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  postContent: {
    fontSize: 16,
    color: '#333',
  },
  postMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default ForumScreen;
