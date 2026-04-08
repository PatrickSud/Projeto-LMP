import { NavLink } from 'react-router-dom';
import { Home, Calendar, PieChart, Wallet } from 'lucide-react';

export function BottomNav() {
  const routes = [
    { path: '/', label: 'Meu Ciclo', icon: Home },
    { path: '/planejamento', label: 'Planejamento', icon: Calendar },
    { path: '/vida', label: 'Vida', icon: PieChart },
    { path: '/financas', label: 'Finanças', icon: Wallet },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-16">
        {routes.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon size={24} />
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
