enum LocalStorageKeys {
  MainExportEditorForm = '__youxian_MainExportEditorForm',
}

export const getFormMemo = () => {
  const raw = localStorage.getItem(LocalStorageKeys.MainExportEditorForm);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as object;
};

export const setFormMemo = (values: any) => {
  localStorage.setItem(
    LocalStorageKeys.MainExportEditorForm,
    JSON.stringify(values),
  );
};

export const cleanFormMemo = () => {
  localStorage.removeItem(LocalStorageKeys.MainExportEditorForm);
};
