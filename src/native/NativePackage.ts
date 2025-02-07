import { NativeModules as ReactNativeModules } from 'react-native';
import type { NativeVerisoulModule } from './NativeVerisoul';

export interface VerisoulNativePackage {
  VerisoulReactnative: NativeVerisoulModule;
}

export const NativeModules = ReactNativeModules as VerisoulNativePackage;
