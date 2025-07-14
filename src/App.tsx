import { Routes, Route } from 'react-router-dom';
import './App.css'
import ChatPage from './pages/Chat';
import LoginPage from './pages/Login';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}

export default App;