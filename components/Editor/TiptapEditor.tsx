"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align"; // ✅ จัดตำแหน่ง
import Underline from "@tiptap/extension-underline"; // ✅ ขีดเส้นใต้
import Youtube from "@tiptap/extension-youtube"; // ✅ วิดีโอ
import { useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link as LinkIcon,
  Minus,
  Unlink,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnClass = (isActive: boolean) =>
    `p-2 rounded hover:bg-slate-200 transition-colors ${isActive ? "bg-slate-200 text-indigo-600" : "text-slate-600"
    }`;

  // ฟังก์ชันใส่ลิงก์
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // ฟังก์ชันใส่ Youtube
  const addYoutube = useCallback(() => {
    const url = window.prompt("Enter YouTube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg sticky top-0 z-10">
      {/* --- History --- */}
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={`${btnClass(false)} disabled:opacity-30`} title="Undo">
        <Undo size={16} />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={`${btnClass(false)} disabled:opacity-30`} title="Redo">
        <Redo size={16} />
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* --- Text Formatting --- */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="Bold">
        <Bold size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="Italic">
        <Italic size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="Underline">
        <UnderlineIcon size={16} />
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* --- Alignment (เพิ่มมาใหม่) --- */}
      <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Align Left">
        <AlignLeft size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Align Center">
        <AlignCenter size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Align Right">
        <AlignRight size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign("justify").run()} className={btnClass(editor.isActive({ textAlign: "justify" }))} title="Justify">
        <AlignJustify size={16} />
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* --- Headings --- */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="Heading 2">
        <Heading1 size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="Heading 3">
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* --- Lists & Structure --- */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Bullet List">
        <List size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Ordered List">
        <ListOrdered size={16} />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Quote">
        <Quote size={16} />
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Horizontal Rule">
        <Minus size={16} />
      </button>

      <div className="w-px h-6 bg-slate-300 mx-1" />

      {/* --- Media & Links --- */}
      <button onClick={setLink} className={btnClass(editor.isActive("link"))} title="Add Link">
        <LinkIcon size={16} />
      </button>
      {editor.isActive("link") && (
        <button onClick={() => editor.chain().focus().unsetLink().run()} className={btnClass(false)} title="Remove Link">
          <Unlink size={16} className="text-red-500" />
        </button>
      )}



      {/* YouTube Button */}
      <button onClick={addYoutube} className={btnClass(editor.isActive("youtube"))} title="Insert YouTube">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube-icon lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
      </button>

    </div>
  );
};

export default function TiptapEditor({
  content,
  onChange,
  placeholder,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || "Write something..." }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer hover:text-blue-800" },
      }),
      // ✅ 1. ตั้งค่า Alignment
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      // ✅ 2. ตั้งค่า Underline
      Underline,
      // ✅ 3. ตั้งค่า YouTube
      Youtube.configure({
        controls: false, // ซ่อนปุ่ม control ของ youtube เพื่อความสวยงาม
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "rounded-xl overflow-hidden my-4 mx-auto w-full aspect-video border border-slate-200"
        }
      }),
    ],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] p-4 prose-img:rounded-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="flex-1" />
    </div>
  );
}