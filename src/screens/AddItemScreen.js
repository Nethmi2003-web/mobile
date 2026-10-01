import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import client from '../api/client';

export default function AddItemScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [type, setType] = useState('Lost');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert('Error', 'Please fill in all mandatory fields.');
      return;
    }
    try {
      await client.post('/items', {
        title,
        category,
        type,
        description,
        location
      });
      Alert.alert('Success', 'Item posted successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Posting failed.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Blue Backpack" />

      <Text style={styles.label}>Listing Type</Text>
      <View style={styles.row}>
        {['Lost', 'Found'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, type === t && styles.activeChip]}
            onPress={() => setType(t)}
          >
            <Text style={[styles.chipText, type === t && styles.activeChipText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Category</Text>
      <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Category" />

      <Text style={styles.label}>Location *</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="e.g. Science Building Lab 3" />

      <Text style={styles.label}>Description *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholder="Provide distinct characteristics or identification markings..."
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Publish Listing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4, marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 10, borderRadius: 6, fontSize: 13 },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', marginBottom: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 20, marginRight: 8 },
  activeChip: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  chipText: { fontSize: 12, color: '#334155' },
  activeChipText: { color: '#FFFFFF', fontWeight: '600' },
  button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 }
});
