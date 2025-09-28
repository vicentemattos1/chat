import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChatSidebar } from './ChatSidebar';
import { ChatMain } from './ChatMain';
import { useNavigate, useParams } from 'react-router';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const ChatInterface = () => {
  const { id } = useParams();
  const activeChat = id ?? ''
  const navigate = useNavigate()
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Getting Started with React',
      messages: [
        {
          id: '1',
          content: 'Hi! Can you help me understand React components?',
          role: 'user',
          timestamp: new Date('2024-01-15T10:30:00'),
        },
        {
          id: '2',
          content: "I'd be happy to help you understand React components! React components are the building blocks of React applications. They're JavaScript functions or classes that return JSX (JavaScript XML) to describe what should appear on the screen.\n\nHere are the key concepts:\n\n**Function Components** (most common):\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```\n\n**Key features:**\n- **Reusable**: Write once, use anywhere\n- **Composable**: Combine simple components to build complex UIs\n- **Props**: Pass data from parent to child components\n- **State**: Manage component's internal data\n\nWould you like me to explain any of these concepts in more detail?",
          role: 'assistant',
          timestamp: new Date('2024-01-15T10:30:30'),
        },
      ],
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T10:30:30'),
    },
    {
      id: '2',
      title: 'TypeScript Best Practices',
      messages: [
        {
          id: '3',
          content: 'What are some TypeScript best practices for React development?',
          role: 'user',
          timestamp: new Date('2024-01-14T15:20:00'),
        },
        {
          id: '4',
          content: "Great question! Here are some essential TypeScript best practices for React development:\n\n**1. Component Props Typing**\n```tsx\ninterface Props {\n  title: string;\n  count?: number; // optional\n  onClick: () => void;\n}\n\nconst MyComponent: React.FC<Props> = ({ title, count = 0, onClick }) => {\n  return <button onClick={onClick}>{title}: {count}</button>;\n};\n```\n\n**2. Use Proper Event Types**\n```tsx\nconst handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {\n  e.preventDefault();\n};\n```\n\n**3. State Typing**\n```tsx\nconst [user, setUser] = useState<User | null>(null);\n```\n\n**4. Custom Hooks**\n```tsx\nconst useCounter = (initial: number = 0) => {\n  const [count, setCount] = useState(initial);\n  return { count, increment: () => setCount(c => c + 1) };\n};\n```\n\nThese practices help catch bugs early and improve code maintainability!",
          role: 'assistant',
          timestamp: new Date('2024-01-14T15:21:15'),
        },
      ],
      createdAt: new Date('2024-01-14T15:20:00'),
      updatedAt: new Date('2024-01-14T15:21:15'),
    },
    {
      id: '3',
      title: 'CSS Animations and Transitions',
      messages: [
        {
          id: '5',
          content: 'How do I create smooth animations in CSS?',
          role: 'user',
          timestamp: new Date('2024-01-13T09:15:00'),
        },
      ],
      createdAt: new Date('2024-01-13T09:15:00'),
      updatedAt: new Date('2024-01-13T09:15:00'),
    },
  ]);

  const getCurrentChat = () => chats.find(chat => chat.id === activeChat);

  const addMessage = (content: string) => {
    if (!activeChat || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setChats(prev => prev.map(chat => 
      chat.id === activeChat 
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: new Date(),
          }
        : chat
    ));

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. This is a simulated response - in a real application, this would connect to an AI service like OpenAI's GPT API to provide intelligent responses based on your input.",
        role: 'assistant',
        timestamp: new Date(),
      };

      setChats(prev => prev.map(chat => 
        chat.id === activeChat 
          ? {
              ...chat,
              messages: [...chat.messages, aiResponse],
              updatedAt: new Date(),
            }
          : chat
      ));
    }, 1000);
  };

  const createNewChat = () => {
    navigate('/')
  };

  const handleChangeChat = (id: string)=>{
    navigate(`/${id}`)
  }

  return (
    <div className="flex h-screen w-full bg-chat-main">
      <SidebarProvider defaultOpen={true}>
        <div className="flex h-full w-screen">
          <ChatSidebar 
            chats={chats}
            activeChat={activeChat}
            onChatSelect={handleChangeChat}
            onNewChat={createNewChat}
          />

          <ChatMain 
            chat={getCurrentChat()}
            onSendMessage={addMessage}
          />
        </div>
      </SidebarProvider>
    </div>
  );
};