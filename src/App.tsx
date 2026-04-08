import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vida } from './pages/Vida';
import { Planejamento } from './pages/Planejamento';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* Placeholders para as próximas telas */}
          <Route path="planejamento" element={<Planejamento />} />
          
          <Route path="vida" element={<Vida />} />
          
          <Route path="financas" element={
            <div className="flex items-center justify-center h-full text-gray-500 p-6 text-center">
              Gestor Financeiro em desenvolvimento...
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
