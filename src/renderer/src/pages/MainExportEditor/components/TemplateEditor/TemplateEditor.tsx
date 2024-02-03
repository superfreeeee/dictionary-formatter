import { FC, useEffect, useMemo, useRef } from 'react';
import { Alert, Button, Form, Input } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import styles from './TemplateEditor.module.css';
import { KEY_SENTENCE, KEY_WORD } from '../../constants';

const DATA_SAMPLE = {
  raw: `\
Preliminary

- Root: prelimin meaning before the main action
- Thesaurus: initial, preparatory, introductory
- Part of Speech: Adjective
- Chinese Meaning: 初步的
- SSAT-Level Sentence (English): The preliminary results of the experiment showed promising potential.
- SSAT-Level Sentence (Chinese): 这次试验的初步结果显示出了很大的潜力。
- English Phonetics: /prɪˈlɪmənəri/
- Words Sharing the Same Root: Eliminate, Preliminary, Preliminarily
- New Trans: 新的翻译`
    .split('\n')
    .map((row, index) => <div key={index}>{row}</div>),
  data: {
    word: 'Preliminary',
    Root: 'prelimin meaning before the main action',
    Thesaurus: 'initial, preparatory, introductory',
    'Part of Speech': 'Adjective',
    'Chinese Meaning': '初步的',
    'SSAT-Level Sentence (English)':
      'The preliminary results of the experiment showed promising potential.',
    'SSAT-Level Sentence (Chinese)': '这次试验的初步结果显示出了很大的潜力。',
    'English Phonetics': '/prɪˈlɪmənəri/',
    'Words Sharing the Same Root': 'Eliminate, Preliminary, Preliminarily',
    'New Trans': '新的翻译',
  },
};

type TemplateEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
};

export const TemplateEditor: FC<TemplateEditorProps> = ({
  value: template = '',
  onChange = () => {},
}) => {
  const keys = (Form.useWatch('keys') as string[]) || [];

  const inputRef = useRef<TextAreaRef>(null);

  const addWordToTemplate = (word: string) => {
    const textarea = document.querySelector(
      '#templateInput textarea',
    ) as HTMLTextAreaElement | null;
    let offset = template.length;
    let isFocused = false;
    if (textarea && document.activeElement === textarea) {
      offset = textarea.selectionStart;
      isFocused = true;
    }
    onChange(`${template.substring(0, offset)}${word}${template.substring(offset)}`);
    if (isFocused) {
      setTimeout(() => {
        textarea?.setSelectionRange(offset + word.length, offset + word.length);
      });
    } else {
      inputRef.current?.focus();
    }
  };

  const transformedResult = useMemo(() => {
    const data = DATA_SAMPLE.data;
    const rows = (template || '')
      // 替换 {{}}
      .replaceAll(/{{\s*(.*?)\s*}}/g, (_, key) => {
        console.log({
          key,
          value: data[key],
        });
        if (!data[key]) {
          return '';
        }
        if (key === KEY_SENTENCE) {
          // word => ___
          const word = data[KEY_WORD];
          return (data[key] as string).replace(new RegExp(word, 'i'), () => '_____');
        } else {
          // 直接返回
          return data[key];
        }
      })
      // 替换空格
      .replaceAll(' ', () => '\u00A0')
      // 转换成输出
      .split('\n')
      .map((row, index) =>
        row ? <div key={`row_${index}`}>{row}</div> : <br key={`br_${index}`} />,
      );

    return rows;
  }, [template]);

  return (
    <div className={styles.container}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Alert type='info' message='点击按钮自动输入占位符' banner />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {keys.map((key, index) => {
            return (
              <div
                className={styles.word}
                key={`${key}_${index}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addWordToTemplate(`{{${key}}}`);
                }}
              >{`{{${key}}}`}</div>
            );
          })}
        </div>
        <div id='templateInput'>
          <Input.TextArea
            ref={inputRef}
            autoSize={{ minRows: 8 }}
            style={{ maxWidth: 550 }}
            value={template}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </div>

      {/* 结果预览 */}
      <div className={styles.preview} style={{ flex: 1 }}>
        <Alert message='结果预览' banner />
        <div>
          <div>样本数据:</div>
          <div className={styles.output}>{DATA_SAMPLE.raw}</div>

          <div>转换结果:</div>
          <div className={styles.output}>{transformedResult}</div>
        </div>
      </div>
    </div>
  );
};
