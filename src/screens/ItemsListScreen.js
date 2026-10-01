import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, RefreshControl } from 'react-native';
import client from '../api/client';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function ItemsListScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await client.get(`/items?search=${search}`);
      setItems(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [search]);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ItemDetail', { id: item._id })}>
      <View style={styles.cardHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <StatusBadge label={item.type} />
      </View>
      <Text style={styles.itemCategory}>{item.category} • {item.location}</Text>
      <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <StatusBadge label={item.status} />
        <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items by keyword, location..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('AddItem')}>
          <Text style={styles.addBtnText}>+ Report</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyState message="No matching items found." />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  searchContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  searchInput: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, paddingHorizontal: 12, height: 40, fontSize: 13 },
  addBtn: { backgroundColor: '#2563EB', marginLeft: 8, paddingHorizontal: 12, borderRadius: 6, justifyContent: 'center' },
  addBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  listContent: { padding: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  itemCategory: { fontSize: 11, color: '#64748B', marginVertical: 4 },
  itemDesc: { fontSize: 12, color: '#334155', marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTopWidth: 1, borderColor: '#F1F5F9' },
  date: { fontSize: 10, color: '#94A3B8' }
});
