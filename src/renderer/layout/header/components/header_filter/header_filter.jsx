import React, { useState } from 'react';
import { FilterSearchBar, FilterQueryList, FilterQueryListNew, FilterQueryPlus } from './components/index.js';
import styles from './header_filter.module.css';

export function HeaderFilter() {
  const [queryBranch, setQueryBranch] = useState('');

  const [queryValue, setQueryValue] = useState('');

  function onQueryInput(value) {
    setQueryValue(value);
  }

  function onQuerySelect(value) {
    setQueryBranch(value);
  }

  return (
    <div className={styles.panel}>
      <FilterQueryListNew {...{
        queryValue,
        onQueryInput,
      }}
      />
			<FilterQueryPlus/>
    </div>
  );
}
