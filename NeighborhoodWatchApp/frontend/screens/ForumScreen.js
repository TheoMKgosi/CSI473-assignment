import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';

const ForumScreen = ({ route, navigation }) => {
  const { token } = route.params || {};
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/forum/',
          { headers: { Authorization: `Token ${token}` } }
        );
        setPosts(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch posts');
      }
    };
    if (token) fetchPosts();
  }, [token]);

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }
    try {
      const response = await axios.post(
        'https://super-palm-tree-69499prjx6rp24xg7.github.dev:8000/api/forum/',
        { content: postContent },
        { headers: { Authorization: `Token ${token}` } }
      );
      setPosts([response.data, ...posts]);
      setPostContent('');
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const renderPost = ({ item }) => (
    <View style={styles.rectangle22}>
      <View style={styles.rectangle22Inner} />
      <Text style={styles.user0101}>{item.user?.email || 'User0101'}</Text>
      <View style={styles.rectangle31}>
        <Image source={require('../../assets/user-icon.png')} style={styles.rectangle31Inner} />
      </View>
      <View style={styles.component15}>
        <Image source={require('../../assets/like-icon.png')} style={styles.mdiLike} />
        <Text style={styles.like}>Like ({item.likes || 0})</Text>
      </View>
      <View style={styles.component16}>
        <Image source={require('../../assets/comment-icon.png')} style={styles.iconamoonComment} />
        <Text style={styles.comment}>Comment</Text>
      </View>
      <Text style={styles.heyEveryone}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.communityForum}>
      <Text style={styles.communityForumTitle}>Community Forum</Text>
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
  communityForum: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  communityForumTitle: {
    fontFamily: 'Inter',
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#d9d9d9',
    borderRadius: 5,
    minHeight: 100,
    fontFamily: 'Inter',
    fontSize: 12,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#61a3d2',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
  },
  postList: {
    flex: 1,
    width: '100%',
  },
  rectangle22: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rectangle22Inner: {
    backgroundColor: '#d9d9d9',
    width: '100%',
    height: 128,
    borderRadius: 5,
  },
  user0101: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 5,
  },
  rectangle31: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    marginVertical: 5,
  },
  rectangle31Inner: {
    backgroundColor: '#d3d3d3',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  component15: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 5,
  },
  mdiLike: {
    width: 24,
    height: 24,
  },
  like: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  component16: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 5,
  },
  iconamoonComment: {
    width: 24,
    height: 24,
  },
  comment: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
  },
  heyEveryone: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#000',
    marginTop: 5,
  },
});

export default ForumScreen;