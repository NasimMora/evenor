import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API } from 'lib/api';
import { Button } from '@/components/index.js';
import { useStore } from '@/store/index.js';
import styles from './filter_query_plus.module.css';
import {
  Dropdown,
} from '@/components/index.js';

export function FilterQueryPlus({
  queryBranch,
  onQuerySelect,
  queryValue,
  onQueryInput,
}) {
  const { i18n, t } = useTranslation();

  const [options, setOptions] = useState([]);
  const [
		queries,
    schema,
    base,
    onQueryAdd,
    repoUUID,
  ] = useStore((state) => [
		state.queries,
    state.schema,
    state.base,
    state.onQueryAdd,
    state.repoUUID,
  ]);
	// мне нужно взять ключи schema чтобы пройтись по объекту
// schema {category, local_path, reponame}
// loop Objkeys(schema) { }
// [{ label: {category}, label: "local_path", label: "reponame"}]
// [ { onClick, label: "category" }, {onClick, label: "local_path"}, {onClick, label:"reponame"}]
				// [{
				// 	onClick:()=>{
				// 		onQueryAdd("name","value")
				// 	},
					// добавлять запрос, при добавлении запрос должен перейти в filter_query_list, при этом удалив из menuItems
				// 	label:"name"
				// },
				// {
				// 	onClick:{},
				// 	label:"date"
				// },{
				// 	onClick:{},
				// 	label:"birth"
				// }],
// schema {category, local_path, reponame}
// Obj.keys(schema) ["category", "local_path", "reponame"]
// a = Object.keys(schema).map(key=>({label: key})) '[{"label": "category"},{"label": "local_path"},{"label": "reponame"}]'
// [ { onClick, label: "category" }, {onClick, label: "local_path"}, {onClick, label:"reponame"}]
// onClick - добавляет запрос, при добавлении запрос должен перейти в filter_query_list, при этом удалив из menuItems





//   const api = new API(repoUUID);

//   function isConnected(leaf) {
//     const { trunk } = schema[leaf];

//     return trunk !== undefined && (trunk === base || isConnected(trunk));
//   }

//   const queriesToAdd = Object.keys(schema).filter(
//     (branch) => branch === base || isConnected(branch),
//   ).map(
//     (branch) => {
//       const description = schema?.[branch]?.description?.[i18n.resolvedLanguage] ?? branch;

//       return {
//         branch,
//         label: `${description} (${branch})`,
//       };
//     },
//   ).concat([
//     { branch: '_', label: t('header.dropdown.base') },
//     { branch: '.group', label: t('header.dropdown.groupby') },
//   ]);

//   async function onFocus() {
//     if (queryBranch === '_') {
//       const roots = Object.keys(schema)
//         .filter((branch) => schema[branch].trunk === undefined
//                 || schema[branch].type === 'object'
//                 || schema[branch].type === 'array')
//         .map((branch) => {
//           const description = schema?.[branch]?.description?.[i18n.resolvedLanguage] ?? branch;

//           return {
//             branch,
//             label: `${description} (${branch})`,
//           };
//         });

//       setOptions(roots.map((root) => root.branch));
//     } else if (queryBranch === '.group') {
//       const leaves = Object.keys(schema)
//         .filter((branch) => (schema[branch].trunk === base
//                              || branch === base
//                              || schema[schema[branch]?.trunk]?.trunk === base)
//                 && (branch !== 'schema' && branch !== 'schema_branch'))
//         .map((branch) => {
//           const description = schema?.[branch]?.description?.[i18n.resolvedLanguage] ?? branch;

//           return {
//             branch,
//             label: `${description} (${branch})`,
//           };
//         });

//       setOptions(leaves.map((leaf) => leaf.branch));
//     } else {
//       const optionsNew = await api.queryOptions(queryBranch);

//       const optionValues = optionsNew.map((entry) => entry[queryBranch]);

//       setOptions([...new Set(optionValues)]);
//     }
//   }

//   useEffect(() => {
//     onQuerySelect(queriesToAdd?.[0]?.branch);
//   }, [schema, queries]);

// menuItems должна меняться каждый раз когда создается новый 
//  вместо того что бы map, сначала отфильтровать поля, которые уже добавлены

const addedField = Object.keys(queries)

const menuItems = Object.keys(schema)
  .filter(key => !addedField.includes(key)) 
  .map(key => ({
    onClick: () => {
      onQueryAdd(key, "");
    },
    label: key
  }));

// для каждого ключа schema должен сделать элемент с полями onClick и label
  return (
    <div className={styles.search}>
			<Dropdown {...{
        label:"+",
  			title:"title",
				menuItems,
			  // menuItems:[{
				// 	onClick:()=>{
				// 		onQueryAdd("name","value")
				// 	},
					// добавлять запрос, при добавлении запрос должен перейти в filter_query_list, при этом удалив из menuItems
				// 	label:"name"
				// },
				// {
				// 	onClick:{},
				// 	label:"date"
				// },{
				// 	onClick:{},
				// 	label:"birth"
				// }],
      }}/>
    </div>
  );
}
