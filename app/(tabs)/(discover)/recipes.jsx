import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { db, storage } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

export default function Recipes() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const q = query(collection(db, 'recipes'),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, async snap => {
      const list = await Promise.all(snap.docs.map(async d => {
        const x = d.data();
        let url = x.imageURL || '';
        if (!url && x.imageStoragePath) { url = await getDownloadURL(ref(storage, x.imageStoragePath)); }
        return { id: d.id, ...x, imageURL: url };
      }));
      setItems(list);
    });
    return () => unsub();
  }, []);
  return (
    <FlatList
      data={items}
      keyExtractor={i => i.id}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
          {item.imageURL ? <Image source={{ uri: item.imageURL }} style={{ height: 180, borderRadius: 8 }} /> : null}
          <Text style={{ fontSize: 18, fontWeight: '700', marginTop: 6 }}>{item.title}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
}
