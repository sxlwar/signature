import "./App.css";

import React, { useState } from "react";
import { FileFormComponent, FileChangeParam } from "./file";
import { SignFormComponent } from "./sign";
import { PreviewComponent } from "./file/preview";

const App: React.FC = () => {
  const [data, setData] = useState({ data: "", fileName: "" });

  return (
    <div className="App">
      <div className="forms">
        <FileFormComponent fileChange={(data: FileChangeParam) => setData(data)} />
        <Divider />
        <SignFormComponent fileName={data.fileName} />
        <Divider />
        <button
          onClick={() => {
            fetch("http://localhost:3000/file/signed")
              .then(res => res.formData())
              .then(data => console.log(data));
          }}
        >
          Show Signed File
        </button>
      </div>
      <PreviewComponent data={data.data} />
    </div>
  );
};

const Divider: React.FC = () => <hr style={{ width: "100%" }} />;

export default App;
