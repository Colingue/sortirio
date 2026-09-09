import * as ImagePicker from 'expo-image-picker';

export type PickedPhoto = { type: 'picked'; uri: string } | { type: 'cancelled' };

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
