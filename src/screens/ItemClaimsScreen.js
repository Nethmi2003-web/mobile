import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import client from '../api/client';
import StatusBadge from '../components/StatusBadge';
import EmptyState from '../components/EmptyState';

export default function ItemClaimsScreen({ route }) {
  const { itemId } = route.params;
  const [claims, setClaims] = useState([]);

  const fetchClaims = async () => {
    try {
      const response = await client.get(`/claims/item/${itemId}`);
      setClaims(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [itemId]);

  const handleStatusChange = async (claimId, status) => {
    try {
      await client.put(`/claims/${claimId}`, { status });
      Alert.alert('Success', `Claim set to ${status}.`);
      fetchClaims();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Action failed.');
    }
  };

  const renderClaim = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.claimantName}>{item.claimant?.name || 'Unknown'}</Text>
        <StatusBadge label={item.status} />
      </View>
      <Text style={styles.contact}>Email: {item.claimant?.email}</Text>
      <Text style={styles.contact}>Phone: {item.claimant?.phone || 'N/A'}</Text>
      <Text style={styles.proofHeader}>Proof Provided:</Text>
      <Text style={styles.proof}>{item.proofDescription}</Text>
      {item.status === 'Pending' && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleStatusChange(item._id, 'Approved')}
          >
            <Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleStatusChange(item._id, 'Rejected')}
          >
            <Text style={styles.btnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={claims}
        keyExtractor={(item) => item._id}
        renderItem={renderClaim}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState message="No claims submitted for this item." />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  list: { padding: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  claimantName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  contact: { fontSize: 11, color: '#64748B', marginTop: 2 },
  proofHeader: { fontSize: 12, fontWeight: '600', color: '#334155', marginTop: 8 },
  proof: { fontSize: 12, color: '#334155', fontStyle: 'italic', marginTop: 2 },
  actions: { flexDirection: 'row', marginTop: 12, borderTopWidth: 1, borderColor: '#F1F5F9', paddingTop: 8 },
  approveBtn: { flex: 1, backgroundColor: '#16A34A', padding: 8, borderRadius: 4, alignItems: 'center', marginRight: 6 },
  rejectBtn: { flex: 1, backgroundColor: '#DC2626', padding: 8, borderRadius: 4, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' }
});
