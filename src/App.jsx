import grapesjs from "grapesjs";
import GjsEditor, { Canvas, PagesProvider } from "@grapesjs/react";
import ReactCoreGrapesjs from "./grapesjs/CustomComponents/ReactCore/react-core.jsx";

export default function CustomEditor() {
  const onEditor = (editor) => {
    console.log("Editor loaded", { editor });
  };

  return (
    <GjsEditor
      grapesjs={grapesjs}
      grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css"
      onEditor={onEditor}
      plugins={[ReactCoreGrapesjs]}
      options={{
        height: "100vh",
        storageManager: true,
      }}
    >
      <div>
        <PagesProvider>
          <Canvas />
        </PagesProvider>
      </div>
    </GjsEditor>
  );
}
