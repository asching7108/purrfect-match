//reference: https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/
import React, { Component } from 'react';
import { FormGroup } from '../Utils/Utils';

export default class FilesUploadComponent extends Component {
  render() {
    return (
      <FormGroup>
        <input type="file" name="uploaded_file" {...this.props} />
      </FormGroup>
    )
  }
}
