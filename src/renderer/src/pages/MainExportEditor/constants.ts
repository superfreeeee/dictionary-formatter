export const KEY_WORD = 'word';
export const KEY_SENTENCE = 'SSAT-Level Sentence (English)';

export const defaultKeys = [
  KEY_WORD,
  KEY_SENTENCE,
  'Root',
  'Thesaurus',
  'Part of Speech',
  'Chinese Meaning',
  'SSAT-Level Sentence (Chinese)',
  'English Phonetics',
  'Words Sharing the Same Root',
];

export const fixedKeys = [KEY_WORD, KEY_SENTENCE];

export const defaultInitialValues = {
  source: '',
  keys: defaultKeys,
  template: `\
{{word}}
{{SSAT-Level Sentence (English)}}
{{SSAT-Level Sentence (Chinese)}}
`,
};
