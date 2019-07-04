import React from 'react';

export interface FileChangeParam {
  data: string;
  fileName: string;
}

export interface FileFormComponentProps {
  fileChange(data: FileChangeParam): void;
}

export function FileFormComponent({ fileChange }: FileFormComponentProps): JSX.Element {
  let inputRef = React.createRef<HTMLInputElement>();

  const getFile = () => {
    const fileName = inputRef.current!.value;

    !!fileName &&
      fetch("http://localhost:3000/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fileName })
      })
        .then(res => res.text())
        .then(base64String => fileChange({ data: base64String, fileName }));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start"
      }}
    >
      <label>
        <span>search:</span>
        <input type="text" ref={inputRef} placeholder="File name. Input 'test' then click preview button" />
      </label>
      <button onClick={getFile} style={{ flex: 1 }}>
        preview
      </button>
    </div>
  );
}
