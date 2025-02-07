import type { VerisoulEnvironment } from '../utils/Enums';
import { NativeModules } from './NativePackage';
import { type NativeModule } from 'react-native';

export interface NativeVerisoulModule extends NativeModule {
  configure(environment: VerisoulEnvironment, projectId: string): Promise<void>;

  getSessionId(): Promise<string>;
}

export const NativeVerisoul: NativeVerisoulModule =
  NativeModules.VerisoulReactnative;
