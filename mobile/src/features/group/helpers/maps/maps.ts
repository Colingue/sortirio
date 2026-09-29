import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

export function buildMapsSearchUrl(address: string, os: 'ios' | 'android'): string {
  const query = encodeURIComponent(address);

  return os === 'ios' ? `maps://?q=${query}` : `geo:0,0?q=${query}`;
}

export async function openMapsForAddress(address: string): Promise<void> {
  try {
    await Linking.openURL(buildMapsSearchUrl(address, Platform.OS === 'ios' ? 'ios' : 'android'));
  } catch {
    return;
  }
}
