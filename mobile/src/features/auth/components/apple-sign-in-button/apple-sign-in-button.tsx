import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, StyleSheet } from 'react-native';

import { Radius } from '@/constants/theme';

export function AppleSignInButton({ busy, onPress }: { busy: boolean; onPress: () => void }) {
  if (Platform.OS !== 'ios') return null;

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={Radius.medium}
      onPress={onPress}
      style={[styles.button, busy && styles.dimmed]}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54,
    marginBottom: 12,
  },
  dimmed: {
    opacity: 0.7,
  },
});
