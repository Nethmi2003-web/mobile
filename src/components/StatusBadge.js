import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBadge({ label }) {
  const getBadgeStyle = () => {
    switch (label) {
      case 'Lost':
      case 'Rejected':
        return { bg: '#FEE2E2', text: '#991B1B' };
      case 'Found':
      case 'Resolved':
      case 'Approved':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'Claim Pending':
      case 'Pending':
      default:
        return { bg: '#FEF3C7', text: '#92400E' };
    }
  };

  const style = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start'
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase'
  }
});
