import { useCallback, useEffect, useState } from 'react';
import { parseTimeline } from './parser';
import type { TimelineData } from './parser';
import { assignColors } from './colors';
import Timeline from './components/Timeline';
import Editor from './components/Editor';

function App() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [colorMap, setColorMap] = useState<Record<string, string>>({});
  const [rawMarkdown, setRawMarkdown] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);

  const applyMarkdown = useCallback((raw: string) => {
    setRawMarkdown(raw);
    const parsed = parseTimeline(raw);
    const types = [...new Set(parsed.events.map((e) => e.type))];
    setData(parsed);
    setColorMap(assignColors(types));
  }, []);

  useEffect(() => {
    fetch('/events.md')
      .then((res) => res.text())
      .then(applyMarkdown);
  }, [applyMarkdown]);

  if (!data) return null;

  return (
    <>
      <Timeline
        events={data.events}
        colorMap={colorMap}
        onEditClick={() => setEditorOpen(true)}
      />
      {editorOpen && (
        <Editor
          rawMarkdown={rawMarkdown}
          onApply={applyMarkdown}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </>
  );
}

export default App;
