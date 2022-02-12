//reference: https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/
import React, { Component } from 'react';
import { FormGroup, PrimaryButton } from '../Utils/Utils';
export default class FilesUploadComponent extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <FormGroup>
            <label htmlFor='petImage'>Pet Image</label>
            <div className="form-group">
              <input type="file" name="uploaded_file" />
            </div>
          </FormGroup>
        </div>
      </div>
    )
  }
}