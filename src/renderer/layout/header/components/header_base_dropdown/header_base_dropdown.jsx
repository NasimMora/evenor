import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/store/index.js';

export function HeaderBaseDropdown() {
  const { i18n, t } = useTranslation();

  const [
    schema,
    base,
    onChangeBase,
  ] = useStore((state) => [
    state.schema,
    state.base,
    state.onChangeBase,
  ]);

  const roots = Object.keys(schema)
    .filter((branch) => schema[branch].trunk === undefined
                   || schema[branch].type === 'object'
                   || schema[branch].type === 'array')
    .map((branch) => {
      const description = schema?.[branch]?.description?.[i18n.resolvedLanguage] ?? branch;

      return {
        branch,
        label: `${description} (${branch})`,
      };
    });

  return (
    <select
      name="HeaderBaseDropdown"
      value={base}
      title={t('header.dropdown.base', { field: base })}
      onChange={({ target: { value } }) => onChangeBase(value)}
    >
      {roots.map((root) => (
        <option key={`base_${Math.random()}`} value={root.branch}>
          {root.label}
        </option>
      ))}
    </select>
  );
}
