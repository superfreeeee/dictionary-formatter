import fs from 'fs';
import path from 'path';
import { TransformedFile, batchTransformRawData } from './transformer';

export type FormatParams = { source: string; template: string };

const OUTPUT_DIR = 'out';

export type FormatedFile = {
  source: string;
  data: string;
  result: string;
  resultName: string;
};

export const formatAndPersist = async ({ source, template }: FormatParams) => {
  const files = await batchTransformRawData(source);

  const result = await Promise.all(
    files.map((file) => {
      return formatFile(file, { source, template });
    }),
  );

  console.log('[formatAndPersist] done');

  return result;
};

const formatFile = async (file: TransformedFile, { source, template }: FormatParams) => {
  const data = JSON.parse(fs.readFileSync(file.result).toString());
  const result = formatData(data, template);

  const outDir = path.join(source, OUTPUT_DIR);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  const outFile = path.join(outDir, `${file.fileName}.txt`);
  fs.writeFileSync(outFile, result);

  console.log('[formatFile] done, outFile', outFile);

  return {
    source: file.source,
    data: file.result,
    result: outFile,
    resultName: path.parse(outFile).base,
  };
};

const KEY_WORD = 'word';
const KEY_SENTENCE = 'SSAT-Level Sentence (English)';

const formatData = (data: Record<string, string>[], template: string) => {
  let resultStr = '';
  data.forEach((item) => {
    const result = template
      // 替换 {{}}
      .replaceAll(/{{\s*(.*?)\s*}}/g, (_, key) => {
        if (!item[key]) {
          return '';
        }
        if (key === KEY_SENTENCE) {
          // word => ___
          const word = item[KEY_WORD];
          return (item[key] as string).replace(new RegExp(word, 'i'), () => '_____');
        } else {
          // 直接返回
          return item[key];
        }
      });

    // console.log('formatData', {
    //   item,
    //   template,
    //   result,
    // });

    resultStr += `${result}\n`;
  });

  return resultStr;
};
