import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./FileUpload.css";

export default function FileUpload(props) {
  const { handler } = props;

  const [image, setImage] = useState();
  const [saved, setSaved ] = useState("");
  const [showCropImage, setCropImage ] = useState("hide");
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const onChange = (e) => {
    e.preventDefault();
    let files;
    
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);

    setSaved("")
    setCropImage("")
  };

  const getCropData = () => {

    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL("image/jpeg"));
    }

    cropper.getCroppedCanvas().toBlob(function (blob) {
      var formData = new FormData();
      formData.append('croppedImage', blob);
      handler(blob)
    });

    setSaved("Saved!")
  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <input type="file" accept="image/png, image/jpg, image/jpeg" onChange={onChange} /> 
        <br />
        <Cropper
          style={{ maxHeight: 400, width: "100%" }}
          initialAspectRatio={1}
          src={image}
          viewMode={1}
          aspectRatio={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          autoCropArea={1}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
          guides={true}
        />
      </div>
      <div id="cropImage" className={showCropImage}>
      <input type="button" id='picture' onClick={getCropData} value="Crop Image"/><p className="message" style={{display: "inline"}}>{saved}</p>
      </div>
    </div>

  );
};

