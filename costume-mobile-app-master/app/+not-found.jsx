import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Unmatched Route</Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 20 }}>Page could not be found.</Text>
      <Link href="/" asChild>
        <Pressable style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#111', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Go to Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
