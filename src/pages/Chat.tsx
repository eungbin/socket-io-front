import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { io, Socket } from 'socket.io-client';

interface Sender {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  sender: Sender;
  isOwn: boolean;
}

// 소켓 서버 주소를 실제 환경에 맞게 수정하세요
const SOCKET_SERVER_URL = 'http://localhost:3001';

function ChatPage() {
  const userId = sessionStorage.getItem('userId') || '';
  const userName = sessionStorage.getItem('userName') || '';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !userName) {
      navigate('/');
    }
  }, [userId, userName, navigate]);

  useEffect(() => {
    // 소켓 연결
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: { userId, userName },
    });
    socketRef.current = socket;

    // 서버로부터 메시지 수신
    socket.on('receive_message', (data: { id: string; text: string; sender: Sender }) => {
      setMessages(prev => [
        ...prev,
        {
          id: data.id,
          text: data.text,
          sender: data.sender,
          isOwn: data.sender.id === userId,
        },
      ]);
    });

    // (선택) 서버에서 이전 메시지 목록을 받을 경우
    socket.on('chat_history', (history: { id: string; text: string; sender: Sender }[]) => {
      setMessages(
        history.map(msg => ({
          ...msg,
          isOwn: msg.sender.id === userId,
        }))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, userName]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '' || !socketRef.current) return;
    const msgData = {
      id: Date.now().toString(),
      text: input,
      sender: {
        id: userId,
        name: userName,
      },
    };
    // 서버로 메시지 전송
    socketRef.current.emit('send_message', msgData);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>채팅방</ChatTitle>
        <CurrentUser>현재 사용자: {userName} ({userId})</CurrentUser>
      </ChatHeader>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyMessage>메시지가 없습니다.</EmptyMessage>
        ) : (
          messages.map((msg, idx) => {
            const prevMsg = messages[idx - 1];
            const showSender = !msg.isOwn && (!prevMsg || prevMsg.sender.id !== msg.sender.id || prevMsg.isOwn);
            return (
              <MessageWrapper key={msg.id} isOwn={msg.isOwn}>
                {showSender && <MessageSender>{msg.sender.name}</MessageSender>}
                <MessageItem isOwn={msg.isOwn}>
                  <MessageText>{msg.text}</MessageText>
                </MessageItem>
              </MessageWrapper>
            )
          })
        )}
      </MessageList>
      <InputRow>
        <ChatInput
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <SendButton onClick={handleSend}>
          전송
        </SendButton>
      </InputRow>
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  max-width: 400px;
  height: 600px;
  margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fee500;
  border-bottom: 1px solid #e0e0e0;
`;

const ChatTitle = styled.h2`
  margin: 0;
  color: #333;
  font-weight: 600;
  font-size: 18px;
`;

const CurrentUser = styled.div`
  font-size: 12px;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
  padding: 16px;
`;

const EmptyMessage = styled.div`
  color: #999;
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;
`;

const MessageWrapper = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  margin: 8px 0;
`;

const MessageItem = styled.div<{ isOwn: boolean }>`
  max-width: 70%;
  padding: 12px 16px;
  background: ${props => props.isOwn ? '#fee500' : '#fff'};
  color: #333;
  border-radius: 10px;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  
  ${props => !props.isOwn && `
    border: 1px solid #e0e0e0;
  `}
`;

const MessageSender = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #666;
  text-align: left;
`;

const MessageText = styled.div`
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
  text-align: left;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  outline: none;
  font-size: 15px;
  
  &:focus {
    border-color: #fee500;
  }
`;

const SendButton = styled.button`
  padding: 12px 20px;
  border-radius: 20px;
  border: none;
  background: #fee500;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #fdd835;
  }
  
  &:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
  }
`;

export default ChatPage; 