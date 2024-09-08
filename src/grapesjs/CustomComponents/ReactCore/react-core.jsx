import ReactDOM from "react-dom/client";
import React from "react";
import SampleComponent from "../SampleComponent.jsx";

const ReactCoreGrapesjs = (editor) => {
  const domc = editor.Components;
  const defType = domc.getType("default");
  const defModel = defType.model;
  const wrpChld = "data-chld";
  const renderWait = 100;

  const coreReactModel = {
    toHTML(opts = {}) {
      const attributes = this.getAttrToHTML();
      const classes = attributes.class;
      return defModel.prototype.toHTML.call(this, {
        ...opts,
        tag: this.get("type"),
        attributes: {
          ...attributes,
          className: classes,
        },
      });
    },
  };

  const coreReactView = {
    tagName: "div",

    init() {
      const { model } = this;
      this.listenTo(model, "change:attributes change:props", this.render);
      this.listenTo(model.components(), "add remove reset", this.__upRender);
    },

    getChildrenContainer() {
      const { childrenContainer } = this;
      if (childrenContainer) return childrenContainer;

      this.childrenContainer = document.createElement("childc");

      return this.childrenContainer;
    },

    createReactChildWrap() {
      return React.createElement("span", { [wrpChld]: true });
    },

    createReactEl(cmp, props) {
      return React.createElement(cmp, props, this.createReactChildWrap());
    },

    mountReact(cmp, el) {
      if (this.reactRoot?.render) return this.reactRoot.render(cmp);
      this.reactRoot = ReactDOM.createRoot(el);
      return this.reactRoot.render(cmp);
    },

    render() {
      const { model, el } = this;
      this.renderAttributes();
      this.renderChildren();
      const reactEl = this.createReactEl(model.get("component"), {
        ...model.get("attributes"),
        ...model.get("props"),
      });
      this.mountReact(reactEl, el);
      this.__renderChildComponents(el);

      return this;
    },

    __renderChildComponents(el) {
      clearTimeout(this._rcc);
      this.rcc = setTimeout(() => {
        const chld = el.querySelector(`span[${wrpChld}]`);

        if (chld) {
          chld.style.display = "inherit";
          const chldCont = this.getChildrenContainer();
          while (chldCont.firstChild) {
            chld.appendChild(chldCont.firstChild);
          }
        }
      }, renderWait);
    },

    __upRender() {
      clearTimeout(this._upr);
      this._upr = setTimeout(() => this.render());
    },
  };

  // Main React component
  domc.addType("react-component", {
    model: coreReactModel,
    view: coreReactView,
  });

  // sample component
  domc.addType("sample-component", {
    isComponent: (el) =>
      el.tagName === "DIV" && el.classList.contains("sample-component"),
    model: {
      ...coreReactModel,
      defaults: {
        component: (props) => {
          const content = props?.attributes?.content;
          console.log("content in model", content);
          return <SampleComponent content={content} />;
        },
        tagName: "div",
        draggable: true,
        droppable: true,
        editable: true,
        attributes: { class: "sample-component" },
        traits: [
          {
            label: "Content",
            type: "text",
            name: "content",
            changeProp: 1, // Ensure that changes to this trait are passed as props
          },
        ],
        content: "Hello",
        props() {
          // Define additional props dynamically
          return { content: this.get("content") };
        },
      },
      init() {
        this.on("change:content", this.handleContentChange);
      },
      handleContentChange() {
        const newContent = this.get("content");
        console.log("Content changed to:", newContent);
      },
    },
    view: coreReactView,
  });
  // adding sample component to blocks
  editor.Blocks.add("sample-component", {
    label: "Sample Component",
    content: { type: "sample-component" },
    category: "React components",
  });
};

export default ReactCoreGrapesjs;
