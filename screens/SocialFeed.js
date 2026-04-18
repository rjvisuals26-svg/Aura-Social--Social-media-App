import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import BASE_URL from '../src/api/apiConfig';


const { width } = Dimensions.get('window');
// const BASE_URL = 'http://192.168.1.113:3000'; // Updated to your computer's local IP


const THEME = {
  background: '#F8F9FD',
  surface: '#FFFFFF',
  primary: '#6C5CE7',
  secondary: '#FF7675',
  accent: '#55EFC4',
  text: '#2D3436',
  textSub: '#636E72',
  border: '#F1F3F5',
  glass: 'rgba(255, 255, 255, 0.85)',
  aura: ['#6C5CE7', '#A29BFE'],
  rose: ['#FF7675', '#FAB1A0'],
};

// --- Modern Skeleton Loader ---
const PostSkeleton = () => {
  const shimmer = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity: shimmer }]}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonAvatar} />
        <View style={styles.skeletonTextCont}>
          <View style={[styles.skeletonLine, { width: '40%' }]} />
          <View style={[styles.skeletonLine, { width: '25%', marginTop: 6 }]} />
        </View>
      </View>
      <View style={styles.skeletonImage} />
      <View style={[styles.skeletonLine, { width: '80%', height: 16, marginTop: 15 }]} />
    </Animated.View>
  );
};

// --- Image Mapping Utilities ---
const getPostKeywords = (title) => {
  const t = title.toLowerCase();
  if (t.includes('minimal')) return 'architecture,minimalist,zen';
  if (t.includes('coffee')) return 'coffee,cafe';
  if (t.includes('nature')) return 'nature,landscape';
  if (t.includes('mobile') || t.includes('ui')) return 'technology,iphone';
  if (t.includes('gradient')) return 'abstract,color';
  if (t.includes('sunset')) return 'sunset,nature';
  if (t.includes('urban')) return 'city,urban';
  if (t.includes('neon')) return 'neon,night';
  if (t.includes('digital')) return 'digital,future';
  return 'lifestyle,aesthetic';
};

const getUserAvatar = (userId) => {
  if (userId === 'RJ_Visuals' || userId === 'RJ Visuals') return 'https://i.pravatar.cc/150?img=11';
  if (userId === 'AuraDesign') return 'https://i.pravatar.cc/150?img=5';
  if (userId === 'Code&Coffee') return 'https://i.pravatar.cc/150?img=68';
  if (userId === 'EcoLife') return 'https://i.pravatar.cc/150?img=12';
  if (userId === 'TechExplorer') return 'https://i.pravatar.cc/150?img=33';
  return `https://i.pravatar.cc/150?u=${userId}`;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// --- Dedicated PostCard Component (Fixes Hook Error) ---
const PostCard = React.memo(({ item, onPostPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const postImg = `https://loremflickr.com/600/600/${getPostKeywords(item.title)}?lock=${item.id}`;
  const userAvatar = getUserAvatar(item.user_id);

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const handleAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <AnimatedTouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => onPostPress(item.id)}
      style={[styles.postCard, { transform: [{ scale: scaleAnim }] }]}
    >
      <View style={styles.postHeader}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: userAvatar }} style={styles.avatarImg} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.user_id}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={10} color={THEME.textSub} />
            <Text style={styles.timeText}>San Francisco • 2h</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleAction} style={styles.moreBtn}>
          <Feather name="more-horizontal" size={20} color={THEME.textSub} />
        </TouchableOpacity>
      </View>

      <View style={styles.postBodyContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBodyText}>{item.body}</Text>
      </View>

      <View style={styles.postImageContainer}>
        <Image source={{ uri: postImg }} style={styles.postImage} resizeMode="cover" />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.05)']} style={StyleSheet.absoluteFill} />
      </View>

      <View style={styles.postFooter}>
        <View style={styles.interactionRow}>
          <TouchableOpacity style={styles.actionItem} onPress={handleAction}>
            <Ionicons name="heart-outline" size={22} color={THEME.textSub} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={handleAction}>
            <Ionicons name="chatbubble-outline" size={21} color={THEME.textSub} />
            <Text style={styles.actionText}>12</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shareBtn} onPress={handleAction}>
          <Feather name="send" size={20} color={THEME.textSub} />
        </TouchableOpacity>
      </View>
    </AnimatedTouchableOpacity>
  );
});

