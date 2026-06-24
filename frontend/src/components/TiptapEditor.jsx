import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";

function TiptapEditor({ content, setContent, setStatus }) {
  const [align, setAlign] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content || "<p></p>",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
      setStatus("Unsaved changes");
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "<p></p>");
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div>
      <div style={toolbarStyle}>
        <select
          style={selectStyle}
          defaultValue="Arial"
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Tahoma">Tahoma</option>
        </select>

        <select
          style={selectStyle}
          defaultValue="paragraph"
          onChange={(e) => {
            if (e.target.value === "paragraph") editor.chain().focus().setParagraph().run();
            if (e.target.value === "h1") editor.chain().focus().toggleHeading({ level: 1 }).run();
            if (e.target.value === "h2") editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
        </select>

        <button style={editor.isActive("bold") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button style={editor.isActive("italic") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button style={editor.isActive("underline") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>

        <input type="color" style={colorInputStyle} onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />

        <button style={editor.isActive("highlight") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>

        <button style={align === "left" ? activeBtn : toolBtn} onClick={() => { setAlign("left"); editor.chain().focus().setTextAlign("left").run(); }}>L</button>
        <button style={align === "center" ? activeBtn : toolBtn} onClick={() => { setAlign("center"); editor.chain().focus().setTextAlign("center").run(); }}>C</button>
        <button style={align === "right" ? activeBtn : toolBtn} onClick={() => { setAlign("right"); editor.chain().focus().setTextAlign("right").run(); }}>R</button>

        <button style={editor.isActive("bulletList") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleBulletList().run()}>•</button>
        <button style={editor.isActive("orderedList") ? activeBtn : toolBtn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>

        <button style={toolBtn} onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button style={toolBtn} onClick={() => editor.chain().focus().redo().run()}>Redo</button>
      </div>

      <div style={paperStyle}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const toolbarStyle = {
  width: "920px",
  margin: "0 auto 20px auto",
  background: "white",
  padding: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  alignItems: "center",
};

const toolBtn = {
  padding: "8px 13px",
  border: "1px solid #9ca3af",
  background: "#f8fafc",
  borderRadius: "7px",
  cursor: "pointer",
  color: "#202124",
  fontWeight: "600",
};

const activeBtn = {
  ...toolBtn,
  background: "#1a73e8",
  color: "white",
  border: "1px solid #1a73e8",
};

const selectStyle = {
  padding: "7px 10px",
  border: "1px solid #dadce0",
  borderRadius: "6px",
  background: "white",
  color: "#202124",
};

const colorInputStyle = {
  width: "38px",
  height: "34px",
  cursor: "pointer",
};

const paperStyle = {
  width: "820px",
  minHeight: "900px",
  margin: "0 auto",
  background: "white",
  padding: "70px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
  borderRadius: "4px",
  color: "#202124",
  fontSize: "18px",
  lineHeight: "1.7",
};

export default TiptapEditor;