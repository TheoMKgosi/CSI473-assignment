import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';

const CommunityForum = () => {
  const [post, setPost] = useState('');
  const [posts, setPosts] = useState([]);

  const submitPost = async () => {
    try {
      const response = await axios.post('http://your-django-api/forum/', { content: post });
      setPosts([...posts, response.data]);
      setPost('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Forum</Text>
      <TextInput style={styles.input} placeholder="Write a post..." value={post} onChangeText={setPost} />
      <Button title="Submit" onPress={submitPost} />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={{ uri: 'path-to-user-avatar' }} style={styles.avatar} />
            <Text style={styles.user}>User0101</Text>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.actions}>
              <TouchableOpacity><Text>Like</Text></TouchableOpacity>
              <TouchableOpacity><Text>Comment</Text></TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, color: '#000' },
  input: { backgroundColor: '#D9D9D9', height: 128, padding: 10 },
  post: { backgroundColor: '#D9D9D9', padding: 10, marginVertical: 10 },
  avatar: { width: 40, height: 40, backgroundColor: '#D3D3D3' },
  user: { fontSize: 12, color: '#000' },
  content: { fontSize: 12, color: '#000' },
  actions: { flexDirection: 'row', justifyContent: 'space-around' },
});

export default CommunityForum;