'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import axios from 'axios';

const API_HOST = process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc';

const MaterialPanel = () => {
  const { editor, fabric } = useEditor();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_HOST}/api/materials?populate=*&pagination[pageSize]=100`);
      if (res.data && res.data.data) {
        setMaterials(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaterial = async (item: any) => {
    if (!editor || !fabric) return;
    try {
      setLoading(true);
      const imgUrl = item.attributes.img?.data?.attributes?.url;
      if (!imgUrl) return;

      if (item.attributes.json) {
        fabric.Image.fromURL(
          API_HOST + imgUrl,
          (img: any) => {
            img.set({
              left: 100,
              top: 100,
            });
            if (img.width > 200) {
              img.scaleToWidth(200);
            }
            editor.addBaseType(img, { center: true });
            setLoading(false);
          },
          { crossOrigin: 'anonymous' }
        );
      } else {
        fabric.Image.fromURL(
          API_HOST + imgUrl,
          (img: any) => {
            img.set({
              left: 100,
              top: 100,
            });
            if (img.width > 200) {
              img.scaleToWidth(200);
            }
            editor.addBaseType(img, { center: true });
            setLoading(false);
          },
          { crossOrigin: 'anonymous' }
        );
      }
    } catch (e) {
      console.error('Failed to add material', e);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-500 mb-3">Materials</h3>
        {loading && <div className="text-center py-4 text-gray-400">Loading...</div>}
        <div className="grid grid-cols-3 gap-2">
          {materials.map((item) => {
            const imgUrl = item.attributes.img?.data?.attributes?.url;
            if (!imgUrl) return null;
            return (
              <div
                key={item.id}
                className="cursor-pointer hover:opacity-80 transition-opacity bg-gray-50 rounded p-1 flex items-center justify-center h-24"
                onClick={() => handleAddMaterial(item)}
              >
                <img
                  src={API_HOST + imgUrl}
                  alt={item.attributes.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MaterialPanel;
