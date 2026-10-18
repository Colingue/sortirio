import { StyleSheet, View } from 'react-native';

import { MemberAvatar } from '@/components/member-avatar';
import { Colors } from '@/constants/theme';
import { type GroupFace } from '@/features/group/helpers/myGroups/myGroups';

const FACE_SIZE = 34;

export function GroupFaces({ faces }: { faces: GroupFace[] }) {
  return (
    <View
      style={styles.faces}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {faces.slice(0, 2).map((face, index) => (
        <MemberAvatar
          key={`${face.firstName}-${index}`}
          firstName={face.firstName}
          photoUrl={face.photoUrl}
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
