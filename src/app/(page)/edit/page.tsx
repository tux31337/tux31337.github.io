"use client";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export default function EditPage() {
  const [value, setValue] = useState("**Hello world!!!**");

  // 타입에 맞는 핸들러를 작성합니다.
  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      setValue(value); // 값이 undefined가 아닐 때만 상태를 업데이트합니다.
    }
  };

  return (
    <div className="container">
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        components={{
          toolbar: (command, disabled, executeCommand) => {
            if (command.keyCommand === "code") {
              return (
                <button
                  aria-label="Insert code"
                  disabled={disabled}
                  onClick={(evn) => {
                    evn.stopPropagation();
                    executeCommand(command, command.groupName);
                  }}
                >
                  Code
                </button>
              );
            }
          },
        }}
      />
    </div>
  );
}
