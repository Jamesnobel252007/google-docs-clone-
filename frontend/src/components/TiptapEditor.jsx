import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Undo2,
  Redo2,
  Printer,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  Link2,
  ImagePlus,
  Table2,
  HelpCircle,
} from "lucide-react";

function TiptapEditor({ content, setContent, setStatus, socketRef, onSave, onExport }) {
  const [zoom, setZoom] = useState(100);
  const remoteUpdateRef = useRef(false);
  const [bubble, setBubble] = useState({ visible: false, top: 0, left: 0 });
  const [openMenu, setOpenMenu] = useState(null);
  const menuBarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
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

      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "content",
            message: html,
          })
        );
      }
    },

    onSelectionUpdate: ({ editor }) => {
      const { from, to, empty } = editor.state.selection;

      if (empty) {
        setBubble((b) => (b.visible ? { ...b, visible: false } : b));
        return;
      }

      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      setBubble({
        visible: true,
        top: Math.min(start.top, end.top),
        left: (start.left + end.left) / 2,
      });
    },

    onBlur: () => {
      window.setTimeout(() => {
        setBubble((b) => ({ ...b, visible: false }));
      }, 150);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      remoteUpdateRef.current = true;
      editor.commands.setContent(content || "<p></p>", false);
    }
  }, [content, editor]);

  if (!editor) return null;

  const addLink = () => {
    const url = prompt("Enter link URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const wordCount = editor.getText().trim()
    ? editor.getText().trim().split(/\s+/).length
    : 0;

  const readingMinutes = Math.max(1, Math.round(wordCount / 200));

  return (
    <div className="w-full">
      {bubble.visible && (
        <div
          style={{
            position: "fixed",
            top: bubble.top - 46,
            left: bubble.left,
            transform: "translateX(-50%)",
          }}
          className="z-50 flex items-center gap-0.5 bg-[#14213D] rounded-full shadow-lg px-1.5 py-1"
          onMouseDown={(e) => e.preventDefault()}
        >
          <BubbleBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
            <Bold size={15} />
          </BubbleBtn>
          <BubbleBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
            <Italic size={15} />
          </BubbleBtn>
          <BubbleBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
            <UnderlineIcon size={15} />
          </BubbleBtn>
          <BubbleBtn
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#F2C879" }).run()}
            active={editor.isActive("highlight")}
          >
            <Highlighter size={15} />
          </BubbleBtn>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <BubbleBtn onClick={addLink} active={editor.isActive("link")}>
            <Link2 size={15} />
          </BubbleBtn>
        </div>
      )}

      {/* Menu bar */}
      <div className="sticky top-[76px] z-40 bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
        <div
          ref={menuBarRef}
          className="flex items-center justify-end px-4 py-1.5 border-b border-slate-100"
        >
          <MenuButton
            label={<HelpCircle size={18} />}
            isOpen={openMenu === "help"}
            onToggle={() => setOpenMenu(openMenu === "help" ? null : "help")}
            align="right"
          >
            <MenuItem
              onClick={() => {
                alert(`${wordCount} words, ${readingMinutes} min read`);
                setOpenMenu(null);
              }}
            >
              Word count
            </MenuItem>
            <MenuDivider />
            <MenuItem
              onClick={() => {
                alert(
                  "Ctrl+B Bold\nCtrl+I Italic\nCtrl+U Underline\nCtrl+Z Undo\nCtrl+Y Redo\nCtrl+A Select all"
                );
                setOpenMenu(null);
              }}
            >
              Keyboard shortcuts
            </MenuItem>
          </MenuButton>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-3 flex-wrap bg-slate-50/60">
          <ToolGroup>
            <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
              <Undo2 size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
              <Redo2 size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => window.print()} title="Print">
              <Printer size={16} />
            </ToolBtn>
          </ToolGroup>

          <select
            className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 outline-none hover:border-slate-300"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          >
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
          </select>

          <Divider />

          <select
            className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 outline-none hover:border-slate-300 w-[140px]"
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
            className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 outline-none hover:border-slate-300 w-[130px]"
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
              if (e.target.value === "h3") {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
              }
            }}
          >
            <option value="paragraph">Normal text</option>
            <option value="h1">Title</option>
            <option value="h2">Heading</option>
            <option value="h3">Subheading</option>
          </select>

          <Divider />

          <ToolGroup>
            <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
              <Bold size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
              <Italic size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
              <UnderlineIcon size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
              <Strikethrough size={16} />
            </ToolBtn>
          </ToolGroup>

          <input
            type="color"
            className="w-9 h-9 rounded-lg border border-slate-200 cursor-pointer bg-white"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            title="Text color"
          />

          <ToolBtn
            onClick={() => editor.chain().focus().toggleHighlight({ color: "#F2C879" }).run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter size={16} />
          </ToolBtn>

          <Divider />

          <ToolGroup>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
              <AlignLeft size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
              <AlignCenter size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
              <AlignRight size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().setTextAlign("justify").run()} title="Justify">
              <AlignJustify size={16} />
            </ToolBtn>
          </ToolGroup>

          <Divider />

          <ToolGroup>
            <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
              <List size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
              <ListOrdered size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().sinkListItem("listItem").run()} title="Indent">
              <IndentIncrease size={16} />
            </ToolBtn>
            <ToolBtn onClick={() => editor.chain().focus().liftListItem("listItem").run()} title="Outdent">
              <IndentDecrease size={16} />
            </ToolBtn>
          </ToolGroup>

          <Divider />

          <ToolGroup>
            <ToolBtn onClick={addLink} title="Insert link">
              <Link2 size={16} />
            </ToolBtn>
            <ToolBtn onClick={addImage} title="Insert image">
              <ImagePlus size={16} />
            </ToolBtn>
            <ToolBtn
              onClick={() =>
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
              }
              title="Insert table"
            >
              <Table2 size={16} />
            </ToolBtn>
          </ToolGroup>
        </div>
      </div>

      {/* Paper */}
      <div className="flex justify-center">
        <div
          className="bg-white border border-slate-200 shadow-xl rounded-sm min-h-[1050px] text-slate-900"
          style={{
            width: `${820 * (zoom / 100)}px`,
            padding: `${72 * (zoom / 100)}px`,
            fontSize: `${18 * (zoom / 100)}px`,
            lineHeight: 1.8,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500 font-mono">
        <span>{wordCount} words</span>
        <span className="w-1 h-1 rounded-full bg-slate-300" />
        <span>{readingMinutes} min read</span>
      </div>
    </div>
  );
}

function MenuButton({ label, isOpen, onToggle, children, align = "left" }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        title="Help"
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isOpen ? "bg-[#14213D] text-[#F2C879]" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          }`}
      >
        {label}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 ${align === "right" ? "right-0" : "left-0"
            }`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({ onClick, children, shortcut }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
    >
      <span>{children}</span>
      {shortcut && (
        <span className="text-[11px] text-slate-400 font-mono">{shortcut}</span>
      )}
    </button>
  );
}

function MenuDivider() {
  return <div className="h-px bg-slate-100 my-1" />;
}

function ToolGroup({ children }) {
  return (
    <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5">
      {children}
    </div>
  );
}

function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${active
          ? "bg-[#14213D] text-[#F2C879]"
          : "text-slate-600 hover:bg-slate-100"
        }`}
    >
      {children}
    </button>
  );
}

function BubbleBtn({ onClick, active, children }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${active ? "bg-[#0F6B5C] text-white" : "text-slate-200 hover:bg-white/10"
        }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-7 bg-slate-200 mx-1" />;
}

export default TiptapEditor;