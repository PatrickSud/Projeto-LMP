import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vida } from './pages/Vida';
import { Jornada } from './pages/Jornada';
import { Financas } from './pages/Financas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="jornada" element={<Jornada />} />
          
          {/* Rotas Auxiliares */}
          <Route path="vida" element={<Vida />} />
          
          <Route path="financas" element={<Financas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
