'use client';

import React, { useState } from 'react';
import ElementsPanel from '@/components/panels/ElementsPanel';
import TemplatesPanel from '@/components/panels/TemplatesPanel';
import MaterialPanel from '@/components/panels/MaterialPanel';
import MyMaterialPanel from '@/components/panels/MyMaterialPanel';
import LayersPanel from '@/components/panels/LayersPanel';
import TextPanel from '@/components/panels/TextPanel';
import {
  LayoutTemplate as TemplateIcon,
  Image as ImageIcon,
  Type as TypeIcon,
  Layers as LayersIcon,
  Smile as SmileIcon,
  User as UserIcon,
  ChevronLeft,
} from 'lucide-react';

const MENU_ITEMS = [
  { key: 'importTmpl', name: 'Templates', icon: TemplateIcon },
  { key: 'tools', name: 'Elements', icon: ImageIcon },
  { key: 'fontStyle', name: 'Text', icon: TypeIcon },
  { key: 'material', name: 'Material', icon: SmileIcon },
  { key: 'layer', name: 'Layers', icon: LayersIcon },
  { key: 'myMaterial', name: 'Mine', icon: UserIcon },
];

const LeftSidebar = () => {
  const [activeMenu, setActiveMenu] = useState('importTmpl');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const handleMenuClick = (key: string) => {
    if (activeMenu === key && isPanelOpen) {
      // Toggle off if clicking active
      // setIsPanelOpen(false); // Optional behavior
    } else {
      setActiveMenu(key);
      setIsPanelOpen(true);
    }
  };

  return (
    <div className="flex h-full bg-white relative">
      {/* Vertical Menu */}
      <div className="w-[65px] h-full flex flex-col items-center border-r border-[#eef2f8] bg-white z-20 relative">
        {MENU_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`w-full flex flex-col items-center justify-center py-4 cursor-pointer hover:text-blue-500 transition-colors ${
              activeMenu === item.key ? 'text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => handleMenuClick(item.key)}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Content Panel */}
      <div
        className={`w-[320px] bg-white border-r border-[#eef2f8] h-full transition-all duration-300 overflow-hidden ${
          isPanelOpen ? 'ml-0' : '-ml-[320px]'
        }`}
      >
        <div className="h-full overflow-y-auto">
          {activeMenu === 'importTmpl' ? (
            <TemplatesPanel />
          ) : activeMenu === 'tools' ? (
            <ElementsPanel />
          ) : activeMenu === 'fontStyle' ? (
            <TextPanel />
          ) : activeMenu === 'layer' ? (
            <LayersPanel />
          ) : activeMenu === 'material' ? (
            <MaterialPanel />
          ) : activeMenu === 'myMaterial' ? (
            <MyMaterialPanel />
          ) : (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">
                {MENU_ITEMS.find((i) => i.key === activeMenu)?.name}
              </h2>
              <div className="text-gray-500 text-sm">Content for {activeMenu} is coming soon.</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <button
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-16 bg-white border border-l-0 border-[#eef2f8] rounded-r-md flex items-center justify-center cursor-pointer shadow-sm z-10 transition-all duration-300 ${
          isPanelOpen ? 'left-[385px]' : 'left-[65px]'
        }`}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        <ChevronLeft
          size={16}
          className={`transition-transform duration-300 ${!isPanelOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
};

export default LeftSidebar;
