import Placeholder from '@tiptap/extension-placeholder';
import { DOMParser as PMDOMParser } from '@tiptap/pm/model';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code2,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useEffect } from 'react';

import './RichTextEditor.css';

type RichTextEditorProps = {
  value: string | TrustedHTML;
  onChange: (html: string | TrustedHTML) => void;
  placeholder?: string;
};

const defaultToolbarState = {
  bold: false,
  italic: false,
  strike: false,
  heading1: false,
  heading2: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something...',
}: RichTextEditorProps) {
  const looksLikeHtml = (text: string) => /<\/?[a-z][\s\S]*>/i.test(text.trim());
  const decodeHtmlEntities = (text: string) => {
    if (!text) {
      return text;
    }

    const decoder = document.createElement('textarea');
    decoder.innerHTML = text;
    return decoder.value;
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[200px] p-4 outline-none',
      },
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;

        if (!clipboardData) {
          return false;
        }

        const html = clipboardData.getData('text/html');
        const text = clipboardData.getData('text/plain');
        const decodedText = decodeHtmlEntities(text);
        const source =
          html || (looksLikeHtml(text) ? text : looksLikeHtml(decodedText) ? decodedText : '');

        if (!source) {
          return false;
        }

        const container = document.createElement('div');
        container.innerHTML = source;

        const parser = PMDOMParser.fromSchema(view.state.schema);
        const slice = parser.parseSlice(container);

        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
        event.preventDefault();
        return true;
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  const toolbarState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive('bold') ?? false,
      italic: editor?.isActive('italic') ?? false,
      strike: editor?.isActive('strike') ?? false,
      heading1: editor?.isActive('heading', { level: 1 }) ?? false,
      heading2: editor?.isActive('heading', { level: 2 }) ?? false,
      bulletList: editor?.isActive('bulletList') ?? false,
      orderedList: editor?.isActive('orderedList') ?? false,
      blockquote: editor?.isActive('blockquote') ?? false,
      codeBlock: editor?.isActive('codeBlock') ?? false,
    }),
  });

  const activeState = toolbarState ?? defaultToolbarState;

  useEffect(() => {
    if (!editor) {
      return;
    }

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  const Button = ({
    onClick,
    active,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`rounded-md p-2 transition hover:bg-gray-300 ${active ? 'bg-gray-200' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 bg-white">
      <EditorContent
        className="prose prose-sm max-w-[100vw] prose-p:my-1 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-blockquote:my-2"
        editor={editor}
      />
      <div className="sticky top-0 flex flex-wrap gap-1 border-t border-gray-300 p-2 bg-white">
        <Button active={activeState.bold} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={18} />
        </Button>

        <Button
          active={activeState.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </Button>

        <Button
          active={activeState.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </Button>

        <Button
          active={activeState.heading1}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={18} />
        </Button>

        <Button
          active={activeState.heading2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={18} />
        </Button>

        <Button
          active={activeState.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </Button>

        <Button
          active={activeState.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </Button>

        <Button
          active={activeState.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </Button>

        <Button
          active={activeState.codeBlock}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={18} />
        </Button>

        <div className="mx-2 h-6 w-px bg-gray-300" />

        <Button onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={18} />
        </Button>

        <Button onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={18} />
        </Button>
      </div>
    </div>
  );
}
