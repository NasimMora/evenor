import styles from "./form_text_input.module.css";
import { useTranslation } from "react-i18next";

interface ITextInputProps {
  label?: any;
  description?: any;
  value?: any;
  list?: any;
  onChange?: any;
  onRemove?: any;
}

export default function TextInput({
  label,
  description,
  value,
  list,
  onChange,
  onRemove,
}: ITextInputProps) {
  const { t } = useTranslation();
  return (
    <div>
      <label>
        {description}
        <button
          title={t("line.button.remove", { field: label })}
          onClick={onRemove}
        >
          X
        </button>
        <br />
        <input
          className={styles.input}
          type="text"
          list={list}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
