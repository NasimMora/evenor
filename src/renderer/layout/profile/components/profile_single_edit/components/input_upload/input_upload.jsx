import React from 'react';
import { useTranslation } from 'react-i18next';
import { API } from 'lib/api';
import { useStore } from '@/store/index.js';
import { Button } from '@/components/index.js';
import styles from './input_upload.module.css';

export function InputUpload({
  branch,
  value,
  onFieldChange,
}) {
  const { t } = useTranslation();

  const repoUUID = useStore((state) => state.repoUUID);

  async function onFieldUpload(file) {
    const api = new API(repoUUID);

    const filepath = await api.uploadFile(file);

    onFieldChange(branch, filepath);
  }

  // eslint-disable-next-line
  switch (__BUILD_MODE__) {
    case 'electron':
      return (
        <div>
          <input
            className={styles.input}
            type="text"
            value={value}
            onChange={(e) => onFieldChange(branch, e.target.value)}
          />
          <Button type="button" onClick={() => onFieldUpload()}>
            {t('line.button.upload')}
          </Button>
        </div>
      );
    default:
      return (
        <input
          type="file"
          onChange={(e) => onFieldUpload(e.target.files[0])}
        />
      );
  }
}
