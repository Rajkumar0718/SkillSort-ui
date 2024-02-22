import React from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const CkEditor = ({data , onChange, keyName}) => {

  return (
    <CKEditor
    editor={ClassicEditor}
    data={data||""}
    onChange={(event, editor) => {
      const updatedData = editor?.getData();
      onChange(updatedData,keyName);
    }}
    onReady={(editor) => {
      editor.on('ready',()=>{
        ClassicEditor.create(
          editor.editing.view.document.getRoot(),
          {
            removePlugins: ["Heading", "Link", "CKFinder"],
            toolbar: [
              "style",
              "bold",
              "italic",
              "bulletedList",
              "numberedList",
              "blockQuote",
            ],

          }
        )
          .then(() => {

          })
          .catch((error) => {
            console.error(error);
          });
      })
    }}
  />
  )
}

export default CkEditor
