import React, { useEffect, useRef } from "react";
import classes from "./styles.module.scss"
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
interface Props {
  onChange: (data: string) => void;
  value: string;
}

function Editor({ onChange, value }: Props) {
  return (
    <div className={classes.root}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          ckfinder: {
            // Upload the images to the server using the CKFinder QuickUpload command
            // You have to change this address to your server that has the ckfinder php connector
            uploadUrl: "", //Enter your upload url
          },
        }}
        data={value}
        onChange={(event, editor) => {
          const data = editor.getData();
          // console.log({ event, editor, data })
          onChange(data);
        }}
      />
    </div>
  );
}

export default Editor;
