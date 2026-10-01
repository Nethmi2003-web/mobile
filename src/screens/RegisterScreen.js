import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill required fields.');
      return;
    }
    try {
      await register(name, email, password, phone);
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Error creating account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Account</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="University Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  title: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 }
});
