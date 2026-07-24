import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { DOMParser as PMDOMParser } from '@tiptap/pm/model';
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

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
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
      className={`rounded-md p-2 transition hover:bg-gray-100 ${active ? 'bg-gray-200' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex flex-wrap gap-1 border-b p-2">
        <Button
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </Button>

        <Button
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </Button>

        <Button
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={18} />
        </Button>

        <Button
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={18} />
        </Button>

        <Button
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={18} />
        </Button>

        <Button
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </Button>

        <Button
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </Button>

        <Button
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={18} />
        </Button>

        <Button
          active={editor.isActive('codeBlock')}
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

      <EditorContent editor={editor} />
    </div>
  );
}
