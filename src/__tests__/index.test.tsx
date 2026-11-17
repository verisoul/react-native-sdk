jest.mock('../native/NativeVerisoul', () => ({
  NativeVerisoul: {
    configure: jest.fn(() => Promise.resolve()),
    reinitialize: jest.fn(() => Promise.resolve()),
    getSessionId: jest.fn(() => Promise.resolve('session-id')),
    onActionEvent: jest.fn(() => Promise.resolve()),
  },
}));

import { configure } from '../modules/Verisoul';
import { NativeVerisoul } from '../native/NativeVerisoul';
import { VerisoulEnvironment } from '../utils/Enums';

describe('configure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards the custom hostname to the native module', async () => {
    await configure({
      environment: VerisoulEnvironment.production,
      projectId: 'project-id',
      customHostname: 'js.example.com',
    });

    expect(NativeVerisoul.configure).toHaveBeenCalledWith(
      VerisoulEnvironment.production,
      'project-id',
      'js.example.com'
    );
  });

  it('forwards null when no custom hostname is set', async () => {
    await configure({
      environment: VerisoulEnvironment.production,
      projectId: 'project-id',
    });

    expect(NativeVerisoul.configure).toHaveBeenCalledWith(
      VerisoulEnvironment.production,
      'project-id',
      null
    );
  });
});
