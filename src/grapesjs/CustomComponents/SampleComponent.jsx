import { useEffect, useState } from "react";

const SampleComponent = ({ content }) => {
  useEffect(() => {
    console.log("Content from props", content);
  }, [content]);

  const [text, setText] = useState("");
  // handle text change
  const handleTextChange = (e) => {
    console.log("text changed to", e.target.value);
    // set useState
    setText(e.target.value);
    // setTraits
  };
  return (
    <div>
      Hello this is sample component
      <div>
        <input
          type="text"
          onChange={handleTextChange}
          value={text}
          placeholder={content}
        ></input>
      </div>
    </div>
  );
};

export default SampleComponent;
