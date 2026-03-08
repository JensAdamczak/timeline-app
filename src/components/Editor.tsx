import { useState } from 'react';
import './Editor.css';

interface EditorProps {
  rawMarkdown: string;
  onApply: (raw: string) => void;
  onClose: () => void;
}

export default function Editor({ rawMarkdown, onApply, onClose }: EditorProps) {
  const [value, setValue] = useState(rawMarkdown);

  function handleUpdate() {
    onApply(value);
    onClose();
  }

  return (
    <div className="editor-overlay">
      <div className="editor-overlay__header">
        <span className="editor-overlay__title">Edit Timeline Events</span>
        <button className="editor-overlay__close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="editor-overlay__body">
        <textarea
          className="editor-overlay__textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          spellCheck={false}
        />
      </div>
      <div className="editor-overlay__footer">
        <button className="editor-overlay__submit" onClick={handleUpdate}>
          Update Timeline
        </button>
      </div>
    </div>
  );
}
