import { ipcRenderer } from 'electron';
import type { FormatParams, FormatedFile } from '../main/services/formatter';

type CommonRes<T> =
  | {
      code: 0;
      success: true;
      res: T;
    }
  | {
      code: 1;
      success: false;
      message: string;
    };

// Custom APIs for renderer
export const customApi = {
  test: (...props) => ipcRenderer.invoke('test', ...props),

  selectFolder: (): Promise<Electron.OpenDialogReturnValue> => ipcRenderer.invoke('select-folder'),
  assertFolder: (folderPath: string) => {
    return ipcRenderer.invoke('assert-folder', folderPath);
  },

  // batchTransformData: (folderPath: string): Promise<CommonRes<string[]>> => {
  //   return ipcRenderer.invoke('batch-transform-data', folderPath);
  // },

  batchFormatData: (params: FormatParams): Promise<CommonRes<FormatedFile[]>> => {
    return ipcRenderer.invoke('batch-format-data', params);
  },
};
