import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Chat({ model, onClose }: { model: any, onClose: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Chat with {model.name}</Text>
      <Text style={{ color: '#888', marginBottom: 24 }}>This is a placeholder chat UI for the selected model.</Text>
      <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#7d3cff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 }}>
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
} 