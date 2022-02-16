import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "./Cropper.css";

export default function Demo(props) {
  const [image, setImage] = useState();
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
  };

  const getCropData = () => {
    console.log("getCropData")
    console.log(cropper)
    //console.log(cropData)
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL("image/jpeg"));
    }

    cropper.getCroppedCanvas().toBlob(function (blob) {
      var formData = new FormData();
      formData.append('croppedImage', blob);

      // Use `jQuery.ajax` method
      // $.ajax('/path/to/upload', {
      //   method: "POST",
      //   data: formData,
      //   processData: false,
      //   contentType: false,
      //   success: function () {
      //     console.log('Upload success');
      //   },
      //   error: function () {
      //     console.log('Upload error');
      //   }
      // });
    });

  };

  return (
    <div>
      <div style={{ width: "100%" }}>
        <input type="file" onChange={onChange} />
        <br />
        <Cropper
          style={{ height: 400, width: "100%" }}
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
      <div >
      <input type="button" id='picture' onClick={getCropData} value="Crop Image"/><p className="message" style={{display: "inline"}}>Saved!</p>
        <br />
      </div>
    </div>

  );
};

