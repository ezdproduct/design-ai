'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { IEditor } from '@kuaitu/core';

interface EditorContextType {
  editor: IEditor | null;
  setEditor: (editor: IEditor) => void;
  fabric: any;
  setFabric: (fabric: any) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [editor, setEditor] = useState<IEditor | null>(null);
  const [fabricInstance, setFabric] = useState<any>(null);

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
