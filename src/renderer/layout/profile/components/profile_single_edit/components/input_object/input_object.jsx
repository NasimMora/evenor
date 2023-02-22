import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { digestMessage, randomUUIDPolyfill } from "@fetsorn/csvs-js";
import { API, deepClone } from "lib/api";
import { useStore } from "@/store";
import { EditInput, InputDropdown } from "..";

async function addField(
  schema,
  entryOriginal,
  branch
) {
  // used to use deepClone
  const entry = deepClone(entryOriginal);

  let value;

  if (schema[branch].type === "object" || schema[branch].type === "array") {
    const obj = {};

    obj["|"] = branch;

    const uuid = crypto.randomUUID ? crypto.randomUUID() : randomUUIDPolyfill();

    obj.UUID = await digestMessage(uuid);

    if (schema[branch].type === "array") {
      obj.items = [];
    }

    value = obj;
  } else {
    value = "";
  }
  const base = entry["|"];

  const { trunk } = schema[branch];

  if (trunk !== base && branch !== base) {
    return;
  }

  if (schema[base].type === "array") {
    if (entry.items === undefined) {
      entry.items = [];
    }

    entry.items.push({ ...value });
  } else {
    entry[branch] = value;
  }
  return entry;
}

export default function InputObject({
  schema,
  entry,
  onFieldChange,
}) {
  const { t } = useTranslation();

  const [options, setOptions] = useState([]);

  const repoRoute = useStore((state) => state.repoRoute);

  const api = new API(repoRoute);

  const base = useStore((state) => state.base);

  const branch = entry['|']

  const addedLeaves = Object.keys(entry).filter((b) =>  b !== "|" && b !== "UUID")

  const notAddedLeaves = entry
    ? Object.keys(schema).filter((leaf) => {
      const isAdded = Object.prototype.hasOwnProperty.call(entry, leaf);

      const isNonObjectRoot = leaf === branch && schema[branch].trunk === undefined && schema[branch].type !== 'object';

      const isLeaf = schema[leaf]?.trunk === branch;

      return !isAdded && (isLeaf || isNonObjectRoot);
    })
    : [];

  async function onAddObjectField(fieldBranch) {
    const objectNew = await addField(schema, entry, fieldBranch);

    onFieldChange(branch, objectNew);
  }

  function generateLeaf(leaf, index) {
    function onFieldChangeObjectField(
      fieldBranch,
      fieldValue
    ) {
      const objectNew = { ...entry };

      objectNew[fieldBranch] = fieldValue;

      onFieldChange(branch, objectNew);
    }

    function onFieldRemoveObjectField(fieldBranch) {
      const objectNew = { ...entry };

      delete objectNew[fieldBranch];

      onFieldChange(branch, objectNew);
    }

    const leafEntry = schema[leaf]?.type === 'object' || schema[leaf]?.type === 'array'
      ? entry[leaf]
      : { '|': leaf, [leaf]: entry[leaf] };

    return (
      <div key={index}>
        <EditInput
          {...{
            index: entry.UUID + leaf,
            schema,
            entry: leafEntry,
            onFieldChange: onFieldChangeObjectField,
            onFieldRemove: onFieldRemoveObjectField,
          }}
        />
      </div>
    );
  }

  async function onUseEffect() {
    if (branch !== base) {
      const options = await api.queryOptions(branch);

      setOptions(options);
    }
  }

  useEffect(() => {
    onUseEffect();
  }, []);

  return (
    <div>
      <div>{ entry.UUID }</div>

      { options.length > 0 && (
        <select
          value="default"
          onChange={({ target: { value } }) => {
            onFieldChange(branch, JSON.parse(value))
          }}
        >
          <option hidden disabled value="default">
            {t("line.dropdown.input")}
          </option>

          {options.map((field, idx) => (
            <option key={idx} value={JSON.stringify(field)}>
              {JSON.stringify(field)}
            </option>
          ))}
        </select>
      )}

      { notAddedLeaves.length > 0 && (
        <InputDropdown {...{ schema, fields: notAddedLeaves, onFieldAdd: onAddObjectField }} />
      ) }

      { addedLeaves.map(generateLeaf) }
    </div>
  );
}