export default function SocialFeed({ onPostPress, onBack }) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchPosts = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/posts`);
      if (!response.ok) throw new Error('Social server unreachable');
      const data = await response.json();
      setPosts(data);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      setError('Connection issue. Please ensure your backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fadeAnim]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const StoriesHeader = () => {
    // Get unique users from posts for the Moments bar
    const storyUsers = useMemo(() => {
      const users = [];
      const seen = new Set();
      posts.forEach(p => {
        if (!seen.has(p.user_id)) {
          seen.add(p.user_id);
          users.push({ id: p.user_id, name: p.user_id });
        }
      });
      return users.slice(0, 6);
    }, [posts]);

    return (
      <View style={styles.storiesWrapper}>
        <Text style={styles.sectionTitle}>Moments</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
          <View style={styles.myStory}>
            <View style={styles.myStoryAvatar}>
              <Ionicons name="add" size={20} color={THEME.white} />
            </View>
            <Text style={styles.storyName}>You</Text>
          </View>
          {storyUsers.map(u => (
            <View key={u.id} style={styles.storyItem}>
              <LinearGradient colors={THEME.rose} style={styles.auraRing}>
                <View style={styles.storyAvatarInside}>
                  <Image source={{ uri: getUserAvatar(u.name) }} style={styles.storyImg} />
                </View>
              </LinearGradient>
              <Text style={styles.storyName} numberOfLines={1}>{u.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.appBar}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
           <Ionicons name="apps" size={24} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.appTitle}>Aura Social</Text>
        <TouchableOpacity style={styles.notifBtn}>
           <Ionicons name="notifications-outline" size={24} color={THEME.text} />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
           <PostSkeleton />
           <PostSkeleton />
        </View>
      ) : error ? (
        <View style={styles.centered}>
           <MaterialCommunityIcons name="wifi-off" size={60} color={THEME.primary} style={{ opacity: 0.2 }} />
           <Text style={styles.errorText}>{error}</Text>
           <TouchableOpacity style={styles.retryBtn} onPress={() => fetchPosts()}>
              <Text style={styles.retryText}>Retry Feed</Text>
           </TouchableOpacity>
        </View>
      ) : (
        <Animated.FlatList 
          data={posts}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={StoriesHeader}
          renderItem={({ item }) => (
            <PostCard item={item} onPostPress={onPostPress} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={{ opacity: fadeAnim }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchPosts(true)} tintColor={THEME.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No pulses found in your circle.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  appBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: THEME.surface,
  },
  appTitle: { fontSize: 22, fontWeight: '900', color: THEME.text, letterSpacing: -1 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.background, justifyContent: 'center', alignItems: 'center' },
  notifBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: THEME.background, justifyContent: 'center', alignItems: 'center' },

  // Stories
  storiesWrapper: { paddingTop: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: THEME.text, marginLeft: 20, marginBottom: 15 },
  storiesScroll: { paddingLeft: 20, paddingRight: 10 },
  myStory: { alignItems: 'center', marginRight: 18 },
  myStoryAvatar: { width: 64, height: 64, borderRadius: 28, backgroundColor: THEME.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: THEME.surface },
  storyItem: { alignItems: 'center', marginRight: 18 },
  auraRing: { width: 68, height: 68, borderRadius: 30, justifyContent: 'center', alignItems: 'center', padding: 2 },
  storyAvatarInside: { width: 60, height: 60, borderRadius: 26, backgroundColor: THEME.surface, padding: 2, overflow: 'hidden' },
  storyImg: { width: '100%', height: '100%', borderRadius: 24 },
  storyName: { fontSize: 11, fontWeight: '700', color: THEME.text, marginTop: 8 },

  listContent: { paddingBottom: 100 },
  postCard: {
    backgroundColor: THEME.surface,
    borderRadius: 32,
    padding: 16,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 8,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarWrapper: { width: 48, height: 48, borderRadius: 20, overflow: 'hidden', backgroundColor: THEME.background },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { color: THEME.white, fontSize: 18, fontWeight: '900' },
  headerInfo: { flex: 1, marginLeft: 14 },
  userName: { fontSize: 16, fontWeight: '800', color: THEME.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  timeText: { fontSize: 11, color: THEME.textSub, fontWeight: '600' },
  moreBtn: { padding: 4 },

  postBodyContainer: { marginBottom: 16 },
  postTitle: { fontSize: 18, fontWeight: '800', color: THEME.text, marginBottom: 6 },
  postBodyText: { fontSize: 14, color: THEME.textSub, lineHeight: 22, fontWeight: '500' },

  postImageContainer: { width: '100%', height: 300, borderRadius: 24, overflow: 'hidden', marginBottom: 16 },
  postImage: { width: '100%', height: '100%' },

  postFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  interactionRow: { flexDirection: 'row', gap: 20 },
  actionItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontSize: 13, color: THEME.textSub, fontWeight: '700' },
  shareBtn: { padding: 4 },

  // Skeletons
  skeletonCard: { backgroundColor: THEME.surface, borderRadius: 32, padding: 20, marginHorizontal: 15, marginBottom: 20 },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center' },
  skeletonAvatar: { width: 48, height: 48, borderRadius: 20, backgroundColor: '#E1E9EE' },
  skeletonTextCont: { marginLeft: 14, flex: 1 },
  skeletonLine: { height: 12, backgroundColor: '#E1E9EE', borderRadius: 6 },
  skeletonImage: { width: '100%', height: 200, backgroundColor: '#E1E9EE', borderRadius: 24, marginTop: 20 },

  loadingText: { marginTop: 20, color: THEME.primary, fontWeight: '800' },
  errorText: { color: THEME.textSub, textAlign: 'center', marginTop: 20 },
  retryBtn: { marginTop: 20, backgroundColor: THEME.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  retryText: { color: THEME.white, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: THEME.textSub, fontStyle: 'italic' },
});
