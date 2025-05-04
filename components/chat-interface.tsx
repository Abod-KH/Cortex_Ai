"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Sparkles, Code, Download, Copy, Check, Play, Pause, Minus, RotateCcw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/spinner"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  code?: string
  language?: string
  files?: {
    name: string
    content: string
    path: string
  }[]
}

export function ChatInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [activeFile, setActiveFile] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Here we would normally call the AI API
      // For now, we'll simulate a more sophisticated response
      setTimeout(() => {
        const prompt = input.toLowerCase()

        // Determine what kind of app or component the user is asking for
        const isTodoApp = prompt.includes("todo") || prompt.includes("task") || prompt.includes("list")
        const isAuthForm =
          prompt.includes("auth") || prompt.includes("login") || prompt.includes("signup") || prompt.includes("sign up")
        const isDashboard = prompt.includes("dashboard") || prompt.includes("admin") || prompt.includes("panel")
        const isEcommerce =
          prompt.includes("ecommerce") ||
          prompt.includes("shop") ||
          prompt.includes("store") ||
          prompt.includes("product")
        const isCounter = prompt.includes("counter") || prompt.includes("increment") || prompt.includes("decrement")

        let responseContent = ""
        let code = ""
        const language = "tsx"
        let files = []

        if (isTodoApp) {
          responseContent = "Here's a complete Todo App component with React and TypeScript:"

          code = `import React, { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>
      
      <form onSubmit={addTodo} className="mb-4 flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>
      
      <div className="flex justify-between mb-4">
        <div className="text-sm text-gray-500">
          {todos.filter((todo) => !todo.completed).length} items left
        </div>
        <div className="flex space-x-2">
          <button
            className={\`px-2 py-1 text-sm rounded \${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }\`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={\`px-2 py-1 text-sm rounded \${
              filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }\`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={\`px-2 py-1 text-sm rounded \${
              filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }\`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>
      
      <ul className="space-y-2 mb-4">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-3 h-5 w-5 text-blue-500"
              />
              <span
                className={\`\${
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }\`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      
      {todos.some((todo) => todo.completed) && (
        <button
          onClick={clearCompleted}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear completed
        </button>
      )}
    </div>
  );
}`

          files = [
            {
              name: "TodoApp.tsx",
              path: "TodoApp.tsx",
              content: code,
            },
            {
              name: "index.tsx",
              path: "index.tsx",
              content: `import React from 'react';
import ReactDOM from 'react-dom';
import TodoApp from './TodoApp';
import './styles.css';

ReactDOM.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-100 py-8">
      <TodoApp />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);`,
            },
            {
              name: "styles.css",
              path: "styles.css",
              content: `@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

body {
  font-family: 'Inter', sans-serif;
}`,
            },
          ]
        } else if (isAuthForm) {
          responseContent = "Here's a complete authentication form with login and signup functionality:"

          code = `import React, { useState } from 'react';

type FormMode = 'login' | 'signup' | 'forgot-password';

interface AuthFormProps {
  onSubmit: (data: any) => void;
  onSuccess?: () => void;
}

export default function AuthForm({ onSubmit, onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<FormMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (mode === 'signup' && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const data = {
        email,
        password,
        name: mode === 'signup' ? name : undefined,
      };
      
      onSubmit(data);
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'login'
              ? 'Sign in to access your account'
              : mode === 'signup'
              ? 'Create a new account'
              : 'Enter your email to reset your password'}
          </p>
        </div>
        
        {success && mode === 'forgot-password' ? (
          <div className="bg-green-50 p-4 rounded-md mb-6">
            <p className="text-green-800">
              If an account exists with that email, you will receive a password reset link.
            </p>
            <button
              onClick={() => {
                setMode('login');
                setSuccess(false);
              }}
              className="mt-2 text-sm text-green-700 hover:underline"
            >
              Return to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === 'signup'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {mode !== 'forgot-password' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={mode !== 'forgot-password'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={mode === 'signup'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Submitting...'}
                </span>
              ) : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </button>
            
            <div className="flex justify-between text-sm">
              {mode === 'login' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('forgot-password')}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:underline"
                  >
                    Create account
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-600 hover:underline"
                >
                  Back to login
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}`

          files = [
            {
              name: "AuthForm.tsx",
              path: "AuthForm.tsx",
              content: code,
            },
            {
              name: "index.tsx",
              path: "index.tsx",
              content: `import React from 'react';
import ReactDOM from 'react-dom';
import AuthForm from './AuthForm';
import './styles.css';

function App() {
  const handleSubmit = (data: any) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AuthForm onSubmit={handleSubmit} />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`,
            },
          ]
        } else if (isCounter) {
          responseContent = "Here's an enhanced counter component with additional features:"

          code = `import React, { useState, useEffect } from 'react';
import { Plus, Minus, RotateCcw, Clock, Save } from 'lucide-react';

interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export default function Counter({
  initialValue = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  onChange,
}: CounterProps) {
  const [count, setCount] = useState<number>(initialValue);
  const [history, setHistory] = useState<number[]>([initialValue]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [autoIncrement, setAutoIncrement] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Call onChange when count changes
    onChange?.(count);
  }, [count, onChange]);

  useEffect(() => {
    // Clean up interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const increment = () => {
    setCount((prevCount) => {
      const newCount = Math.min(prevCount + step, max);
      if (newCount !== prevCount) {
        addToHistory(newCount);
      }
      return newCount;
    });
  };

  const decrement = () => {
    setCount((prevCount) => {
      const newCount = Math.max(prevCount - step, min);
      if (newCount !== prevCount) {
        addToHistory(newCount);
      }
      return newCount;
    });
  };

  const reset = () => {
    setCount(initialValue);
    addToHistory(initialValue);
  };

  const addToHistory = (newCount: number) => {
    // Add to history and trim any "future" history if we've gone back
    const newHistory = [...history.slice(0, historyIndex + 1), newCount];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCount(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCount(history[historyIndex + 1]);
    }
  };

  const toggleAutoIncrement = () => {
    if (autoIncrement) {
      // Stop auto-increment
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setAutoIncrement(false);
    } else {
      // Start auto-increment
      const id = setInterval(() => {
        setCount((prevCount) => {
          const newCount = Math.min(prevCount + step, max);
          if (newCount !== prevCount) {
            addToHistory(newCount);
          }
          return newCount;
        });
      }, 1000);
      setIntervalId(id);
      setAutoIncrement(true);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('counter-value', count.toString());
    alert('Counter value saved!');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Enhanced Counter</h2>
        <div className="text-5xl font-bold mb-4">{count}</div>
        
        {/* Main counter controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={decrement}
            disabled={count <= min}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={20} />
          </button>
          <button
            onClick={reset}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white hover:bg-gray-600"
          >
            <RotateCcw size={20} />
          </button>
          <button
            onClick={increment}
            disabled={count >= max}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
        
        {/* History controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Redo
          </button>
        </div>
        
        {/* Additional features */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleAutoIncrement}
            className={\`px-4 py-2 rounded flex items-center \${
              autoIncrement ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white\`}
          >
            <Clock size={16} className="mr-2" />
            {autoIncrement ? 'Stop Auto' : 'Auto Increment'}
          </button>
          <button
            onClick={saveToLocalStorage}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Save
          </button>
        </div>
      </div>
      
      {/* Counter info */}
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Min Value:</div>
          <div className="text-right font-medium">{min}</div>
          <div>Max Value:</div>
          <div className="text-right font-medium">{max}</div>
          <div>Step Size:</div>
          <div className="text-right font-medium">{step}</div>
          <div>History States:</div>
          <div className="text-right font-medium">{history.length}</div>
        </div>
      </div>
    </div>
  );
}`

          files = [
            {
              name: "Counter.tsx",
              path: "Counter.tsx",
              content: code,
            },
            {
              name: "index.tsx",
              path: "index.tsx",
              content: `import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';
import './styles.css';

function App() {
  const [counterValue, setCounterValue] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Counter 
          initialValue={0}
          min={-10}
          max={10}
          step={1}
          onChange={setCounterValue}
        />
        <div className="mt-4 text-center text-gray-600">
          Current value: {counterValue}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`,
            },
          ]
        } else {
          // Default response for other requests
          responseContent = "Here's a React component based on your request:"

          code = `import React, { useState, useEffect } from 'react';

export default function Component() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData = [
          { id: 1, title: 'Item 1', description: 'Description for item 1' },
          { id: 2, title: 'Item 2', description: 'Description for item 2' },
          { id: 3, title: 'Item 3', description: 'Description for item 3' },
        ];
        
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Data List</h2>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="border-b pb-4">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}`

          files = [
            {
              name: "Component.tsx",
              path: "Component.tsx",
              content: code,
            },
          ]
        }

        // Add AI response
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: responseContent,
          code: code || undefined,
          language: language || undefined,
          files: files.length > 0 ? files : undefined,
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsLoading(false)

        // If files were generated, set the active file to the first one
        if (files.length > 0) {
          setActiveFile(files[0].name)
          setActiveTab("code")
        }
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Get current file content
  const getCurrentFile = () => {
    const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant" && msg.files)

    if (!lastAssistantMessage || !lastAssistantMessage.files) return ""

    const file = lastAssistantMessage.files.find((f) => f.name === activeFile)
    return file ? file.content : ""
  }

  // Get file list
  const getFileList = () => {
    const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant" && msg.files)

    if (!lastAssistantMessage || !lastAssistantMessage.files) return []

    return lastAssistantMessage.files
  }

  const fileList = getFileList()
  const currentFileContent = getCurrentFile()

  // Check if the current component is one of the generated ones
  const isTodoAppGenerated = fileList.some((file) => file.name === "TodoApp.tsx")
  const isAuthFormGenerated = fileList.some((file) => file.name === "AuthForm.tsx")
  const isCounterGenerated = fileList.some((file) => file.name === "Counter.tsx")

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Panel - Chat */}
      <div className="w-1/2 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b border-gray-200 dark:border-gray-800">
            <TabsList className="w-full justify-start h-12 px-4">
              <TabsTrigger value="chat" className="data-[state=active]:bg-background">
                Chat
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-background">
                Code
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Sparkles className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to Cortex AI</h2>
                  <p className="text-muted-foreground max-w-md">
                    Describe what you want to build, and I'll help you generate the code. You can ask for specific
                    components, features, or entire applications.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 mb-4 p-4 rounded-lg ${message.role === "user" ? "bg-muted/50" : "bg-background"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                    >
                      {message.role === "user" ? "U" : "AI"}
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="text-sm font-medium mb-1">{message.role === "user" ? "You" : "Cortex AI"}</div>
                      <div className="text-sm">{message.content}</div>
                      {message.code && (
                        <div className="mt-3 relative">
                          <div className="bg-muted rounded-md p-3 overflow-x-auto">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs text-muted-foreground">{message.language || "code"}</div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleCopy(message.code!)}
                                >
                                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                </Button>
                                {message.code && message.language && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setActiveTab("code")}
                                  >
                                    <Code className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <pre className="text-xs">
                              <code>{message.code}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Cortex AI to generate code or build an app..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      if (input.trim()) {
                        handleSubmit(e as any)
                      }
                    }
                  }}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} className="self-end">
                  {isLoading ? <Spinner /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 flex flex-col p-0 m-0">
            {fileList.length > 0 ? (
              <div className="flex flex-col h-full">
                <div className="flex border-b border-gray-200 dark:border-gray-800">
                  {fileList.map((file) => (
                    <button
                      key={file.name}
                      className={`px-4 py-2 text-sm ${activeFile === file.name ? "bg-muted font-medium" : "hover:bg-muted/50"}`}
                      onClick={() => setActiveFile(file.name)}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-800">
                    <span className="text-sm text-muted-foreground">{activeFile}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(currentFileContent)}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsRunning(!isRunning)}>
                        {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                        {isRunning ? "Stop" : "Run"}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <pre className="p-4 text-sm overflow-auto">
                    <code>{currentFileContent}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center p-4">
                <div>
                  <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No code generated yet</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Ask Cortex AI to generate code for you. You can request components, features, or entire
                    applications.
                  </p>
                  <Button onClick={() => setActiveTab("chat")}>Go to Chat</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel - Preview */}
      <div className="w-1/2 flex flex-col">
        <div className="border-b border-gray-200 dark:border-gray-800 p-3 flex justify-between items-center">
          <h3 className="font-medium">Preview</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button size="sm">Deploy</Button>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 overflow-auto">
          {isRunning && fileList.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex items-center justify-center">
              <div className="w-full max-w-md p-4">
                {/* This would be a real preview in a production app */}
                {isCounterGenerated && (
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2">Enhanced Counter</h2>
                      <div className="text-5xl font-bold mb-4">0</div>
                      <div className="flex justify-center space-x-4 mb-6">
                        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white">
                          <Minus size={20} />
                        </button>
                        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-500 text-white">
                          <RotateCcw size={20} />
                        </button>
                        <button className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isTodoAppGenerated && (
                  <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>
                    <div className="mb-4 flex">
                      <input
                        type="text"
                        placeholder="What needs to be done?"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
                      />
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-r-md">Add</button>
                    </div>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-3 h-5 w-5 text-blue-500" />
                          <span>Example todo item</span>
                        </div>
                        <button className="text-red-500">Delete</button>
                      </li>
                    </ul>
                  </div>
                )}

                {isAuthFormGenerated && (
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">Sign In</h2>
                        <p className="text-gray-600 mt-1">Sign in to access your account</p>
                      </div>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                          <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                        <button type="button" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md">
                          Sign In
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {!isCounterGenerated && !isTodoAppGenerated && !isAuthFormGenerated && (
                  <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Preview</h2>
                    <p className="text-gray-600">
                      This is a preview of your generated code. In a real application, this would render the actual
                      component.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  {fileList.length > 0
                    ? "Click the Run button to see a preview of your code."
                    : "Generate some code first, then run it to see a preview."}
                </p>
                {fileList.length > 0 && <Button onClick={() => setIsRunning(true)}>Run Code</Button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
