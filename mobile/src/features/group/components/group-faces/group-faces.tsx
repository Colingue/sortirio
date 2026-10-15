import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { Colors } from '@/constants/theme';

const FACE_SIZE = 34;

export function GroupFaces({ firstNames }: { firstNames: string[] }) {
  return (
    <View
      style={styles.faces}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {firstNames.slice(0, 2).map((firstName, index) => (
        <MemberAvatar
          key={`${firstName}-${index}`}
          firstName={firstName}
          photoUrl={null}
          size={FACE_SIZE}
          colorIndex={index}
          style={[styles.face, index === 0 ? styles.topLeft : styles.bottomRight]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  faces: {
    width: 52,
    height: 52,
  },
  face: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.backgroundElement,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  bottomRight: {
    right: 0,
    bottom: 0,
  },
});
