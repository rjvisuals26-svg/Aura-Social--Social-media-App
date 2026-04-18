import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import BASE_URL from '../src/api/apiConfig';


const { width, height } = Dimensions.get('window');
// const BASE_URL = 'http://192.168.1.113:3000';


const THEME = {
  background: '#F8F9FD',
  surface: '#FFFFFF',
  primary: '#6C5CE7',
  secondary: '#FF7675',
  accent: '#55EFC4',
  text: '#2D3436',
  textSub: '#636E72',
  aura: ['#6C5CE7', '#A29BFE'],
  glass: 'rgba(255, 255, 255, 0.9)',
};

export default function PostDetails({ postId, onBack }) {
  const insets = useSafeAreaInsets();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/posts/${postId}`);
      if (!response.ok) throw new Error('Details not found');
      const data = await response.json();
      setPost(data);
    } catch (err) {
      setError('Could not load pulse details. Try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  if (loading) {
     return (
        <View style={styles.centered}>
           <ActivityIndicator size="large" color="#6C5CE7" />
           <Text style={styles.loadingText}>Unfolding Pulse...</Text>
        </View>
     );
  }

  if (error) {
     return (
        <View style={styles.centered}>
           <Text style={styles.errorText}>{error}</Text>
           <TouchableOpacity style={styles.backBtn} onPress={onBack}>
              <Text style={styles.backText}>Go Back</Text>
           </TouchableOpacity>
        </View>
     );
  }

  // --- Image & Avatar Mapping ---
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

  const postImg = `https://loremflickr.com/800/800/${getPostKeywords(post.title)}?lock=${postId}`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" transparent />
      
      <TouchableOpacity 
        onPress={onBack} 
        style={[styles.floatingBack, { top: insets.top + 10 }]}
      >
        <Ionicons name="chevron-back" size={24} color={THEME.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image source={{ uri: postImg }} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient colors={['rgba(0,0,0,0.1)', 'transparent']} style={StyleSheet.absoluteFill} />
        </View>

        <View style={styles.contentCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarLargeWrapper}>
              <Image source={{ uri: getUserAvatar(post.user_id) }} style={styles.avatarImg} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userNameLarge}>{post.user_id}</Text>
              <Text style={styles.postMeta}>Pulse Alpha • 2h ago</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fullTitle}>{post.title}</Text>
          <View style={styles.tagRow}>
             <View style={styles.tag}><Text style={styles.tagText}>#Minimal</Text></View>
             <View style={styles.tag}><Text style={styles.tagText}>#Aura</Text></View>
          </View>

          <Text style={styles.fullBody}>{post.body}</Text>

          <View style={styles.interactionBoard}>
            <View style={styles.statBox}>
              <View style={[styles.iconCircle, { backgroundColor: '#FF767520' }]}>
                <Ionicons name="heart" size={22} color="#FF7675" />
              </View>
              <Text style={styles.statVal}>{post.likes}</Text>
              <Text style={styles.statLabel}>LIKES</Text>
            </View>
            <View style={styles.statBox}>
              <View style={[styles.iconCircle, { backgroundColor: '#6C5CE720' }]}>
                <Ionicons name="chatbubble" size={20} color="#6C5CE7" />
              </View>
              <Text style={styles.statVal}>48</Text>
              <Text style={styles.statLabel}>CHATS</Text>
            </View>
            <View style={styles.statBox}>
              <View style={[styles.iconCircle, { backgroundColor: '#55EFC420' }]}>
                <Ionicons name="arrow-redo" size={22} color="#55EFC4" />
              </View>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLabel}>SENDS</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
          >
            <LinearGradient colors={THEME.aura} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.actionBtnGrad}>
              <Text style={styles.actionBtnText}>Pulse into Chat</Text>
              <Feather name="arrow-right" size={18} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  floatingBack: { 
    position: 'absolute', left: 20, zIndex: 10,
    width: 44, height: 44, borderRadius: 15, backgroundColor: THEME.glass,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },

  scrollContent: { paddingBottom: 60 },
  heroSection: { width: width, height: height * 0.4, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },

  contentCard: { 
    padding: 24, paddingTop: 30, marginTop: -40, backgroundColor: THEME.surface,
    borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1,
  },

  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatarLargeWrapper: { width: 56, height: 56, borderRadius: 24, overflow: 'hidden', backgroundColor: THEME.background },
  avatarImg: { width: '100%', height: '100%' },
  profileInfo: { flex: 1, marginLeft: 15 },
  userNameLarge: { fontSize: 18, fontWeight: '800', color: THEME.text },
  postMeta: { fontSize: 12, color: THEME.textSub, marginTop: 2, fontWeight: '600' },
  followBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: THEME.background },
  followText: { color: THEME.primary, fontWeight: '700', fontSize: 12 },

  fullTitle: { fontSize: 26, fontWeight: '900', color: THEME.text, lineHeight: 34, marginBottom: 12 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: THEME.background },
  tagText: { fontSize: 11, fontWeight: '700', color: THEME.primary },

  fullBody: { fontSize: 16, color: THEME.textSub, lineHeight: 26, fontWeight: '500' },

  interactionBoard: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 30, 
    paddingHorizontal: 10, 
    paddingVertical: 24, 
    backgroundColor: THEME.background, 
    borderRadius: 30 
  },
  statBox: { alignItems: 'center', flex: 1 },
  iconCircle: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statVal: { fontSize: 18, fontWeight: '900', color: THEME.text },
  statLabel: { fontSize: 10, color: THEME.textSub, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },

  actionButton: { marginTop: 30, borderRadius: 22, overflow: 'hidden', elevation: 8, shadowColor: THEME.primary, shadowOpacity: 0.3, shadowRadius: 15 },
  actionBtnGrad: { height: 64, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  loadingText: { marginTop: 20, color: THEME.primary, fontWeight: '800' },
  errorText: { color: THEME.textSub, textAlign: 'center', marginBottom: 20 },
  backBtn: { backgroundColor: '#6C5CE7', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20 },
  backText: { color: '#FFFFFF', fontWeight: 'bold' },
});
