import { Popper, TextareaAutosize } from "@mui/material";
import React from "react";

export default function EditTextarea(props) {
  const { id, field, value, colDef, hasFocus, api } = props;
  console.log(colDef)
  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState();
  const [inputRef, setInputRef] = React.useState(null);
  const [height, setHeight] = React.useState('auto');

  React.useLayoutEffect(() => {
    if (inputRef) {
      const newHeight = inputRef.scrollHeight;
      if (newHeight !== height) {
        setHeight(newHeight);
      }
    }
  }, [api, field, height, id, inputRef, valueState]);

  React.useLayoutEffect(() => {
    if (hasFocus && inputRef) {
      inputRef.focus();
    }
  }, [hasFocus, inputRef]);

  const handleRef = React.useCallback((el) => {
    setAnchorEl(el);
  }, []);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      api.setEditCellValue(
        { id, field, value: newValue, debounceMs: 200 },
        event,
      );
    },
    [api, field, id],
  );

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: '100%',
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom-start">
          <TextareaAutosize
            maxRows={4}
            minRows={2}
            value={valueState}
            style={{ border: 'none', width: Math.round(colDef.computedWidth), height: height }}
            onChange={handleChange}
            inputRef={(ref) => setInputRef(ref)}
          />
        </Popper>
      )}
    </div>
  );
}
