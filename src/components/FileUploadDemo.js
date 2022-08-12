import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../index.css";
import useInput from "../hooks/use-input";

import React, { useContext, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext"
import AuthContext from "../store/auth-context";

const FileUploadDemo = () => {
  const authCtx = useContext(AuthContext);
  const [totalSize, setTotalSize] = useState(0);
  const toast = useRef(null);
  const fileUploadRef = useRef(null);
  const {
    value: nameValue,
    isValid: nameIsValid,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName
  } = useInput((value) => value.trim() !== '')

  const beforeSendHandler = (event) => {
    event.xhr.setRequestHeader('Authorization', `Bearer ${authCtx.token}`);
    if (nameValue.trim() === '') {
      return;
    }
    event.xhr.setRequestHeader('Album-Name', nameValue);
    return event;
  };

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    e.files.forEach((file) => {
      _totalSize += file.size;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateError = (obj) => {
    // setTotalSize(0);
    console.log(obj);
    toast.current.show({
      severity: "error",
      summary: "Eroare",
      detail: JSON.parse(obj.xhr.response).message
    })
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    resetName();
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formatedValue} / 1 MB`}
          style={{ width: "300px", height: "20px", marginLeft: "auto" }}
        ></ProgressBar>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    label: 'Alege Pozele',
    iconOnly: false,
    className: "custom-choose-btn"
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    label: "Încarcă",
    iconOnly: false,
    className:
      "custom-upload-btn p-button-success",
    disabled: true
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    label: "Anulează",
    iconOnly: false,
    className:
      "custom-cancel-btn p-button-danger",
  };

  const nameClasses = nameHasError ? 'p-invalid w-full mb-3' : 'w-full mb-3';

  return (
    <div>
      <Toast ref={toast}></Toast>
      <InputText 
        id="name"
        aria-describedby="name-help"
        className={nameClasses}
        value={nameValue}
        onChange={nameChangeHandler}
        onBlur={nameBlurHandler}
        placeholder="Numele noului album"
      />
      {nameHasError && <small id="name-help" className="p-error block">Numele noului album este obligatoriu</small>}
      <Tooltip target=".custom-choose-btn" content="Alege" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Încarcă" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Anulează" position="bottom" />

      <div className="card">
        <FileUpload
          ref={fileUploadRef}
          name="image"
          url="/upload"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          onUpload={onTemplateUpload}
          onSelect={onTemplateSelect}
          onError={onTemplateError}
          onClear={onTemplateClear}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
          withCredentials={true}
          onBeforeSend={beforeSendHandler}
        />
      </div>
    </div>
  );
};

export default FileUploadDemo;
