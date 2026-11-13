import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Node } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading2,
  ImagePlus,
  Italic,
  List,
  ListOrdered,
  Paperclip,
  Redo2,
  Strikethrough,
  Undo2,
} from 'lucide-react';
import { tw } from '../tw.js';

const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_ATTACHMENT_BYTES = 6 * 1024 * 1024;
const ATTACHMENT_TYPES = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
]);

const FileAttachment = Node.create({
  name: 'fileAttachment',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      name: {
        default: 'Download file',
        parseHTML: (element) => element.getAttribute('download') || element.textContent,
        renderHTML: (attributes) => ({ download: attributes.name }),
      },
      mimeType: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-mime') || '',
        renderHTML: (attributes) => ({ 'data-mime': attributes.mimeType }),
      },
      data: {
        default: '',
        parseHTML: (element) => element.getAttribute('href') || '',
        renderHTML: (attributes) => ({ href: attributes.data }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'a[data-file-attachment]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const safeName = String(HTMLAttributes.download || 'Download file').slice(0, 180);
    const safeData = String(HTMLAttributes.href || '');
    const safeMime = String(HTMLAttributes['data-mime'] || '');
    const allowedData = ATTACHMENT_TYPES.has(safeMime)
      && safeData.startsWith(`data:${safeMime};base64,`)
      && /^[A-Za-z0-9+/=]+$/.test(safeData.slice(safeData.indexOf(',') + 1));

    return [
      'a',
      {
        'data-file-attachment': '',
        'data-mime': allowedData ? safeMime : '',
        href: allowedData ? safeData : '',
        download: safeName,
        class: 'editor-file-attachment',
      },
      ['span', { 'aria-hidden': 'true', class: 'editor-file-icon' }, '↓'],
      ['span', {}, safeName],
    ];
  },
});

function extensions(placeholder = '') {
  return [
    StarterKit,
    Image.configure({ allowBase64: true }),
    Placeholder.configure({ placeholder }),
    FileAttachment,
  ];
}

function embeddedBytes(content = '') {
  let total = 0;
  for (const match of content.matchAll(/data:[^;]+;base64,([A-Za-z0-9+/=]+)/g)) {
    const encoded = match[1];
    total += Math.floor(encoded.length * 3 / 4) - (encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0);
  }
  return total;
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error(`Could not read ${file.name}.`));
    }, { once: true });
    reader.addEventListener('error', () => reject(new Error(`Could not read ${file.name}.`)), { once: true });
    reader.readAsDataURL(file);
  });
}

