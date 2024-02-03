import { useMemo, useState } from 'react';
import { Alert, Button, Col, Flex, Form, Input, Modal, Row, Space, message } from 'antd';
import { cleanFormMemo, getFormMemo, setFormMemo } from '@renderer/utils/localStorage';
import { useSource } from './hooks/useSource';
import { KeysSetting } from './components/KeysSetting';
import styles from './MainExportEditor.module.css';
import { TemplateEditor } from './components/TemplateEditor';
import { defaultInitialValues } from './constants';
import ButtonGroup from 'antd/es/button/button-group';

const FORM_SPAN = 2;

export const MainExportEditor = () => {
  const [form] = Form.useForm();

  const initialValues = useMemo(() => {
    return {
      ...defaultInitialValues,
      ...getFormMemo(),
    };
  }, []);

  const onFormValuesChange = () => {
    const values = form.getFieldsValue();
    console.log('onValuesChange', values);
    setFormMemo(values);
  };

  /**
   * 清理缓存
   */
  const cleanCache = () => {
    Modal.confirm({
      type: 'confirm',
      title: '清除表单缓存',
      content: '确定清除表单缓存？',
      centered: true,
      okText: '确定',
      okButtonProps: { type: 'primary', danger: true },
      cancelText: '取消',
      onOk: () => {
        cleanFormMemo();
        location.reload();
      },
    });
  };

  const { sourceRules, handleSelectFolder } = useSource(form);

  const [transformedFiles, setTransformedFiles] = useState({
    source: '',
    files: [] as string[],
  });

  // const transformData = () => {
  //   const source = form.getFieldValue('source');
  //   console.log('transformData');
  //   window.api.batchTransformData(source).then((resp) => {
  //     console.log('batchTransformData resp', resp);

  //     if (resp.success) {
  //       setTransformedFiles({
  //         source,
  //         files: resp.res,
  //       });
  //     }
  //   });
  // };

  const clearTransformedData = () => {
    setTransformedFiles({ source: '', files: [] });
  };

  const startTransformTask = async () => {
    try {
      const { source, template } = await form.validateFields();
      console.log('startTransformTask', { source, template });

      const res = await window.api.batchFormatData({ source, template });

      if (res.code === 0) {
        setTransformedFiles({
          source,
          files: res.res.map((file) => file.result),
        });
      } else {
        message.error(res.message);
      }
    } catch (error: any) {
      console.log(error);
      message.error(error.errorFields[0].errors[0]);
    }
  };

  return (
    <div className={styles.container}>
      <Form
        name='exportSetting'
        labelCol={{ span: FORM_SPAN }}
        wrapperCol={{ span: 24 }}
        autoComplete='off'
        form={form}
        initialValues={initialValues}
        onValuesChange={onFormValuesChange}
      >
        <Form.Item label='数据源' required={true}>
          <Space.Compact block style={{ width: '100%' }}>
            <Form.Item
              name='source'
              style={{ marginBottom: 0 }}
              validateTrigger='onBlur'
              rules={sourceRules}
            >
              <Input type='text' className={styles.sourceInput} />
            </Form.Item>
            <Button onClick={handleSelectFolder}>选择文件夹</Button>
          </Space.Compact>
        </Form.Item>

        {/* 输出阶段 */}

        <Form.Item name='keys' label='字段抽样' required={true} wrapperCol={{ span: 12 }}>
          <KeysSetting />
        </Form.Item>

        <Form.Item name='template' label='输出模版设置' required={true} wrapperCol={{ span: 24 }}>
          <TemplateEditor />
        </Form.Item>

        {transformedFiles.source && (
          <Row>
            <Col offset={FORM_SPAN} span={24 - FORM_SPAN - FORM_SPAN / 2}>
              <Alert
                message='数据转换成功'
                description={
                  <div>
                    <div>数据源:</div>
                    <div>{transformedFiles.source}</div>
                    <div>输出文件列表:</div>
                    <div style={{ maxHeight: 200, overflow: 'auto' }}>
                      {transformedFiles.files.map((file, index) => {
                        return <div key={`${file}_${index}`}>{file}</div>;
                      })}
                    </div>
                  </div>
                }
                type='success'
                showIcon
                closable
                afterClose={clearTransformedData}
              />
            </Col>
          </Row>
        )}

        <Form.Item wrapperCol={{ offset: FORM_SPAN, span: 16 }}>
          <Flex gap='middle'>
            <Button danger onClick={cleanCache}>
              清除缓存并刷新
            </Button>
            <Button type='primary' onClick={startTransformTask}>
              转换并输出
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </div>
  );
};
