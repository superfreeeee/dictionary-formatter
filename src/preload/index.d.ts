import { ElectronAPI } from '@electron-toolkit/preload';
import { customApi } from './customApi';

type CustomAPI = typeof customApi & {
  [other: string]: any;
};

declare global {
  interface Window {
    electron: ElectronAPI;
    api: CustomAPI;
  }
}
