import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { BackButton } from '@/features/group/components/back-button/back-button';
import { ReportConsequence } from '@/features/group/components/report-consequence/report-consequence';
import { ReportMemberActions } from '@/features/group/components/report-member-actions/report-member-actions';
import { ReportMemberSummary } from '@/features/group/components/report-member-summary/report-member-summary';
import { type GroupMemberProfile } from '@/features/group/helpers/myGroup/myGroup';

export type MemberReportProps = {
  profile: GroupMemberProfile;
  onReport: () => Promise<void>;
  onReported: () => void;
  onCancel: () => void;
};

export function MemberReport({ profile, onReport, onReported, onCancel }: MemberReportProps) {
  const { firstName } = profile.member;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <BackButton onPress={onCancel} />
      </View>
      <ReportMemberSummary profile={profile} />

      <ThemedText type="title" style={styles.title}>
        Signaler {firstName} ?
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.intro}>
        Si quelque chose s’est mal passé, tu peux signaler {firstName}. Voici ce qui se passe
        ensuite :
      </ThemedText>

      <View style={styles.consequences}>
        <ReportConsequence
          icon={{ ios: 'nosign', android: 'block', web: 'block' }}
          text="Vous ne serez plus jamais placés dans le même groupe. Ton groupe de cette semaine ne change pas."
        />
        <ReportConsequence
          icon={{ ios: 'shield', android: 'shield', web: 'shield' }}
          text="Un compte signalé par deux personnes différentes est banni automatiquement."
        />
        <ReportConsequence
          icon={{ ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' }}
          text={`${firstName} n’en saura rien.`}
        />
      </View>

      <View style={styles.spacer} />
      <ReportMemberActions
        firstName={firstName}
        onReport={onReport}
        onReported={onReported}
        onCancel={onCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: Colors.background,
  },
  header: {
    height: 44,
    justifyContent: 'center',
  },
  title: {
    marginTop: 24,
  },
  intro: {
    marginTop: 10,
  },
  consequences: {
    gap: 10,
    marginTop: 22,
  },
  spacer: {
    flex: 1,
  },
});
