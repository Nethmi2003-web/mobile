import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ message = 'No records found.' }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center'
  }
});
