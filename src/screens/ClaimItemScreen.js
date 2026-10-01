import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import client from '../api/client';

export default function ClaimItemScreen({ route, navigation }) {
  const { itemId } = route.params;
  const [proofDescription, setProofDescription] = useState('');

  const handleSubmitClaim = async () => {
    if (!proofDescription) {
      Alert.alert('Error', 'Please describe proof of ownership.');
      return;
    }
    try {
      await client.post('/claims', { itemId, proofDescription });
      Alert.alert('Success', 'Claim submitted for verification.');
      navigation.popToTop();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Submission failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Claim Ownership Verification</Text>
      <Text style={styles.subtitle}>
        Provide details confirming ownership (e.g. serial numbers, unique markings, internal contents).
      </Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter proof description..."
        value={proofDescription}
        onChangeText={setProofDescription}
        multiline
        numberOfLines={6}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitClaim}>
        <Text style={styles.buttonText}>Submit Claim</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FFFFFF' },
  title: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginVertical: 8, lineHeight: 16 },
  textArea: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 6, height: 120, textAlignVertical: 'top', marginTop: 8 },
  button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 }
});
