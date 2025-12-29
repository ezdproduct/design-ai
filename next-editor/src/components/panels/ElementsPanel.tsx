'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { Type, Square, Circle, Triangle } from 'lucide-react';

const ElementsPanel = () => {
  const { editor, fabric } = useEditor();

  const addText = () => {
    if (!editor || !fabric) return;
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 80,
      fill: '#000000',
    });
    editor.addBaseType(text, { center: true });
  };

  const addRect = () => {
    if (!editor || !fabric) return;
    const rect = new fabric.Rect({
      width: 400,
      height: 400,
      fill: '#F57274',
    });
    editor.addBaseType(rect, { center: true });
  };

  const addCircle = () => {
    if (!editor || !fabric) return;
    const circle = new fabric.Circle({
      radius: 150,
      fill: '#57606B',
    });
    editor.addBaseType(circle, { center: true });
  };

  const addTriangle = () => {
    if (!editor || !fabric) return;
    const triangle = new fabric.Triangle({
      width: 400,
      height: 400,
      fill: '#92706B',
    });
    editor.addBaseType(triangle, { center: true });
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-500 mb-3">Basic Shapes</h3>
        <div className="grid grid-cols-4 gap-4">
          <button
            className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded"
            onClick={addText}
            title="Text"
          >
            <Type size={20} className="text-gray-700" />
          </button>
          <button
            className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded"
            onClick={addRect}
            title="Rectangle"
          >
            <Square size={20} className="text-gray-700" />
          </button>
          <button
            className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded"
            onClick={addCircle}
            title="Circle"
          >
            <Circle size={20} className="text-gray-700" />
          </button>
          <button
            className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded"
            onClick={addTriangle}
            title="Triangle"
          >
            <Triangle size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementsPanel;
