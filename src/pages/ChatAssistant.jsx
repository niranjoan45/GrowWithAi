import React, { useState, useRef, useEffect } from 'react';
import { useAppData } from '../context/AppDataContext';
import { MessageCircle, Send, User, Bot, Loader2 } from 'lucide-react';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const { user } = useAppData();
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${user?.name.split(' ')[0] || 'there'}! I'm your LittleMilestones AI assistant. How can I help you with your child's development today?`, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      let botResponse = "That's a great question! Every child develops at their own pace. Continuing to encourage and play with them is the best approach. If you have specific concerns, consulting your pediatrician is always recommended.";
      
      if (userMsg.text.toLowerCase().includes('sleep')) {
        botResponse = "At 24 months, most toddlers need about 11-14 hours of sleep in a 24-hour period, including a single nap of 1-3 hours. A consistent bedtime routine is key!";
      } else if (userMsg.text.toLowerCase().includes('talk') || userMsg.text.toLowerCase().includes('word')) {
        botResponse = "By two years old, toddlers can typically say around 50 words and put two words together. Reading books and narrating your day greatly helps language development.";
      } else if (userMsg.text.toLowerCase().includes('eat') || userMsg.text.toLowerCase().includes('food')) {
        botResponse = "Picky eating is very common in toddlers. Keep offering a variety of healthy foods without pressure. They may need to see a food 10-15 times before trying it!";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in chat-container">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle size={28} className="text-primary" />
        <div>
          <h1 className="text-2xl font-bold m-0">AI Chat Advisor</h1>
          <p className="text-muted text-sm m-0">Ask questions about parenting and milestones.</p>
        </div>
      </div>

      <div className="card chat-card flex flex-col">
        <div className="chat-messages flex-1 py-6 px-4 flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-chat ${msg.isBot ? 'self-start' : 'self-end flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isBot ? 'bg-primary-light text-primary' : 'bg-secondary-light text-secondary'}`}>
                {msg.isBot ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm ${msg.isBot ? 'bg-gray-100 text-text-main rounded-tl-none' : 'bg-primary text-white rounded-tr-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3 max-w-chat self-start">
              <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-gray-100 text-text-main rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-muted" />
                <span className="text-xs text-muted">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white m-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              className="w-full pr-12 rounded-full shadow-sm"
              placeholder="Ask anything about your child's development..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ padding: '1rem', paddingRight: '3.5rem' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-full transition-all ${input.trim() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
              style={{ border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
