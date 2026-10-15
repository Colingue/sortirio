import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

export type PickedPhoto = { type: 'picked'; uri: string } | { type: 'cancelled' };

export type PhotoSource = 'camera' | 'library' | null;

const CAMERA_LABEL = 'Prendre une photo';
const LIBRARY_LABEL = 'Choisir dans la galerie';
const CANCEL_LABEL = 'Annuler';

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.7,
};

function pickedFrom(result: ImagePicker.ImagePickerResult): PickedPhoto {
  if (result.canceled) return { type: 'cancelled' };

  const [asset] = result.assets;
  if (!asset) return { type: 'cancelled' };

  return { type: 'picked', uri: asset.uri };
}

export async function pickFromLibrary(): Promise<PickedPhoto> {
  return pickedFrom(await ImagePicker.launchImageLibraryAsync(pickerOptions));
}

export async function takePhoto(): Promise<PickedPhoto> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return { type: 'cancelled' };

  return pickedFrom(await ImagePicker.launchCameraAsync(pickerOptions));
}

export function askPhotoSource(): Promise<PhotoSource> {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [CAMERA_LABEL, LIBRARY_LABEL, CANCEL_LABEL], cancelButtonIndex: 2 },
        (index) => resolve(index === 0 ? 'camera' : index === 1 ? 'library' : null),
      );
      return;
    }

    Alert.alert(
      'Ta photo',
      undefined,
      [
        { text: CANCEL_LABEL, style: 'cancel', onPress: () => resolve(null) },
        { text: LIBRARY_LABEL, onPress: () => resolve('library') },
        { text: CAMERA_LABEL, onPress: () => resolve('camera') },
      ],
      { cancelable: true, onDismiss: () => resolve(null) },
    );
  });
}

export async function pickPhoto(): Promise<PickedPhoto> {
  const source = await askPhotoSource();
  if (source === 'camera') return takePhoto();
  if (source === 'library') return pickFromLibrary();
  return { type: 'cancelled' };
}
