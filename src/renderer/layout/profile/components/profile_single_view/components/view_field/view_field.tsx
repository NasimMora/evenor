import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FieldText } from "..";

interface IViewFieldProps {
  schema: any;
  label: any;
  value: any;
}

export default function ViewField({ schema, label, value }: IViewFieldProps) {
  const { i18n } = useTranslation();

  const propType = useMemo(() => {
    const prop =
      Object.keys(schema).find((p) => schema[p].label === label) ?? label;

    const propType = schema[prop]?.type;

    return propType;
  }, [schema, label]);

  const propDescription = useMemo(() => {
    const prop = Object.keys(schema).find(
      (prop: any) => schema[prop]["label"] === label
    );

    const lang = i18n.resolvedLanguage;

    const description = schema?.[prop]?.description?.[lang] ?? label;

    return description;
  }, [schema, label]);

  return (
    <div>
      {propType === "array" ? (
        <div>
          {/* <div>array {propDescription} </div> */}
          {value.items.map((item: any, index: any) => (
            <div key={index}>
              <FieldText {...{ schema }} label={item.ITEM_NAME} value={item} />
            </div>
          ))}
        </div>
      ) : propType === "object" ? (
        <div>
          <div>object {propDescription}</div>
          {Object.keys(value).map((field: any, index: any) => (
            <div key={index}>
              <FieldText {...{ schema }} label={field} value={value[field]} />
            </div>
          ))}
        </div>
      ) : (
        <FieldText {...{ schema, label, value }} />
      )}
    </div>
  );
}