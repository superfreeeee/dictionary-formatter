import { FC, useRef } from 'react';
import { Button, Flex, Input, InputRef, Modal, Space, Tag, message } from 'antd';
import { useNewKey } from './useNewKey';
import { defaultKeys, fixedKeys } from '../../constants';

type KeysSettingProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
};

export const KeysSetting: FC<KeysSettingProps> = ({ value: keys = [], onChange = () => {} }) => {
  const inputRef = useRef<InputRef>(null);

  const onAdd = (newKey: string) => {
    if (keys.includes(newKey)) {
      message.open({
        type: 'warning',
        content: `字段 ${newKey} 已经存在`,
      });
      return false;
    }
    onChange?.([...keys, newKey]);
    return true;
  };

  const onRemove = (removedKey: string) => {
    onChange?.(keys.filter((key) => key !== removedKey));
  };

  const onReset = () => {
    Modal.confirm({
      type: 'confirm',
      title: '重置抽样字段',
      content: '字段抽样将恢复到初始组合',
      centered: true,
      okText: '确定',
      okButtonProps: { type: 'primary', danger: true },
      cancelText: '取消',
      onOk: () => {
        onChange(defaultKeys);
      },
    });
  };

  const {
    newKey, //
    onNewKeyChange,
    confirmNewKey,
  } = useNewKey(inputRef, onAdd);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Space.Compact>
          <Input
            ref={inputRef}
            value={newKey}
            onChange={onNewKeyChange}
            onPressEnter={confirmNewKey}
          />
          <Button disabled={!newKey} onClick={confirmNewKey}>
            添加字段
          </Button>
        </Space.Compact>
        <Button type='primary' danger onClick={onReset}>
          恢复初始字段组合
        </Button>
      </div>
      <Flex wrap='wrap' gap='small' style={{ marginTop: 12 }}>
        {[...fixedKeys, ...keys.filter((key) => !fixedKeys.includes(key))].map((key) => {
          return (
            <Tag
              key={key}
              color='processing'
              closeIcon={!fixedKeys.includes(key)}
              onClose={(e) => {
                e.preventDefault();
                onRemove(key);
              }}
            >
              {key}
            </Tag>
          );
        })}
      </Flex>
    </>
  );
};