const RichTextEditor = forwardRef(function RichTextEditor({ content = '', onError, placeholder }, ref) {
  const imageInput = useRef(null);
  const fileInput = useRef(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  const editor = useEditor({
    extensions: extensions(placeholder),
    content,
    immediatelyRender: false,
    editorProps: { attributes: { 'aria-label': placeholder || 'Rich text editor' } },
  });
  useImperativeHandle(ref, () => ({ getHTML: () => editor?.getHTML() || '' }), [editor]);

  async function addFiles(event) {
    const selected = Array.from(event.target.files || []);
    event.target.value = '';
    if (!editor || !selected.length) return;

    let totalBytes = embeddedBytes(editor.getHTML());
    for (const file of selected) {
      const isImage = file.type.startsWith('image/');
      if (!ATTACHMENT_TYPES.has(file.type)) {
        onErrorRef.current?.(`${file.name}: choose an image, PDF, Word, Excel, CSV, or text file.`);
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        onErrorRef.current?.(`${file.name}: files must be 4 MB or smaller.`);
        continue;
      }
      if (totalBytes + file.size > MAX_TOTAL_ATTACHMENT_BYTES) {
        onErrorRef.current?.('Attachments in one note or post cannot exceed 6 MB.');
        break;
      }

      try {
        const data = await readDataUrl(file);
        const name = file.name.replace(/[\\/]/g, '_').slice(0, 180);
        const inserted = isImage
          ? editor.chain().focus().setImage({ src: data, alt: name, title: name }).run()
          : editor.chain().focus().insertContent({
              type: 'fileAttachment',
              attrs: { name, mimeType: file.type, data },
            }).run();

        if (!inserted) {
          onErrorRef.current?.(`Could not add ${file.name} to the editor.`);
          continue;
        }
        totalBytes += file.size;
      } catch (error) {
        onErrorRef.current?.(error.message);
      }
    }
  }

  if (!editor) return <div className={"[min-height:185px] [display:grid] [place-items:center] [color:#879189] [background:#fff] [border:1px_solid_#dfe5df] [border-radius:7px] [font-size:11px]"}>Opening editor…</div>;

  return (
    <div className={"w-full min-w-0 max-w-full overflow-hidden rounded-[7px] border border-[#dfe5df] bg-white"}>
      <div className={"[min-height:40px] [padding:5px_7px] [display:flex] [align-items:center] [flex-wrap:wrap] [gap:3px] [border-bottom:1px_solid_#edf0ed] [background:#fbfcfb]"} role="toolbar" aria-label="Text formatting">
        <ToolbarButton label="Bold" active={editor.isActive('bold')} disabled={!editor.can().chain().focus().toggleBold().run()} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} disabled={!editor.can().chain().focus().toggleItalic().run()} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
        <ToolbarButton label="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolbarButton>
        <span className={"[width:1px] [height:20px] [margin:0_3px] [background:#e3e8e3]"} />
        <ToolbarButton label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={17} /></ToolbarButton>
        <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={17} /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={17} /></ToolbarButton>
        <span className={"[width:1px] [height:20px] [margin:0_3px] [background:#e3e8e3]"} />
        <ToolbarButton label="Add image" onClick={() => imageInput.current?.click()}><ImagePlus size={16} /></ToolbarButton>
        <ToolbarButton label="Attach file" onClick={() => fileInput.current?.click()}><Paperclip size={16} /></ToolbarButton>
        <span className={"[flex:1]"} />
        <ToolbarButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 size={16} /></ToolbarButton>
        <ToolbarButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 size={16} /></ToolbarButton>
      </div>
      <EditorContent editor={editor} className={"max-h-[min(44vh,360px)] min-h-[185px] min-w-0 max-w-full overflow-x-auto overflow-y-auto p-[11px_12px] text-[13px] font-normal leading-[1.65] text-[#344239] [&_.tiptap]:min-h-[160px] [&_.tiptap]:[overflow-wrap:anywhere] [&_.tiptap]:outline-none [&_.tiptap_h2]:my-[12px] [&_.tiptap_h2]:mb-[6px] [&_.tiptap_h2]:text-[20px] [&_.tiptap_h2]:[font-family:var(--font-serif)] [&_.tiptap_img]:h-auto [&_.tiptap_img]:max-h-[300px] [&_.tiptap_img]:max-w-full [&_.tiptap_img]:rounded-[5px] [&_.tiptap_img]:object-contain [&_.tiptap_ol]:my-[5px] [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-[22px] [&_.tiptap_p]:mb-[8px] [&_.tiptap_p:last-child]:mb-0 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_p.is-editor-empty:first-child::before]:float-left [&_.tiptap_p.is-editor-empty:first-child::before]:text-[#a2aaa4] [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:h-0 [&_.tiptap_ul]:my-[5px] [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-[22px]"} />
      <div className={"[padding:6px_10px] [display:flex] [justify-content:space-between] [gap:8px] [color:#879189] [border-top:1px_solid_#edf0ed] [font-size:9px] max-[560px]:[flex-wrap:wrap]"}>
        <span>Formatting, images and file attachments</span>
        <span>Up to 4 MB per file · 6 MB total</span>
      </div>
      <input ref={imageInput} className={"!absolute !h-px !w-px !max-w-px overflow-hidden [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]"} type="file" accept="image/png,image/jpeg,image/gif,image/webp" multiple onChange={addFiles} aria-label="Choose images" />
      <input ref={fileInput} className={"!absolute !h-px !w-px !max-w-px overflow-hidden [clip:rect(0,_0,_0,_0)] [white-space:nowrap] [clip-path:inset(50%)]"} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain" multiple onChange={addFiles} aria-label="Choose files" />
    </div>
  );
});

export default RichTextEditor;

function ToolbarButton({ label, active = false, disabled = false, onClick, children }) {
  return (
    <button
      type="button"
      className={tw('editor-tool', active && 'active')}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function RichTextContent({ content }) {
  const editor = useEditor({
    extensions: extensions(),
    content,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;
  return <EditorContent editor={editor} className={"[&_.tiptap_ul]:[list-style-type:disc] [&_.tiptap_ol]:[list-style-type:decimal] [&_.tiptap_img]:[max-width:100%] [&_.tiptap_img]:[max-height:300px] [&_.tiptap_img]:[height:auto] [&_.tiptap_img]:[object-fit:contain] [&_.tiptap_img]:[border-radius:5px] [min-width:0] [overflow-wrap:anywhere] [color:#78847b] [font-size:10px] [line-height:1.6] [&_.tiptap]:[min-width:0] [&_.tiptap_p]:[margin:0_0_6px] [&_.tiptap_h2]:[margin:0_0_6px] [&_.tiptap_h2]:[font:16px/1.35_var(--serif)] [&_.tiptap_ul]:[margin:4px_0] [&_.tiptap_ul]:[padding-left:20px] [&_.tiptap_ol]:[margin:4px_0] [&_.tiptap_ol]:[padding-left:20px] [&_.tiptap_img]:[display:block] [.note-card_&]:[max-height:100px] [.note-card_&]:[overflow:hidden] [.post-card_&]:[margin:8px_0] [.post-card_&]:[color:#68756c] [.post-card_&]:[font-size:12px]"} />;
}

export function richTextToText(content = '') {
  return new DOMParser().parseFromString(content, 'text/html').body.textContent || '';
}
