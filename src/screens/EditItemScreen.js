import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import client from '../api/client';

export default function EditItemScreen({ route, navigation }) {
  const { item } = route.params;
  const [title, setTitle] = useState(item.title);
  const [category, setCategory] = useState(item.category);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [status, setStatus] = useState(item.status);

  const handleUpdate = async () => {
    try {
      await client.put(`/items/${item._id}`, {
        title,
        category,
        description,
        location,
        status
      });
      Alert.alert('Success', 'Listing updated successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Status</Text>
      <View style={styles.row}>
        {['Open', 'Claim Pending', 'Resolved'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, status === s && styles.activeChip]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.chipText, status === s && styles.activeChipText]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 10, borderRadius: 6, fontSize: 13 },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 16, marginRight: 6, marginBottom: 6 },
  activeChip: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 11, color: '#334155' },
  activeChipText: { color: '#FFFFFF', fontWeight: '600' },
  button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 }
});
