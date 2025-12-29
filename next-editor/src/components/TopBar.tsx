'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import SavePopover from './SavePopover';

const TopBar = () => {
  const { editor } = useEditor();
  const [showSavePopover, setShowSavePopover] = useState(false);

  const handleRulerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    if (e.target.checked) {
      editor.rulerEnable();
    } else {
      editor.rulerDisable();
    }
  };

  return (
    <header
      className="h-[45px] border-b border-[#eef2f8] bg-white flex justify-between items-center px-4"
      suppressHydrationWarning
    >
      <div className="flex items-center gap-4" suppressHydrationWarning>
        <div className="font-bold text-lg">Logo</div>
        <div className="h-4 w-[1px] bg-gray-300"></div>

        {/* Import Buttons */}
        <button className="text-sm hover:text-blue-500" suppressHydrationWarning>
          Import JSON
        </button>
        <div className="h-4 w-[1px] bg-gray-300"></div>
        <button className="text-sm hover:text-blue-500" suppressHydrationWarning>
          Import File
        </button>
        <div className="h-4 w-[1px] bg-gray-300"></div>

        <button className="text-sm hover:text-blue-500" suppressHydrationWarning>
          Templates
        </button>
        <div className="h-4 w-[1px] bg-gray-300"></div>

        {/* Ruler Toggle */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Grid/Ruler</label>
          <input
            type="checkbox"
            defaultChecked
            onChange={handleRulerToggle}
            suppressHydrationWarning
          />
        </div>

        <div className="h-4 w-[1px] bg-gray-300"></div>

        <button
          className="text-sm hover:text-blue-500"
          onClick={() => editor?.undo()}
          suppressHydrationWarning
        >
          Undo
        </button>
        <button
          className="text-sm hover:text-blue-500"
          onClick={() => editor?.redo()}
          suppressHydrationWarning
        >
          Redo
        </button>
      </div>

      <div className="flex items-center gap-4" suppressHydrationWarning>
        {/* Right Side Tools */}
        <button className="text-sm" suppressHydrationWarning>
          Pro
        </button>
        <button className="text-sm" suppressHydrationWarning>
          Preview
        </button>
        <div className="relative">
          <button
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => setShowSavePopover(!showSavePopover)}
            suppressHydrationWarning
          >
            Export
          </button>
          {showSavePopover && <SavePopover onClose={() => setShowSavePopover(false)} />}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
