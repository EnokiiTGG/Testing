import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { router } from 'expo-router';

export default function RecipesBrowse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'recipes'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, async (snap) => {
      const list = await Promise.all(
        snap.docs.map(async (d) => {
          const x = d.data();
          let url = x.imageURL || '';
          if (!url && x.imageStoragePath) {
            try { url = await getDownloadURL(ref(storage, x.imageStoragePath)); } catch {}
          }
          return { id: d.id, ...x, imageURL: url };
        })
      );
      setItems(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ padding: 12, gap: 6 }}>
      {item.imageURL ? (
        <Image source={{ uri: item.imageURL }} style={{ height: 180, borderRadius: 12 }} />
      ) : null}
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{item.title}</Text>
      {item.description ? <Text style={{ color: '#666' }}>{item.description}</Text> : null}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      ) : items.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>No recipes yet</Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            Be the first to share a healthy recipe! Tap the + button to submit. 
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      {/* Floating + button */}
      <Pressable
        onPress={() => router.push('/(tabs)/recipes/new')}
        style={({ pressed }) => ({
          position: 'absolute',
          right: 20,
          bottom: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: pressed ? '#0ea5e9' : '#06b6d4',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 6,
        })}
      >
        <Text style={{ color: 'white', fontSize: 28, marginTop: -2 }}>＋</Text>
      </Pressable>
    </View>
  );
}
