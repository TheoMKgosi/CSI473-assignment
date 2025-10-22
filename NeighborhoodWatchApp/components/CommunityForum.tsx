import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
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
      <TextInput style={styles.input} placeholder="Write a post..." value={post} onChangeText={setPost} placeholderTextColor="#000" />
      <Button title="Submit" onPress={submitPost} color="#61A3D2" />
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Image source={require('../assets/user-avatar.png')} style={styles.avatar} />
            <Text style={styles.user}>User0101</Text>
            <Text style={styles.content}>{item.content}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.action}>
                <Image source={require('../assets/like-icon.png')} style={styles.actionIcon} />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}>
                <Image source={require('../assets/comment-icon.png')} style={styles.actionIcon} />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
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
  title: { fontSize: 22, color: '#000', fontFamily: 'Inter', textAlign: 'center' },
  input: { backgroundColor: '#D9D9D9', height: 128, padding: 10, marginVertical: 10, fontSize: 12, color: '#000', fontFamily: 'Inter' },
  post: { backgroundColor: '#D9D9D9', padding: 10, marginVertical: 10, borderRadius: 5 },
  avatar: { width: 40, height: 40, backgroundColor: '#D3D3D3' },
  user: { fontSize: 12, color: '#000', fontFamily: 'Inter' },
  content: { fontSize: 12, color: '#000', fontFamily: 'Inter' },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionIcon: { width: 24, height: 24 },
  actionText: { fontSize: 12, color: '#000', fontFamily: 'Inter' },
});

export default CommunityForum;