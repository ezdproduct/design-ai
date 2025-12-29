'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { IEditor } from '@kuaitu/core';
import { fabric } from 'fabric';

interface EditorContextType {
  editor: IEditor | null;
  setEditor: (editor: IEditor) => void;
  fabric: typeof fabric | null;
  setFabric: (fabric: typeof fabric) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editor, setEditor] = useState<IEditor | null>(null);
  const [fabricInstance, setFabric] = useState<typeof fabric | null>(null);

  return (
    <EditorContext.Provider value={{ editor, setEditor, fabric: fabricInstance, setFabric }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
