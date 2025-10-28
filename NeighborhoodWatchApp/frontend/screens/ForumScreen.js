import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

export default function ForumScreen() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    setPosts([
      { id: 1, user: { email: 'alice@example.com' }, content: 'Suspicious car on Elm St.', likes: 3 },
      { id: 2, user: { email: 'bob@example.com' }, content: 'Lost cat – brown tabby.', likes: 1 },
    ]);
  }, []);

  const addPost = () => {
    if (!content.trim()) return Alert.alert('Error', 'Write something');
    const newPost = {
      id: Date.now(),
      user: { email: 'you@example.com' },
      content: content.trim(),
      likes: 0,
    };
    setPosts([newPost, ...posts]);
    setContent('');
    Alert.alert('Posted', 'Your update is live');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Community Forum</Text>

      <TextInput
        style={styles.input}
        placeholder="Share an update…"
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.postBtn} onPress={addPost}>
        <Text style={styles.postBtnText}>Post</Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.user}>{item.user.email}</Text>
            <Text style={styles.text}>{item.content}</Text>
            <Text style={styles.likes}>Likes {item.likes}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#61a3d2', borderRadius: 10, padding: 12, marginBottom: 10, textAlignVertical: 'top' },
  postBtn: { backgroundColor: '#61a3d2', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  postBtnText: { color: '#fff' },
  card: { backgroundColor: '#f0f8ff', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#61a3d2' },
  user: { fontWeight: 'bold', marginBottom: 4 },
  text: { marginBottom: 4 },
  likes: { color: '#666', fontSize: 12 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});