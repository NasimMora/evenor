import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './filter_query_list.module.css';
import { useStore } from '@/store/index.js';

export function FilterQueryListNew({ onQueryInput, queryValue }) {
  const { t } = useTranslation();

  const [
    queries,
    onQueryRemove,
    onQueryAdd,
  ] = useStore((state) => [
    state.queries,
    state.onQueryRemove,
    state.onQueryAdd,
  ]);


  return (
    <div className={styles.queries}>
      {Object.keys(queries).map((field) => (
        <div key={`querylist-${field ?? Math.random()}`} className={styles.query}>
      <label
        htmlFor="asdaf"
        /* title={} */
        // className={styles.}
      >
        {field}
          <button
            type="button"
            title={t('header.button.remove', { field })}
            onClick={() => onQueryRemove(field)}
            style={{ marginLeft: '5px', color: 'red', cursor: 'pointer' }}
          >
            X
          </button>
        <br />
        <input
          className={styles.input}
          type="text"
          list="ldkjaf"
          value={queries[field]}
          /* onFocus={onFocus} */
          onChange={({ target: { value } }) => {
            // TODO: change `entries` field value to `value`
            console.log("filterSearchListNew/onChange", value)
            onQueryAdd(field, value);
          }}
          /* onKeyPress={(({ which }) => { */
          /*   if (which === 13) { */
          /*     onQueryAdd(queryBranch, queryValue); */
          /*   } */
          /* })} */
        />
      </label>
          {/* <button onClick={() => onQuerySelect(field)}> */}
          {/*   {field} */}
          {/*   {' '} */}
          {/*   {queries[field]} */}
          {/* </button> */}

        </div>
      ))}
    </div>
  );
}
