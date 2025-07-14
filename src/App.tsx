import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChatPage from './pages/Chat';
import styled from 'styled-components';
import './App.css'

function App() {
  const [username, setUsername] = useState('');
  return (
    <Routes>
      <Route path="/" element={<EnterPage setUsername={setUsername} />} />
      <Route path="/chat" element={<ChatPage username={username} />} />
    </Routes>
  );
}

// 채팅방 입장 전 페이지
function EnterPage({ setUsername }: { setUsername: (name: string) => void }) {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSetUsername = () => {
    if (input.trim() === '') return;
    setUsername(input);
    navigate('/chat');
  };

  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSetUsername();
    }
  };

  return (
    <UsernameContainer>
      <UsernameTitle>채팅방 입장</UsernameTitle>
      <UsernameForm>
        <UsernameInput
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleUsernameKeyDown}
          placeholder="사용자 이름을 입력하세요"
          autoFocus
        />
        <EnterButton onClick={handleSetUsername}>
          입장하기
        </EnterButton>
      </UsernameForm>
    </UsernameContainer>
  );
}

const UsernameContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 32px;
  background: #fff;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const UsernameTitle = styled.h2`
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
`;

const UsernameForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const UsernameInput = styled.input`
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

const EnterButton = styled.button`
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