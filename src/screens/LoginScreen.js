import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campus Lost & Found</Text>
      <Text style={styles.subtitle}>Sign in to your university account</Text>
      <TextInput
        style={styles.input}
        placeholder="Campus Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  title: { fontSize: 24, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 24, marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', padding: 12, borderRadius: 6, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: '#2563EB', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  linkText: { color: '#2563EB', textAlign: 'center', marginTop: 16, fontSize: 13 }
});
