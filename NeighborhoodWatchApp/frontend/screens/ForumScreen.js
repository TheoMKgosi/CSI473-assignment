import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';

const ForumScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    setPosts([
      { id: 1, user: { email: 'alice@example.com' }, content: 'Suspicious activity near Park St. around 8 PM yesterday.', likes: 3, time: '2 hours ago' },
      { id: 2, user: { email: 'bob@example.com' }, content: 'Lost golden retriever spotted on Main Rd. Very friendly!', likes: 1, time: '5 hours ago' },
      { id: 3, user: { email: 'security@watch.org' }, content: 'Monthly patrol report: All areas covered, no incidents reported.', likes: 8, time: '1 day ago' },
      { id: 4, user: { email: 'mary@example.com' }, content: 'Community meeting this Friday at 6 PM in the community center.', likes: 5, time: '2 days ago' },
      { id: 5, user: { email: 'john@example.com' }, content: 'Found a set of keys near the playground. Contact me if they are yours.', likes: 2, time: '3 days ago' },
    ]);
  }, []);

  const handlePost = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write a message.');
      return;
    }

    const newPost = {
      id: Date.now(),
      user: { email: 'you@example.com' },
      content: content.trim(),
      likes: 0,
      time: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setContent('');
    Alert.alert('Posted!', 'Your message is live.');
  };

  const likePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Community Forum</Text>
        <Text style={styles.subtitle}>Stay connected with your neighbors</Text>
      </View>

      <View style={styles.postInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Share an update with your community..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post Update</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.postsContainer}>
        <Text style={styles.sectionTitle}>Recent Posts</Text>
        {posts.map((item) => (
          <View key={item.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postUser}>{item.user.email}</Text>
              <Text style={styles.postTime}>{item.time}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            <View style={styles.postFooter}>
              <TouchableOpacity style={styles.likeButton} onPress={() => likePost(item.id)}>
                <Text style={styles.likeText}>👍 Like ({item.likes})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton}>
                <Text style={styles.commentText}>💬 Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '600', 
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  postInputContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  postButton: {
    backgroundColor: '#61a3d2',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  postButtonText: { 
    color: '#fff', 
    fontWeight: '500',
    fontSize: 14,
  },
  postsContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postUser: { 
    fontWeight: '600', 
    color: '#333', 
    fontSize: 14,
  },
  postTime: { 
    color: '#999', 
    fontSize: 12,
  },
  postContent: { 
    fontSize: 14, 
    color: '#444',
    lineHeight: 20,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  likeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#f0f8ff',
  },
  likeText: { 
    color: '#61a3d2', 
    fontSize: 12,
  },
  commentButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#f8f8f8',
  },
  commentText: { 
    color: '#666', 
    fontSize: 12,
  },
});

export default ForumScreen;