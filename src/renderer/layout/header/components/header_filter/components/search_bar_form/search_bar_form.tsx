import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { queryOptions , useStore } from "../../../../../../store";
import styles from "./search_bar_form.module.css";

interface ISearchBarFormProps {
  selected: any;
  searched: any;
  onChangeSearched: any;
}

export default function SearchBarForm({
  selected,
  searched,
  onChangeSearched,
}: ISearchBarFormProps) {
  const { repoRoute } = useParams();

  const isLoaded = useStore((state) => state.isLoaded)

  const [options, setOptions]: any[] = useState([]);

  async function onUseEffect() {
    if (isLoaded) {
      const options = await queryOptions(repoRoute, selected);

      setOptions(options);
    }
  }

  useEffect(() => {
    onUseEffect();
  }, [selected]);

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        type="text"
        list={`panel_list`}
        value={searched}
        onChange={({ target: { value } }) => {
          onChangeSearched(value);
        }}
      />

      <datalist id={`panel_list`}>
        {options.map((option: any, idx: any) => (
          <option key={idx} value={option}></option>
        ))}
      </datalist>
    </div>
  );
}
