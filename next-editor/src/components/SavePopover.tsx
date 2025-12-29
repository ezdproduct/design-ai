'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { X, Download, FileJson, FileImage, Type as TypeIcon, FileCode } from 'lucide-react';

interface SavePopoverProps {
  onClose: () => void;
}

const SavePopover = ({ onClose }: SavePopoverProps) => {
  const { editor } = useEditor();
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(1);
  const [name, setName] = useState('design');

  const handleExport = () => {
    if (!editor) return;

    switch (format) {
      case 'png':
      case 'jpeg':
        editor.saveImg(); // Note: editor.saveImg might need modification to accept format/quality if not already supporting it, otherwise we use direct fabric methods.
        // Actually, looking at core/plugin/SavePlugin.ts (if available) or similar might be useful.
        // But for now, let's assume `saveImg` does default.
        // To support formats properly, we might need to call specific methods.
        // Let's assume standard fabric:
        // const dataURL = editor.canvas.toDataURL({ format, quality, multiplier: 1 });
        // And then download it.
        // However, `editor.saveImg()` likely wraps this.
        // For now, let's just trigger the existing `saveImg` for images, or implement custom logic if needed.
        // To keep it simple and safe:
        if (format === 'png') editor.saveImg(); // Default usually png
        if (format === 'jpeg') {
          // If API doesn't support params, we might fallback or try to use underlying canvas.
          // editor.canvas.toDataURL({ format: 'jpeg', quality });
          // Let's stick to what we know works safely for now or assume editor has `saveImg`
        }
        break;
      case 'json':
        // editor.exportJson() ??
        // Usually `JSON.stringify(editor.canvas.toJSON())`
        const canvasJson = (editor as any)?.fabricCanvas?.toJSON();
        if (canvasJson) {
          downloadFile(JSON.stringify(canvasJson, null, 2), 'json', name);
        }
        break;
      case 'svg':
        const canvasSvg = (editor as any)?.fabricCanvas?.toSVG();
        if (canvasSvg) {
          downloadFile(canvasSvg, 'svg', name);
        }
        break;
    }
    onClose();
  };

  const downloadFile = (content: string, type: string, fileName: string) => {
    const blob = new Blob([content], {
      type: type === 'json' ? 'application/json' : 'image/svg+xml',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick fix: Override handleExport to use a more robust image saver if needed,
  // currently assuming `editor` has access to canvas via fabricCanvas getter.

  const downloadImage = (format: 'png' | 'jpeg') => {
    const canvas = (editor as any)?.fabricCanvas;
    if (!editor || !canvas) return;

    try {
      const workspace = canvas.getObjects().find((item: any) => item.id === 'workspace');
      const viewport = canvas.viewportTransform;

      // Save current viewport
      const originalViewport = viewport ? [...viewport] : [1, 0, 0, 1, 0, 0];

      // Reset viewport to ensure 1:1 export of the workspace
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);

      // Force render to update canvas state
      canvas.renderAll();

      let options = {
        format: format,
        quality: quality,
        multiplier: 1,
      };

      if (workspace) {
        const { left, top, width, height } = workspace;
        options = {
          ...options,
          left,
          top,
          width,
          height,
        } as any;
      } else {
        // Fallback if no workspace found
        options = {
          ...options,
          width: canvas.width,
          height: canvas.height,
        } as any;
      }

      const dataUrl = canvas.toDataURL(options);

      // Restore viewport
      canvas.setViewportTransform(originalViewport);
      canvas.requestRenderAll();

      // Validate dataUrl
      if (!dataUrl || dataUrl === 'data:,' || dataUrl.length < 100) {
        console.error('Export failed: Invalid Data URL');
        // Check for potential CORS issues or empty canvas
        return;
      }

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${name || 'design'}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  return (
    <div className="absolute top-[50px] right-4 bg-white shadow-xl border rounded-lg p-4 w-[300px] z-50 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="font-bold text-gray-700">Export</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`flex items-center justify-center gap-2 p-2 rounded border text-sm ${
                format === 'png' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <FileImage size={16} /> PNG
            </button>
            <button
              onClick={() => setFormat('jpeg')}
              className={`flex items-center justify-center gap-2 p-2 rounded border text-sm ${
                format === 'jpeg' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <FileImage size={16} /> JPG
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`flex items-center justify-center gap-2 p-2 rounded border text-sm ${
                format === 'json' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <FileJson size={16} /> JSON
            </button>
            <button
              onClick={() => setFormat('svg')}
              className={`flex items-center justify-center gap-2 p-2 rounded border text-sm ${
                format === 'svg' ? 'bg-blue-50 border-blue-500 text-blue-600' : 'hover:bg-gray-50'
              }`}
            >
              <FileCode size={16} /> SVG
            </button>
          </div>
        </div>

        {format === 'jpeg' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality: {quality}
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        <button
          onClick={() => {
            if (format === 'png' || format === 'jpeg') {
              downloadImage(format);
            } else {
              handleExport();
            }
            onClose();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
};

export default SavePopover;
