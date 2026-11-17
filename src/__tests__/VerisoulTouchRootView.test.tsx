jest.mock('../native/NativeVerisoul', () => ({
  NativeVerisoul: {
    configure: jest.fn(() => Promise.resolve()),
    reinitialize: jest.fn(() => Promise.resolve()),
    getSessionId: jest.fn(() => Promise.resolve('session-id')),
    onActionEvent: jest.fn(() => Promise.resolve()),
  },
}));

import { Platform } from 'react-native';
import { NativeVerisoul } from '../native/NativeVerisoul';
import { MotionAction } from '../utils/Enums';
import { VerisoulTouchRootView } from '../widget/VerisoulTouchRootView';

const touch = { pageX: 120, pageY: 300, locationX: 20, locationY: 40 };

describe('VerisoulTouchRootView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
  });

  it('forwards one press at its screen position', () => {
    // The component has no hooks, so calling it returns the root View element.
    const view = VerisoulTouchRootView({});

    view.props.onTouchStart({ nativeEvent: touch });

    expect(NativeVerisoul.onActionEvent).toHaveBeenCalledTimes(1);
    expect(NativeVerisoul.onActionEvent).toHaveBeenCalledWith(
      120,
      300,
      MotionAction.ACTION_DOWN
    );
  });

  it('keeps touch end and cancel in JavaScript', () => {
    // The component has no hooks, so calling it returns the root View element.
    const view = VerisoulTouchRootView({});

    expect(view.props.onTouchEnd).toBeUndefined();
    expect(view.props.onTouchCancel).toBeUndefined();
  });
});
