import React from "react";
import cn from "classnames";
import styles from "./profile_single_edit.module.css";
import {
  AssetView,
  SingleEditToolbar,
  SingleEditTitle,
  SingleEditForm,
} from "..";

interface IProfileSingleEditProps {
  schema: any;
  group: any;
  entry: any;
  index: any;
  onSave: any;
  onRevert: any;
  onAddProp: any;
  onInputChange: any;
  onInputRemove: any;
  onInputUpload: any;
  onInputUploadElectron: any;
}

export default function ProfileSingleEdit({
  schema,
  group,
  entry,
  index,
  onSave,
  onRevert,
  onAddProp,
  onInputChange,
  onInputRemove,
  onInputUpload,
  onInputUploadElectron,
}: IProfileSingleEditProps) {
  return (
    <div className={cn(styles.sidebar, { [styles.invisible]: !entry })}>
      {entry && schema && (
        <div className={styles.container}>
          <div id="scrollcontainer" className={styles.sticky}>
            <SingleEditTitle {...{ group, index }} />

            <SingleEditToolbar
              {...{ schema, entry, onRevert, onSave, onAddProp }}
            />

            <SingleEditForm
              {...{
                schema,
                entry,
                onInputChange,
                onInputRemove,
                onInputUpload,
                onInputUploadElectron,
              }}
            />

            <AssetView filepath={entry?.FILE_PATH} />
          </div>
        </div>
      )}
    </div>
  );
}
