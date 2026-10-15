import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS } from 'react-native';

import { pickPhoto } from './photo';

jest.mock('expo-image-picker', () => ({
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(),
}));

const mockLaunchCamera = ImagePicker.launchCameraAsync as jest.Mock;
const mockLaunchLibrary = ImagePicker.launchImageLibraryAsync as jest.Mock;
const mockRequestCamera = ImagePicker.requestCameraPermissionsAsync as jest.Mock;
const picked = { canceled: false, assets: [{ uri: 'file://me.jpg' }] };

function chooseSheetOption(index: number) {
  jest
    .spyOn(ActionSheetIOS, 'showActionSheetWithOptions')
    .mockImplementation((_options, onChoose) => onChoose(index));
}

beforeEach(() => jest.clearAllMocks());

describe('pickPhoto', () => {
  it('opens the camera when the camera is chosen and allowed', async () => {
    chooseSheetOption(0);
    mockRequestCamera.mockResolvedValue({ granted: true });
    mockLaunchCamera.mockResolvedValue(picked);

    await expect(pickPhoto()).resolves.toEqual({ type: 'picked', uri: 'file://me.jpg' });
    expect(mockLaunchLibrary).not.toHaveBeenCalled();
  });

  it('gives nothing when the camera is refused', async () => {
    chooseSheetOption(0);
    mockRequestCamera.mockResolvedValue({ granted: false });

    await expect(pickPhoto()).resolves.toEqual({ type: 'cancelled' });
    expect(mockLaunchCamera).not.toHaveBeenCalled();
  });

  it('opens the library when the library is chosen', async () => {
    chooseSheetOption(1);
    mockLaunchLibrary.mockResolvedValue(picked);

    await expect(pickPhoto()).resolves.toEqual({ type: 'picked', uri: 'file://me.jpg' });
    expect(mockLaunchCamera).not.toHaveBeenCalled();
  });

  it('opens nothing when cancelled', async () => {
    chooseSheetOption(2);

    await expect(pickPhoto()).resolves.toEqual({ type: 'cancelled' });
    expect(mockLaunchCamera).not.toHaveBeenCalled();
    expect(mockLaunchLibrary).not.toHaveBeenCalled();
  });
});
