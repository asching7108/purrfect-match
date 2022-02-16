//reference: https://www.positronx.io/react-file-upload-tutorial-with-node-express-and-multer/
import React, { Component } from 'react';

export default class FilesUploadComponent extends Component {
  render() {
    return (
      <input className="form-control" type="file" name="uploaded_file" {...this.props} />
    )
  }
}
