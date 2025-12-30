'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Lock,
  Unlock,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Layers as LayersIcon,
} from 'lucide-react';

const LayersPanel = () => {
  const { editor, fabric } = useEditor();
  const [layers, setLayers] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'i-text':
      case 'textbox':
        return <Type size={16} />;
      case 'image':
        return <ImageIcon size={16} />;
      case 'rect':
        return <Square size={16} />;
      case 'circle':
        return <Circle size={16} />;
      case 'triangle':
        return <Triangle size={16} />;
      case 'polygon':
        return <Hexagon size={16} />;
      default:
        return <LayersIcon size={16} />;
    }
  };

  const getLayerName = (item: any) => {
    return item.name || item.text || item.type;
  };

  const refreshLayers = () => {
    if (!editor || !editor.fabricCanvas) return;
    const objects = editor.fabricCanvas.getObjects().filter((item: any) => {
      // Filter out guidelines and workspace background
      return item.type !== 'GuideLine' && item.id !== 'workspace';
    });

    // Reverse to show top-most first
    const list = [...objects].reverse().map((item: any) => ({
      id: item.id || item.uid, // Use unique ID
      type: item.type,
      name: getLayerName(item),
      isLock: !item.selectable,
      object: item,
    }));

    setLayers(list);

    const activeObject = editor.fabricCanvas.getActiveObject();
    setActiveId(activeObject ? (activeObject as any).id : null);
  };

  useEffect(() => {
    if (!editor) return;

    // Initial load
    refreshLayers();

    // Listeners
    const handleRender = () => refreshLayers();
    const handleSelection = (e: any) => {
      const active = e.selected ? e.selected[0] : null;
      setActiveId(active ? active.id : null);
    };

    const canvas = editor.fabricCanvas;
    if (!canvas) return;

    canvas.on('after:render', handleRender);
    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setActiveId(null));

    return () => {
      canvas.off('after:render', handleRender);
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared');
    };
  }, [editor]);

  const handleSelect = (layer: any) => {
    if (!editor || !editor.fabricCanvas) return;
    editor.fabricCanvas.discardActiveObject();
    editor.fabricCanvas.setActiveObject(layer.object);
    editor.fabricCanvas.requestRenderAll();
    setActiveId(layer.id);
  };

  const handleLock = (e: React.MouseEvent, layer: any) => {
    e.stopPropagation();
    if (!editor) return;
    // Select logic from original: select(item.id); item.isLock ? unLock() : lock();
    // Here we can operate directly
    handleSelect(layer);
    if (layer.isLock) {
      editor.unLock();
    } else {
      editor.lock();
    }
  };

  const moveLayer = (direction: 'up' | 'down' | 'top' | 'bottom') => {
    if (!editor) return;
    switch (direction) {
      case 'up':
        editor.up();
        break;
      case 'down':
        editor.down();
        break;
      case 'top':
        editor.toFront();
        break;
      case 'bottom':
        editor.toBack();
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Layers</h3>
        <div className="flex gap-1">
          <button
            onClick={() => moveLayer('top')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Bring to Front"
          >
            <ChevronsUp size={16} />
          </button>
          <button
            onClick={() => moveLayer('up')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Bring Forward"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => moveLayer('down')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Send Backward"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onClick={() => moveLayer('bottom')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Send to Back"
          >
            <ChevronsDown size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {layers.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">No layers</div>
        ) : (
          <div className="space-y-1">
            {layers.map((layer) => (
              <div
                key={layer.id || Math.random()}
                className={`flex items-center justify-between p-2 rounded cursor-pointer group text-sm ${
                  activeId === layer.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
                onClick={() => handleSelect(layer)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getIcon(layer.type)}
                  <span className="truncate max-w-[150px]">{layer.name}</span>
                </div>
                <button
                  className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-opacity ${
                    layer.isLock ? 'opacity-100 text-red-500' : ''
                  }`}
                  onClick={(e) => handleLock(e, layer)}
                >
                  {layer.isLock ? <Lock size={14} /> : <Unlock size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
