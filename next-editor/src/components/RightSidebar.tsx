'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  Lock,
  Trash2,
  Copy,
  EyeOff,
  AlignStartVertical,
  AlignEndVertical,
  AlignVerticalJustifyCenter,
} from 'lucide-react';

const RightSidebar = () => {
  const { editor } = useEditor();
  const [activeTab, setActiveTab] = useState('design');
  const [selectedType, setSelectedType] = useState<string>('');

  React.useEffect(() => {
    if (!editor) return;

    const updateSelection = () => {
      const activeObject = editor.canvas.getActiveObject();
      if (activeObject) {
        setSelectedType(activeObject.type || 'object');
      } else {
        setSelectedType('');
      }
    };

    editor.on('selectOne', updateSelection);
    editor.on('selectMultiple', updateSelection);
    editor.on('selectCancel', () => setSelectedType(''));

    return () => {
      editor.off('selectOne', updateSelection);
      editor.off('selectMultiple', updateSelection);
      editor.off('selectCancel', () => setSelectedType(''));
    };
  }, [editor]);

  const handleAlign = (position: string) => {
    if (!editor) return;
    switch (position) {
      case 'left':
        editor.left();
        break;
      case 'center':
        editor.xcenter();
        break;
      case 'right':
        editor.right();
        break;
      case 'top':
        editor.top();
        break;
      case 'middle':
        editor.ycenter();
        break;
      case 'bottom':
        editor.bottom();
        break;
    }
  };

  const handleAction = (action: string) => {
    if (!editor) return;
    switch (action) {
      case 'lock':
        editor.lock();
        break;
      case 'unlock':
        editor.unLock();
        break;
      case 'clone':
        editor.clone();
        break;
      case 'delete':
        editor.del();
        break;
      case 'group':
        editor.group();
        break;
      case 'ungroup':
        editor.unGroup();
        break;
    }
  };

  return (
    <div className="w-[300px] bg-white border-l border-[#eef2f8] h-full flex flex-col">
      <div className="flex border-b border-[#eef2f8]">
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'design' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('design')}
        >
          Design
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'layer' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('layer')}
        >
          Layers
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'design' ? (
          selectedType ? (
            <div className="space-y-6">
              {/* Alignment */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase">Alignment</h3>
                <div className="flex gap-2 mb-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('left')}
                    title="Align Left"
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('center')}
                    title="Align Center"
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('right')}
                    title="Align Right"
                  >
                    <AlignRight size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('top')}
                    title="Align Top"
                  >
                    <AlignStartVertical size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('middle')}
                    title="Align Middle"
                  >
                    <AlignVerticalJustifyCenter size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAlign('bottom')}
                    title="Align Bottom"
                  >
                    <AlignEndVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase">Actions</h3>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAction('lock')}
                    title="Lock"
                  >
                    <Lock size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAction('clone')}
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded text-red-500"
                    onClick={() => handleAction('delete')}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleAction('hide')}
                    title="Hide"
                  >
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>

              {/* Placeholder for attributes */}
              <div className="p-4 bg-gray-50 border border-dashed border-gray-300 rounded text-center text-sm text-gray-500">
                Properties for {selectedType}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 mt-10">Select an element to edit</div>
          )
        ) : (
          <div className="text-center text-gray-500 pt-10">
            <Layers size={48} className="mx-auto mb-2 opacity-50" />
            <p>No layers selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
