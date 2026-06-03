import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/students', label: 'Students', icon: '🎓' },
  { to: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
  { to: '/courses', label: 'Courses', icon: '📚' },
  { to: '/enrollments', label: 'Enrollments', icon: '📋' },
  { to: '/grades', label: 'Grades', icon: '📝' },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-gray-900 text-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center border-b border-gray-800 px-6">
          <h1 className="text-lg font-bold">SMS</h1>
          <span className="ml-2 text-xs text-gray-400">v1.0</span>
        </div>

        <nav className="mt-4 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `mb-1 flex items-center rounded-md px-3 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
