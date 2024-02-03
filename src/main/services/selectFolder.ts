import { dialog } from 'electron';

export const selectFolder = async () => {
  return dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
};
