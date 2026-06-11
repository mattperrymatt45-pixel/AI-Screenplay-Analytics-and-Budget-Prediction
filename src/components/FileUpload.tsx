import { useState, useRef, useCallback } from 'react';
import { DEMO_SCRIPTS } from '../lib/demoScripts';
import { DemoScript } from '../types';

interface FileUploadProps {
  onFileContent: (content: string, filename: string) => void;
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onFileContent, onFileUpload, isProcessing }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showDemos, setShowDemos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf') {
      onFileUpload(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => onFileContent(e.target?.result as string, file.name);
      reader.readAsText(file);
    }
  }, [onFileContent, onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDemoSelect = useCallback((demo: DemoScript) => {
    onFileContent(demo.content, `${demo.name}.fountain`);
    setShowDemos(false);
  }, [onFileContent]);

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div
        className={`border border-dashed rounded transition-colors cursor-pointer ${
          isDragging ? 'border-accent bg-accent/[0.04]' : 'border-line hover:border-dim'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="px-6 py-16 text-center">
          {isProcessing ? (
            <div className="space-y-3">
              <p className="text-bright text-sm cursor-blink">ANALYZING SCRIPT</p>
              <p className="text-body text-xs">parsing — extracting — estimating — matching</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-bright text-sm">DROP SCREENPLAY HERE</p>
              <p className="text-body text-xs">or click to browse — accepts .fountain .fdx .pdf .txt</p>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".fountain,.fdx,.txt,.spmd,.pdf" className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {/* Demo scripts */}
      <div>
        <button onClick={() => setShowDemos(!showDemos)} disabled={isProcessing}
          className="w-full text-left text-xs text-dim hover:text-body transition-colors disabled:opacity-40 flex items-center justify-between py-1">
          <span>— DEMO SCRIPTS —</span>
          <span className="text-accent">{showDemos ? '▴' : '▾'}</span>
        </button>

        {showDemos && (
          <div className="mt-2 border border-line rounded divide-y divide-line-light anim-in">
            {DEMO_SCRIPTS.map((demo, idx) => (
              <button key={idx} onClick={() => handleDemoSelect(demo)}
                className="w-full text-left px-4 py-3 hover:bg-raised transition-colors">
                <p className="text-xs text-heading">{demo.name}</p>
                <p className="text-[11px] text-dim mt-0.5">{demo.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
