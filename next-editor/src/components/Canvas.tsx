'use client';

import React, { useEffect, useRef } from 'react';
import type { IEditor } from '@kuaitu/core';
import { useEditor } from '@/context/EditorContext';

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setEditor, setFabric } = useEditor();

  useEffect(() => {
    if (!canvasRef.current) return;

    let canvasInstance: any = null;
    let editorInstance: any = null;

    const init = async () => {
      // Wait for #workspace element to be available in DOM
      // This handles potential hydration race conditions
      let attempts = 0;
      while (!document.querySelector('#workspace') && attempts < 20) {
        await new Promise((r) => setTimeout(r, 100));
        attempts++;
      }

      if (!document.querySelector('#workspace')) {
        console.error('Workspace element missing after wait. Initialization aborted.');
        return;
      }

      // Dynamically import fabric and core to avoid SSR issues
      const { fabric } = await import('fabric');
      const Core = await import('@kuaitu/core');
      const Editor = Core.default;

      // Unpack plugins
      const {
        DringPlugin,
        AlignGuidLinePlugin,
        ControlsPlugin,
        CenterAlignPlugin,
        LayerPlugin,
        CopyPlugin,
        MoveHotKeyPlugin,
        DeleteHotKeyPlugin,
        GroupPlugin,
        DrawLinePlugin,
        GroupTextEditorPlugin,
        GroupAlignPlugin,
        WorkspacePlugin,
        HistoryPlugin,
        FlipPlugin,
        RulerPlugin,
        MaterialPlugin,
        WaterMarkPlugin,
        FontPlugin,
        PolygonModifyPlugin,
        DrawPolygonPlugin,
        FreeDrawPlugin,
        PathTextPlugin,
        PsdPlugin,
        SimpleClipImagePlugin,
        BarCodePlugin,
        QrCodePlugin,
        ImageStroke,
        ResizePlugin,
        LockPlugin,
        AddBaseTypePlugin,
        MaskPlugin,
      } = Core;

      // Initialize fabric
      const canvas = new fabric.Canvas(canvasRef.current, {
        fireRightClick: true,
        stopContextMenu: true,
        controlsAboveOverlay: true,
        preserveObjectStacking: true,
        width: 800,
        height: 600,
      });
      canvasInstance = canvas;

      // Initialize editor
      const canvasEditor = new Editor() as unknown as IEditor;
      canvasEditor.init(canvas);
      editorInstance = canvasEditor;

      // Register plugins
      canvasEditor
        .use(DringPlugin)
        .use(PolygonModifyPlugin)
        .use(AlignGuidLinePlugin)
        .use(ControlsPlugin)
        .use(CenterAlignPlugin)
        .use(LayerPlugin)
        .use(CopyPlugin)
        .use(MoveHotKeyPlugin)
        .use(DeleteHotKeyPlugin)
        .use(GroupPlugin)
        .use(DrawLinePlugin)
        .use(GroupTextEditorPlugin)
        .use(GroupAlignPlugin)
        .use(WorkspacePlugin)
        .use(HistoryPlugin)
        .use(FlipPlugin)
        .use(RulerPlugin)
        .use(DrawPolygonPlugin)
        .use(FreeDrawPlugin)
        .use(PathTextPlugin)
        .use(SimpleClipImagePlugin)
        .use(BarCodePlugin)
        .use(QrCodePlugin)
        .use(FontPlugin, {
          repoSrc: process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc',
        })
        .use(MaterialPlugin, {
          repoSrc: process.env.NEXT_PUBLIC_APIHOST || 'https://github.kuaitu.cc',
        })
        .use(WaterMarkPlugin)
        .use(PsdPlugin)
        .use(ImageStroke)
        .use(ResizePlugin)
        .use(LockPlugin)
        .use(AddBaseTypePlugin)
        .use(MaskPlugin);

      // Enable ruler by default
      canvasEditor.rulerEnable();
      setEditor(canvasEditor);
      setFabric(fabric);
    };

    init();

    return () => {
      if (editorInstance) {
        editorInstance.destory();
      }
      if (canvasInstance) {
        canvasInstance.dispose();
      }
    };
  }, [setEditor, setFabric]);

  return (
    <div className="relative w-full h-full bg-slate-100 flex items-center justify-center relative">
      <div id="workspace" className="relative w-full h-full">
        <div className="canvas-box relative">
          <div className="inside-shadow absolute inset-0 z-10 pointer-events-none shadow-[inset_0_0_9px_2px_#0000001f]"></div>
          <canvas ref={canvasRef} id="canvas"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Canvas;
