import { useState } from 'react';
import { FormInstance, FormRule } from 'antd';

const sourceRules: FormRule[] = [
  // 空检查
  {
    validateTrigger: 'onSubmit',
    validator: async (_, value) => {
      if (!value) {
        throw new Error('数据源不能为空');
      }
    },
  },
  // 检查文件夹是否存在
  {
    validator: async (_, value) => {
      if (!value) return;
      try {
        const res = await window.api.assertFolder(value);
        if (res) {
          return Promise.reject(new Error(res));
        }
      } catch (error) {
        throw new Error('数据源校验失败，请重试');
      }
    },
  },
];

export const useSource = (form: FormInstance<any>) => {
  const handleSelectFolder = () => {
    window.api.selectFolder().then((res) => {
      if (res.canceled) return;

      const dir = res.filePaths[0];
      form.setFieldValue('source', dir);
      form.validateFields(['source']);
      console.log('handleSelectFolder', dir);
    });
  };

  return {
    sourceRules,
    handleSelectFolder,
  };
};
