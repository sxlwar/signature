import React from "react";

export interface PreviewComponentProps {
  data: string;
}

export function PreviewComponent({ data }: PreviewComponentProps): JSX.Element {
  return (
    <object data={data} type="application/pdf" style={{ height: "100vh", width: "60%" }}>
      <embed src={data} type="application/pdf" />
    </object>
  );
}
