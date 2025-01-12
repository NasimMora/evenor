import React from 'react';
import { useTranslation } from 'react-i18next';
import { API } from 'lib/api';
import { useStore } from '@/store/index.js';
import { Button, AssetView } from '@/components/index.js';
import styles from './input_upload.module.css';
import { InputText } from '..';

export function InputUpload({
  schema,
  entry,
  onFieldChange,
}) {
  const { t } = useTranslation();

  const branch = entry._;

  const filehashBranch = Object.keys(schema).find(
    (b) => schema[b].trunk === branch && schema[b].task === 'filehash',
  );

  const filenameBranch = Object.keys(schema).find(
    (b) => schema[b].trunk === branch && schema[b].task === 'filename',
  );

  const repoUUID = useStore((state) => state.repoUUID);

  async function onRename(_, filenameValue) {
    const entryNew = { ...entry };

    entryNew[filenameBranch] = filenameValue;

    onFieldChange(branch, entryNew);
  }

  async function onUpload(file) {
    const api = new API(repoUUID);

    const [filehash, filename] = await api.uploadFile(file);

    const entryNew = { ...entry };

    entryNew[filehashBranch] = filehash;

    entryNew[filenameBranch] = filename;

    onFieldChange(branch, entryNew);
  }

  return (
    <div>
      <div>{ entry.UUID }</div>

      <InputText
        {...{
          branch: filenameBranch,
          value: entry[filenameBranch] ?? '',
          onFieldChange: onRename,
        }}
      />

      {entry[filehashBranch] ?? ''}

      {__BUILD_MODE__ === 'electron' ? (
        <Button type="button" onClick={() => onUpload()}>
          {t('line.button.upload')}
        </Button>
      ) : (
        <input
          type="file"
          onChange={(e) => onUpload(e.target.files[0])}
        />
      )}

      {entry[filenameBranch] && entry[filehashBranch] && (
        <AssetView {...{ entry, schema }} />
      )}
    </div>
  );
}
