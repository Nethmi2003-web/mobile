import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function MyClaimsScreen() {
  const { logout } = useContext(AuthContext);
  const [claims, setClaims] = useState([]);

  const fetchMyClaims = async () => {
    try {
      const response = await client.get('/claims/myclaims');
      setClaims(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const renderClaim = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.item?.title || 'Unknown Item'}</Text>
        <StatusBadge label={item.status} />
      </View>
      <Text style={styles.date}>Filed on: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.proofText}>My Proof: {item.proofDescription}</Text>
      {item.adminNotes ? (
        <Text style={styles.notes}>Note: {item.adminNotes}</Text>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.screenHeader}>My Claims Tracker</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={claims}
        keyExtractor={(item) => item._id}
        renderItem={renderClaim}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="You haven't filed any claims yet." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0' },
  screenHeader: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  logoutText: { fontSize: 12, color: '#DC2626', fontWeight: '600' },
  list: { padding: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  date: { fontSize: 10, color: '#94A3B8', marginVertical: 4 },
  proofText: { fontSize: 12, color: '#334155' },
  notes: { fontSize: 11, fontStyle: 'italic', color: '#64748B', marginTop: 4 }
});
