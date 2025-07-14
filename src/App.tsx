import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './pages/Chat';
import styled from 'styled-components';
import './App.css'

function App() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Routes>
      <Route path="/" element={<LoginPage setUserId={setUserId} setPassword={setPassword} />} />
      <Route path="/chat" element={<ChatPage username={userId} />} />
    </Routes>
  );
}

// 로그인 페이지
function LoginPage({ setUserId, setPassword }: { setUserId: (id: string) => void, setPassword: (pw: string) => void }) {
  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (idInput.trim() === '' || pwInput.trim() === '') return;
    setUserId(idInput);
    setPassword(pwInput);
    navigate('/chat');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <LoginContainer>
      <LoginTitle>로그인</LoginTitle>
      <LoginForm>
        <LoginInput
          type="text"
          value={idInput}
          onChange={e => setIdInput(e.target.value)}
          placeholder="아이디를 입력하세요"
          autoFocus
        />
        <LoginInput
          type="password"
          value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="비밀번호를 입력하세요"
        />
        <LoginButton onClick={handleLogin}>
          로그인
        </LoginButton>
      </LoginForm>
    </LoginContainer>
  );
}

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  background: #fff;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.h2`
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
`;

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const LoginInput = styled.input`
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #fee500;
    box-shadow: 0 0 0 2px rgba(254, 229, 0, 0.2);
  }
`;

const LoginButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background: #fee500;
  color: #333;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background: #fdd835;
  }
`;

export default App;