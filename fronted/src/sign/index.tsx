import React, { useState, useEffect } from "react";
import { SignResponse, SignRequest } from "../model/model";

export interface SignFormComponentProps {
  fileName: string;
}

type Key = keyof SignRequest;

export function SignFormComponent({ fileName }: SignFormComponentProps): JSX.Element {
  const [request, setRequest] = useState<Partial<SignRequest>>({ fileName });
  const sendRequest = () => {
    const passed = Object.values(request).every(item => !!item);
    const emailReg = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/;

    if (!passed) {
      window.alert("Value of these input must not be empty!");
    } else if (!emailReg.test(request.email as string)) {
      window.alert("Email address invalid!");
    } else {
      fetch("http://localhost:3000/file/sign", {
        body: JSON.stringify(request),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
        .then(res => res.json())
        .then((data: SignResponse) => window.alert(data.description));
    }
  };
  const updateRequest = <T extends Key>(key: T) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setRequest({ ...request, [key]: event.target.value });
  const controls: InputControlProps[] = [
    { type: "text", name: "title", text: "title", handle: updateRequest("title") },
    { type: "email", name: "email", text: "email", handle: updateRequest("email") },
    { type: "text", name: "subject", text: "subject", handle: updateRequest("subject") },
    { type: "text", name: "message", text: "message", handle: updateRequest("message") }
  ];

  useEffect(() => setRequest({ fileName }), [fileName]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }}
    >
      {controls.map((control, idx) => (
        <InputControl {...control} key={idx} />
      ))}
      <label>
        <span>file:</span>
        <input type="text" value={fileName} name="fileName" disabled={true} />
      </label>
      <button onClick={sendRequest}>Sign</button>
    </div>
  );
}

interface InputControlProps {
  text: string;
  type: string;
  name: string;
  handle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * @description form control item of sign.
 */
function InputControl({ text, type, name, handle }: InputControlProps): JSX.Element {
  return (
    <label>
      <span>{text}:</span>
      <input type={type} name={name} onChange={handle} />
    </label>
  );
}
