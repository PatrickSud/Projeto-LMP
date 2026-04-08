import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
