import Canvas from '@/components/Canvas';
import TopBar from '@/components/TopBar';
import LeftSidebar from '@/components/LeftSidebar';
import RightSidebar from '@/components/RightSidebar';
import { EditorProvider } from '@/context/EditorContext';

export default function Home() {
  return (
    <EditorProvider>
      <main className="flex h-screen flex-col">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />
          <div className="flex-1 relative bg-slate-100">
            <Canvas />
          </div>
          <RightSidebar />
        </div>
      </main>
    </EditorProvider>
  );
}
