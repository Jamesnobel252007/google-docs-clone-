import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";

function TiptapEditor({ content, setContent, setStatus, socketRef }) {
  const [align, setAlign] = useState("");
  const remoteUpdateRef = useRef(false);

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
      if (remoteUpdateRef.current) {
        remoteUpdateRef.current = false;
        return;
      }

      const html = editor.getHTML();

      setContent(html);
      setStatus("Unsaved changes");

      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "content",
            message: html,
          })
        );
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      remoteUpdateRef.current = true;
      editor.commands.setContent(content || "<p></p>", false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.toolbar}>
        <select
          style={styles.select}
          defaultValue="Arial"
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
        >
          <option value="Arial">Arial</option>
          <option value="Inter">Inter</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select
          style={styles.select}
          defaultValue="paragraph"
          onChange={(e) => {
            if (e.target.value === "paragraph") {
              editor.chain().focus().setParagraph().run();
            }
            if (e.target.value === "h1") {
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            }
            if (e.target.value === "h2") {
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }
          }}
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Title</option>
          <option value="h2">Subtitle</option>
        </select>

        <div style={styles.divider}></div>

        <button
          style={editor.isActive("bold") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          style={editor.isActive("italic") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
          style={editor.isActive("underline") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        <input
          type="color"
          style={styles.color}
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />

        <button
          style={editor.isActive("highlight") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          Mark
        </button>

        <div style={styles.divider}></div>

        <button
          style={align === "left" ? styles.activeBtn : styles.toolBtn}
          onClick={() => {
            setAlign("left");
            editor.chain().focus().setTextAlign("left").run();
          }}
        >
          L
        </button>

        <button
          style={align === "center" ? styles.activeBtn : styles.toolBtn}
          onClick={() => {
            setAlign("center");
            editor.chain().focus().setTextAlign("center").run();
          }}
        >
          C
        </button>

        <button
          style={align === "right" ? styles.activeBtn : styles.toolBtn}
          onClick={() => {
            setAlign("right");
            editor.chain().focus().setTextAlign("right").run();
          }}
        >
          R
        </button>

        <button
          style={editor.isActive("bulletList") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </button>

        <button
          style={editor.isActive("orderedList") ? styles.activeBtn : styles.toolBtn}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>

        <div style={styles.divider}></div>

        <button
          style={styles.toolBtn}
          onClick={() => editor.chain().focus().undo().run()}
        >
          Undo
        </button>

        <button
          style={styles.toolBtn}
          onClick={() => editor.chain().focus().redo().run()}
        >
          Redo
        </button>
      </div>

      <div style={styles.paper}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
  },
  toolbar: {
    width: "fit-content",
    maxWidth: "95%",
    margin: "0 auto 24px auto",
    background: "rgba(255,255,255,0.95)",
    padding: "12px 14px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    alignItems: "center",
    position: "sticky",
    top: "18px",
    zIndex: 10,
    border: "1px solid #e5e7eb",
  },
  select: {
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
  },
  toolBtn: {
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    background: "#f8fafc",
    borderRadius: "10px",
    cursor: "pointer",
    color: "#111827",
    fontWeight: "600",
    fontSize: "14px",
  },
  activeBtn: {
    padding: "9px 12px",
    border: "1px solid #2563eb",
    background: "#2563eb",
    borderRadius: "10px",
    cursor: "pointer",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  color: {
    width: "38px",
    height: "38px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    cursor: "pointer",
    background: "#f8fafc",
  },
  divider: {
    width: "1px",
    height: "28px",
    background: "#e5e7eb",
  },
  paper: {
    width: "820px",
    minHeight: "920px",
    margin: "0 auto",
    background: "#ffffff",
    padding: "72px",
    borderRadius: "18px",
    boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
    color: "#111827",
    fontSize: "18px",
    lineHeight: "1.8",
    outline: "none",
  },
};

export default TiptapEditor;