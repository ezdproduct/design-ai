'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import axios from 'axios';
import qs from 'qs';
import { Search, Loader2 } from 'lucide-react';

const API_HOST = process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc';

const TemplatesPanel = () => {
  const { editor } = useEditor();
  const [types, setTypes] = useState<{ value: string; label: string }[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Template Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get(`${API_HOST}/api/templ-types?pagination[pageSize]=200`);
        const list = res.data.data.map((item: any) => ({
          value: item.id,
          label: item.attributes.name,
        }));
        setTypes([{ value: '', label: 'All' }, ...list]);
      } catch (error) {
        console.error('Failed to fetch types', error);
      }
    };
    fetchTypes();
  }, []);

  // Fetch Templates
  const fetchTemplates = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;
      setLoading(true);

      const currentPage = reset ? 1 : page;

      const query = {
        populate: { img: '*' },
        filters: {},
        pagination: {
          page: currentPage,
          pageSize: 10,
        },
      };

      const filters: any = {};
      if (selectedType) filters.templ_type = { $eq: selectedType };
      if (searchTerm) filters.name = { $contains: searchTerm };

      // Merge filters into query
      (query as any).filters = filters;

      const queryString = qs.stringify(query);

      try {
        const res = await axios.get(`${API_HOST}/api/templs?${queryString}`);
        const data = res.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes.name,
          json: item.attributes.json,
          preview:
            API_HOST +
            (item.attributes.img?.data?.attributes?.formats?.small?.url ||
              item.attributes.img?.data?.attributes?.url),
        }));

        if (reset) {
          setTemplates(data);
          setPage(2);
        } else {
          setTemplates((prev) => [...prev, ...data]);
          setPage((prev) => prev + 1);
        }

        setHasMore(currentPage < res.data.meta.pagination.pageCount);
      } catch (error) {
        console.error('Failed to fetch templates', error);
      } finally {
        setLoading(false);
      }
    },
    [selectedType, searchTerm, page, hasMore, loading]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchTemplates(true);
  }, [selectedType, searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadTemplate = async (template: any) => {
    if (!editor) return;
    try {
      setLoading(true);
      // Verify if we need to fetch full details or if json is already complete
      // usage in importTmpl.vue suggests simplified JSON might be in list, but getInfo follows up.
      // Usually list objects are enough if "json" attribute is populated.
      const res = await axios.get(`${API_HOST}/api/templs/${template.id}`);
      const fullJson = res.data.data.attributes.json;

      editor.loadJSON(JSON.stringify(fullJson), () => {
        setLoading(false);
        console.log('Template loaded');
      });
    } catch (e) {
      console.error('Failed to load template details', e);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filter */}
      <div className="p-4 border-b border-gray-100">
        <select
          className="w-full text-sm border border-gray-200 rounded p-2 mb-2 outline-none focus:border-blue-500"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates"
            className="w-full text-sm border border-gray-200 rounded p-2 pl-9 outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="aspect-[2/3] bg-gray-100 rounded overflow-hidden cursor-pointer relative group hover:ring-2 ring-blue-500 transition-all"
              onClick={() => handleLoadTemplate(tmpl)}
            >
              <img src={tmpl.preview} alt={tmpl.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {tmpl.name}
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center p-4">
            <Loader2 className="animate-spin text-blue-500" />
          </div>
        )}

        {!loading && hasMore && (
          <button
            className="w-full py-2 text-xs text-blue-500 hover:bg-blue-50 mt-2 rounded"
            onClick={() => fetchTemplates(false)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default TemplatesPanel;
