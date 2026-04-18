import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import SocialFeed from './screens/SocialFeed';
import PostDetails from './screens/PostDetails';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Feed');
  const [selectedPostId, setSelectedPostId] = useState(null);

  const navigateToDetails = (postId) => {
    setSelectedPostId(postId);
    setCurrentScreen('Details');
  };

  const navigateToFeed = () => {
    setCurrentScreen('Feed');
    setSelectedPostId(null);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {currentScreen === 'Feed' ? (
        <SocialFeed onPostPress={navigateToDetails} />
      ) : (
        <PostDetails 
          postId={selectedPostId} 
          onBack={navigateToFeed} 
        />
      )}
    </SafeAreaProvider>
  );
}
