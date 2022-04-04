import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { buildFilePropsFromResponse, getIconFromFileType, validateMaxSize } from './AttachmentUtils';

import './Attachment.css';

declare const PCore: any;

export default function Attachment(props) {
  // const {getPConnect} = props;
  console.log(props);
  const {
    value,
    validatemessage,
    getPConnect,
    label,
    helperText,
    testId,
    displayMode,
    variant,
    hideLabel
  } = props;
  /* this is a temporary fix because required is supposed to be passed as a boolean and NOT as a string */
  let { required, disabled } = props;
  [required, disabled] = [required, disabled].map(
    prop => prop === true || (typeof prop === 'string' && prop === 'true')
  );

  const pConn = getPConnect();

  let fileTemp = {};
  if (value && value.pxResults && +value.pyCount > 0) {
    fileTemp = buildFilePropsFromResponse(value.pxResults[0]);
  }

  let categoryName = '';
  if (value && value.pyCategoryName) {
    categoryName = value.pyCategoryName;
  }

  let valueRef = pConn.getStateProps().value;
  valueRef = valueRef.indexOf('.') === 0 ? valueRef.substring(1) : valueRef;

  const [file, setFile] = useState(fileTemp);
  console.log(file)

  const onFileAdded = (event) => {
    const addedFile = event.target.files[0];
    /* temporarily hardcoded to max 5 MB */
    const maxAttachmentSize = PCore.getEnvironmentInfo().getMaxAttachmentSize() || 5;

    if (!validateMaxSize(addedFile, maxAttachmentSize)) {
      setFile({
        props: {
          name: pConn.getLocalizedValue('Unable to upload file'),
          meta: pConn.getLocalizedValue(`File is too big. Max allowed size is ${maxAttachmentSize}MB.`),
          icon: getIconFromFileType(addedFile.type),
          error: true
        }
      });
      return;
    }

  }

  return (
    <div className='file-upload-container'>
      <span className='label'>{label}</span>
      <label htmlFor='upload-photo'>
        <input
          style={{ display: 'none' }}
          id='upload-photo'
          name='upload-photo'
          type='file'
          required={required}
          onChange={onFileAdded}
        />
        <Button variant='outlined' color='primary' component="span">
          Upload file
        </Button>
      </label>
    </div>
  );
}
