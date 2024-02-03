import fs from 'fs';

export const assertFolder = (folderPath: string): string | null => {
  if (!fs.existsSync(folderPath)) {
    console.log('!existsSync');
    return '文件夹不存在';
  }
  const stat = fs.statSync(folderPath);
  if (!stat.isDirectory()) {
    console.log('!isDirectory');
    return '目标路径不是文件夹';
  }
  return null;
};

export const isFile = (filePath: string) => {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
};

export const isFolder = (folderPath: string) => {
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
};
