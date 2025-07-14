import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface Message {
  id: string;
  text: string;
  sender: string;
  isOwn: boolean;
}

interface ChatPageProps {
  username: string;
}

function ChatPage({ username }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messageListRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/');
    }
  }, [username, navigate]);

  // 새로운 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: username,
      isOwn: true
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // 샘플 사용자들 (실제로는 서버에서 받아올 데이터)
  const sampleUsers = ['김철수', '이영희', '박민수', '정수진'];

  const addSampleMessage = () => {
    const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    const sampleMessages = [
      '안녕하세요!',
      '오늘 날씨가 좋네요',
      '프로젝트 진행상황은 어떠신가요?',
      '회의 시간 조율해주세요',
      '좋은 아이디어네요!'
    ];
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const newMessage: Message = {
      id: Date.now().toString(),
      text: randomMessage,
      sender: randomUser,
      isOwn: false
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>채팅방</ChatTitle>
        <CurrentUser>현재 사용자: {username}</CurrentUser>
      </ChatHeader>
      <MessageList ref={messageListRef}>
        {messages.length === 0 ? (
          <EmptyMessage>메시지가 없습니다.</EmptyMessage>
        ) : (
          messages.map((msg, idx) => {
            // 연속된 상대방 메시지 중 첫 번째에만 이름 표시
            const prevMsg = messages[idx - 1];
            const showSender = !msg.isOwn && (!prevMsg || prevMsg.sender !== msg.sender || prevMsg.isOwn);
            return (
              <MessageWrapper key={msg.id} isOwn={msg.isOwn}>
                {showSender && <MessageSender>{msg.sender}</MessageSender>}
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
      <SampleButton onClick={addSampleMessage}>
        샘플 메시지 추가
      </SampleButton>
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

const SampleButton = styled.button`
  margin: 0 20px 16px 20px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export default ChatPage; 