import { MotionAction, type VerisoulEnvironment } from '../utils/Enums';
import { NativeModules } from './NativePackage';
import { type NativeModule } from 'react-native';

export interface NativeVerisoulModule extends NativeModule {
  configure(environment: VerisoulEnvironment, projectId: string): Promise<void>;

  getSessionId(): Promise<string>;
  onActionEvent(x: number, y: number, action: MotionAction): Promise<void>;
}

export const NativeVerisoul: NativeVerisoulModule =
  NativeModules.VerisoulReactnative;
