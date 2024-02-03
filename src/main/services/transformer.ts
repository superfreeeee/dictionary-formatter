import path from 'path';
import fs from 'fs';
import readline from 'readline';
import { isFile, isFolder } from './fs-extra';

type Item = Record<string, string>;

const DATA_DIR = 'data';

/**
 * 批量转换数据
 * 1. 读目录
 * 2. 并行转换后写文件
 * @param folderPath
 * @returns
 */
export const batchTransformRawData = async (folderPath: string): Promise<TransformedFile[]> => {
  if (!isFolder(folderPath)) {
    console.warn('[batchTransformRawData.ignore] 目标路径不是文件夹', folderPath);
    return [];
  }

  const files = fs.readdirSync(folderPath);

  const trasformedFiles = await Promise.all(
    files.map((file) => transformRawData(path.join(folderPath, file))),
  ).then((files) => files.filter((info): info is TransformedFile => !!info));

  console.log('[batchTransformRawData] done');
  return trasformedFiles;
};

export type TransformedFile = {
  source: string;
  result: string;
  fileName: string;
};

/**
 * 单文件转换
 * 1. 校验文件类型
 * 2. 读原始文件 => 中间格式
 * 3. 缓存数据
 * @param filePath
 * @returns
 */
export const transformRawData = async (
  filePath: string,
  { enableWarning = false }: { enableWarning?: boolean } = {},
): Promise<TransformedFile | undefined> => {
  if (!isFile(filePath)) {
    enableWarning && console.warn(`[structureData.ignore] 文件不存在 or 非文件类型: ${filePath}`);
    return;
  }

  const { dir, name, ext } = path.parse(filePath);
  if (ext !== '.md') {
    enableWarning && console.warn(`[structureData.ignore] 非指定后缀(.md): ${filePath}`);
    return;
  }

  const outDir = path.join(dir, DATA_DIR);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const data = await readFileToStructuredData(filePath);

  const targetFile = path.join(outDir, `${name}.json`);
  fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));

  console.log('[structureData] done, targetFile', targetFile);

  return {
    source: filePath,
    result: targetFile,
    fileName: name,
  };
};

const WORD_START_REG = /^([a-zA-Z]+)$/;
const WORD_FIELD_REG = /^\s*-(.*?):(.*)/;

/**
 * 抽取文件内容，转化成中间对象
 * 保存成 JSON
 * @param filePath
 * @returns
 */
const readFileToStructuredData = (filePath: string) => {
  return new Promise((resolve) => {
    const reader = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    const data: Item[] = [];

    let foundFirst = false;
    let currentItem: Item = {};
    reader.on('line', (line) => {
      // 匹配到第一个之前
      if (!foundFirst) {
        const matched = line.match(WORD_START_REG);
        if (!matched) return;

        const word = matched[1].trim();
        currentItem.word = word;
        foundFirst = true; // start first item
        return;
      }

      // 匹配第一个之后
      if (WORD_START_REG.test(line)) {
        // 匹配行首 => 终结上一笔数据
        data.push(currentItem);
        currentItem = {};

        const matched = line.match(WORD_START_REG);
        if (matched) {
          const word = matched[1].trim();
          currentItem.word = word;
        } else {
          currentItem.word = '<empty word>';
        }
      } else if (WORD_FIELD_REG.test(line)) {
        // 匹配字段 => 加入当前数据
        const matched = line.match(WORD_FIELD_REG);
        if (!matched) return;

        const key = matched[1].trim();
        const value = matched[2].trim();
        currentItem[key] = value;
      }
    });

    reader.on('close', () => {
      if (currentItem.word) {
        data.push(currentItem);
      }
      resolve(data);
    });
  });
};
