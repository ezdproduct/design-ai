'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const API_HOST = process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc';

const TextPanel = () => {
  const { editor, fabric } = useEditor();
  const [fontStyles, setFontStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFontStyles();
  }, []);

  const fetchFontStyles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_HOST}/api/font-styles?populate=*&pagination[pageSize]=100`
      );
      if (res.data && res.data.data) {
        setFontStyles(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch font styles:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHeading = () => {
    if (!editor || !fabric) return;
    const text = new fabric.IText('Add a heading', {
      left: 100,
      top: 100,
      fontSize: 80,
      fontWeight: 'bold',
      fill: '#000000',
    });
    editor.addBaseType(text, { center: true });
  };

  const addSubheading = () => {
    if (!editor || !fabric) return;
    const text = new fabric.IText('Add a subheading', {
      left: 100,
      top: 100,
      fontSize: 50,
      fontWeight: 'normal',
      fill: '#000000',
    });
    editor.addBaseType(text, { center: true });
  };

  const addBodyText = () => {
    if (!editor || !fabric) return;
    const text = new fabric.IText('Add a little bit of body text', {
      left: 100,
      top: 100,
      fontSize: 30,
      fontWeight: 'normal',
      fill: '#000000',
    });
    editor.addBaseType(text, { center: true });
  };

  const handleAddFontStyle = async (item: any) => {
    if (!editor || !fabric) return;
    try {
      setLoading(true);
      const json = item.attributes.json;
      // Ensure unique ID
      json.id = uuid();

      const elType = json.type.charAt(0).toUpperCase() + json.type.slice(1);
      // @ts-ignore
      new fabric[elType].fromObject(json, (fabricEl: any) => {
        editor.addBaseType(fabricEl, { center: true });
        setLoading(false);
      });
    } catch (e) {
      console.error('Failed to add font style', e);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-500 mb-4">Click to add text</h3>
      <div className="flex flex-col gap-3 mb-6">
        <button
          className="w-full py-4 bg-gray-50 hover:bg-gray-100 rounded border border-transparent hover:border-blue-200 transition-all font-bold text-2xl text-left px-4"
          onClick={addHeading}
        >
          Add a heading
        </button>
        <button
          className="w-full py-3 bg-gray-50 hover:bg-gray-100 rounded border border-transparent hover:border-blue-200 transition-all font-semibold text-lg text-left px-4"
          onClick={addSubheading}
        >
          Add a subheading
        </button>
        <button
          className="w-full py-2 bg-gray-50 hover:bg-gray-100 rounded border border-transparent hover:border-blue-200 transition-all text-sm text-left px-4"
          onClick={addBodyText}
        >
          Add a little bit of body text
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-500 mb-3">Font Combinations</h3>
        {loading && <div className="text-center py-4 text-gray-400">Loading...</div>}
        <div className="grid grid-cols-2 gap-2">
          {fontStyles.map((item) => {
            const imgUrl = item.attributes.img?.data?.attributes?.url;
            if (!imgUrl) return null;
            return (
              <div
                key={item.id}
                className="cursor-pointer hover:opacity-80 transition-opacity bg-gray-50 rounded p-2"
                onClick={() => handleAddFontStyle(item)}
              >
                <img
                  src={API_HOST + imgUrl}
                  alt={item.attributes.name}
                  className="w-full h-auto object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TextPanel;
