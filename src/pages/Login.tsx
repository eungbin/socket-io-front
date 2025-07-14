import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function LoginPage() {
  const [idInput, setIdInput] = useState('');
  const [pwInput, setPwInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (idInput.trim() === '' || pwInput.trim() === '') {
      setError('아이디와 비밀번호를 모두 입력하세요.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: idInput, password: pwInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('userId', data.user.id);
        sessionStorage.setItem('userName', data.user.name);
        navigate('/chat');
      } else {
        setError(data.error || '로그인에 실패했습니다.');
      }
    } catch {
      setError('서버와의 통신에 실패했습니다.');
    }
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
        {error && <ErrorMsg>{error}</ErrorMsg>}
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

const ErrorMsg = styled.div`
  color: #e74c3c;
  margin-top: 8px;
  font-size: 14px;
`;

export default LoginPage; 