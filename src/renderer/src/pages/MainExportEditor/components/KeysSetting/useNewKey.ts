import { useState } from 'react';
import { InputRef } from 'antd';

export const useNewKey = (
  inputRef: React.RefObject<InputRef>,
  onAdd: (newKey: string) => boolean,
) => {
  const [newKey, setNewKey] = useState('');

  const onNewKeyChange = (e) => setNewKey(e.target.value);

  const confirmNewKey = () => {
    if (newKey && onAdd(newKey)) {
      setNewKey('');
      inputRef.current?.focus();
    }
  };

  return {
    newKey,
    onNewKeyChange,
    confirmNewKey,
  };
};
