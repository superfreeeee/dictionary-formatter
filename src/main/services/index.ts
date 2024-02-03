import { ipcMain } from 'electron';
import { selectFolder } from './selectFolder';
import { assertFolder } from './fs-extra';
import { CommonRes } from '../types';
import { FormatParams, FormatedFile, formatAndPersist } from './formatter';

export const registerServiceHandlers = () => {
  ipcMain.handle('select-folder', () => {
    return selectFolder().then((res) => {
      console.log('dialog.showOpenDialog', res);
      return res;
    });
  });

  ipcMain.handle('assert-folder', (_, folderPath: string) => {
    console.log('assert-folder', { folderPath });
    return assertFolder(folderPath);
  });

  ipcMain.handle(
    'batch-format-data',
    async (_, params: FormatParams): Promise<CommonRes<FormatedFile[]>> => {
      try {
        const files = await formatAndPersist(params);
        return {
          code: 0,
          success: true,
          res: files,
        };
      } catch (error: any) {
        return {
          code: 1,
          success: false,
          message: error.message,
        };
      }
    },
  );

  ipcMain.handle('test', async () => {
    console.log('test');
  });
};
