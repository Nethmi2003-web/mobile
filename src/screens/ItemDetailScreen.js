import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function ItemDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);

  const fetchItemDetails = async () => {
    try {
      const response = await client.get(`/items/${id}`);
      setItem(response.data);
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch item details.');
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to remove this listing?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await client.delete(`/items/${id}`);
            navigation.goBack();
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Delete failed.');
          }
        }
      }
    ]);
  };

  if (!item) return null;

  const isOwner = user && item.createdBy && user._id === item.createdBy._id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <StatusBadge label={item.type} />
          <StatusBadge label={item.status} />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>Category: {item.category}</Text>
        <Text style={styles.meta}>Location: {item.location}</Text>
        <Text style={styles.meta}>Date: {new Date(item.dateOccurred).toLocaleDateString()}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.divider} />
        <Text style={styles.sectionHeader}>Contact Information</Text>
        <Text style={styles.meta}>Posted by: {item.createdBy?.name || 'Anonymous'}</Text>
        <Text style={styles.meta}>Email: {item.createdBy?.email || 'N/A'}</Text>
        <Text style={styles.meta}>Phone: {item.createdBy?.phone || 'N/A'}</Text>
        <View style={styles.actionSection}>
          {isOwner ? (
            <>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('ItemClaims', { itemId: item._id })}
              >
                <Text style={styles.btnText}>View Claims</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate('EditItem', { item })}
              >
                <Text style={styles.secondaryBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dangerBtn} onPress={handleDelete}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </>
          ) : (
            item.status === 'Open' && (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('ClaimItem', { itemId: item._id })}
              >
                <Text style={styles.btnText}>Claim This Item</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 14 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  meta: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  sectionHeader: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  description: { fontSize: 13, color: '#334155', lineHeight: 18 },
  actionSection: { marginTop: 16 },
  primaryBtn: { backgroundColor: '#2563EB', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  secondaryBtn: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 8 },
  dangerBtn: { backgroundColor: '#DC2626', padding: 12, borderRadius: 6, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  secondaryBtnText: { color: '#334155', fontWeight: '600', fontSize: 13 }
});
