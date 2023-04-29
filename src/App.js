import React, { useState, useRef, useCallback } from "react";
import "./styles.css";

const useLimitedTextArea = (MAX_CHR_PER_LINE) => {
  const [_value, _setValue] = useState("");
  const textareaRef = useRef(null);

  const setValue = useCallback((value) => {
    if (textareaRef.current) {
      textareaRef.current.value = value;
    }
  });

  const handleChange = (event) => {
    const textarea = textareaRef.current;
    const oldValue = textarea.value;
    let newValue = event.target.value;
    // Split the input value into lines
    const lines = newValue.split("\n");
    // Limit the number of characters per line
    const limitedLines = lines.map((line) => {
      if (line.length <= MAX_CHR_PER_LINE) {
        return line;
      }
      let limitedLine = "";
      for (let i = 0; i < line.length; i += MAX_CHR_PER_LINE) {
        limitedLine += line.substring(i, i + MAX_CHR_PER_LINE) + "\n";
      }
      return limitedLine.trim(); // Remove trailing line break
    });
    // Join the lines back together with line breaks
    const limitedValue = limitedLines.join("\n");

    // Preserve the cursor position
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    setValue(limitedValue);

    console.log("selectionStart", selectionStart);
    console.log("selectionEnd", selectionEnd);

    const diff = limitedValue.length - oldValue.length;
    let startOfLine = selectionStart;
    while (startOfLine > 0 && limitedValue[startOfLine - 1] !== "\n") {
      startOfLine--;
    }
    const endOfLine = limitedValue.indexOf("\n", selectionStart);
    if (endOfLine === -1) {
      textarea.value = limitedValue;
      textarea.selectionStart = selectionStart + diff;
      textarea.selectionEnd = selectionEnd + diff;
    } else if (selectionStart - startOfLine > MAX_CHR_PER_LINE) {
      const cursorOffset = limitedValue.length - oldValue.length;
      textarea.value = limitedValue;
      textarea.selectionStart = selectionStart + diff - cursorOffset;
      textarea.selectionEnd = selectionEnd + diff - cursorOffset;
    } else {
      textarea.value = limitedValue;
    }
  };

  return [_value, handleChange, textareaRef];
};

// ## 字元超過35要換行

// \n為換行符號，要帶給後端，目前沒有達到理想的效果，實際需求如下

// 1.若使用者未達單行字數上限，即按enter換行，API要帶\n
// 2.若達到字數上限，畫面要自動斷行(理想狀況)，API要帶\n(必要)
// 3.假設至多兩行，單行35字，總字數限制70，使用者10字就換行，第二行要限只能輸入35字且不可再換行

// 01234567890123456789012345678901234

export default function App() {
  const MAX_CHR_PER_LINE = 10;
  const [value, handleChange, textareaRef] =
    useLimitedTextArea(MAX_CHR_PER_LINE);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Test Input not allow 10 characters</h2>
      {/* <textarea value={textInput} onChange={(e) => handleChange(e)}></textarea> */}
      <textarea ref={textareaRef} onChange={handleChange}></textarea>
    </div>
  );
}
