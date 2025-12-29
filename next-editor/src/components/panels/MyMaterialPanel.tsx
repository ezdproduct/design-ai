'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import axios from 'axios';
import { Upload, Image as ImageIcon, FileText, Trash2, Plus, Loader2 } from 'lucide-react';

const API_HOST = process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc';

const MyMaterialPanel = () => {
  const { editor, fabric } = useEditor();
  const [activeTab, setActiveTab] = useState<'img' | 'templ'>('img');
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // For now, we assume no token or use a placeholder if needed.
  // In a real app, you'd get this from a context or localStorage.
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token) {
      fetchMyMaterials();
    }
  }, [activeTab, token]);

  const fetchMyMaterials = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'img' ? '/api/user-materials' : '/api/user-templs';
      const res = await axios.get(`${API_HOST}${endpoint}?populate=*`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.data && res.data.data) {
        const formatted = res.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes.name,
          previewUrl: item.attributes.img?.data?.attributes?.url
            ? API_HOST + item.attributes.img.data.attributes.url
            : null,
          json: item.attributes.json,
        }));
        setFileList(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch user materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('files', file);

      // 1. Upload the image file
      const uploadRes = await axios.post(`${API_HOST}/api/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fileInfo = uploadRes.data[0];

      // 2. Create entry in user-materials
      await axios.post(
        `${API_HOST}/api/user-materials`,
        {
          data: {
            img: fileInfo.id,
            name: file.name,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchMyMaterials();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!token) return;
    try {
      const endpoint = activeTab === 'img' ? '/api/user-materials' : '/api/user-templs';
      await axios.delete(`${API_HOST}${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFileList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleAddMaterial = (item: any) => {
    if (!editor || !fabric || !item.previewUrl) return;

    fabric.Image.fromURL(
      item.previewUrl,
      (img: any) => {
        img.set({ left: 100, top: 100 });
        if (img.width > 200) img.scaleToWidth(200);
        editor.addBaseType(img, { center: true });
      },
      { crossOrigin: 'anonymous' }
    );
  };

  const handleLoadTemplate = (item: any) => {
    if (!editor || !item.json) return;
    editor.loadJSON(JSON.stringify(item.json));
  };

  if (!token) {
    return (
      <div className="p-8 text-center">
        <UserIcon className="mx-auto mb-4 text-gray-300" size={48} />
        <p className="text-gray-500 text-sm">Please login to see your materials.</p>
        {/* You could add a login button here if the app has a login flow */}
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-gray-100 mb-4">
        <button
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'img'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('img')}
        >
          Images
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'templ'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('templ')}
        >
          Templates
        </button>
      </div>

      <div className="mb-4">
        {activeTab === 'img' && (
          <label className="flex items-center justify-center gap-2 w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded cursor-pointer hover:bg-blue-100 transition-colors">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span className="text-sm font-medium">
              {uploading ? 'Uploading...' : 'Upload Image'}
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
        {activeTab === 'templ' && (
          <button
            className="flex items-center justify-center gap-2 w-full py-2 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors"
            onClick={() => {
              /* Implement save current as template */
            }}
          >
            <Plus size={16} />
            <span className="text-sm font-medium">New Design</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-gray-300" />
          </div>
        ) : fileList.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No items found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {fileList.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square bg-gray-50 rounded border border-gray-100 overflow-hidden cursor-pointer"
                onClick={() =>
                  activeTab === 'img' ? handleAddMaterial(item) : handleLoadTemplate(item)
                }
              >
                {item.previewUrl ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FileText size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMaterialPanel;
