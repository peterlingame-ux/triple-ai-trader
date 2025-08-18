import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { Mic, MicOff, MessageSquare, Send, Phone, PhoneOff, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
  className?: string;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onSpeakingChange,
  className = ""
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const chatRef = useRef<RealtimeChat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = useCallback((type: 'user' | 'assistant' | 'system', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const handleMessage = useCallback((data: any) => {
    console.log('Voice interface received:', data.type);
    
    switch (data.type) {
      case 'session.created':
        addMessage('system', 'AI语音助手已连接，可以开始对话了！');
        break;
        
      case 'input_audio_buffer.speech_started':
        setIsListening(true);
        setCurrentTranscript('');
        break;
        
      case 'input_audio_buffer.speech_stopped':
        setIsListening(false);
        break;
        
      case 'conversation.item.input_audio_transcription.completed':
        if (data.transcript) {
          addMessage('user', data.transcript);
          setCurrentTranscript('');
        }
        break;
        
      case 'response.audio_transcript.delta':
        if (data.delta) {
          setCurrentTranscript(prev => prev + data.delta);
        }
        break;
        
      case 'response.audio_transcript.done':
        if (currentTranscript) {
          addMessage('assistant', currentTranscript);
          setCurrentTranscript('');
        }
        break;
        
      case 'response.done':
        console.log('Response completed');
        break;
    }
  }, [addMessage, currentTranscript]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      setIsSpeaking(false);
      setIsListening(false);
      setCurrentTranscript('');
    }
  }, []);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
    onSpeakingChange?.(speaking);
  }, [onSpeakingChange]);

  const startConversation = async () => {
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      chatRef.current = new RealtimeChat(
        handleMessage,
        handleConnectionChange, 
        handleSpeakingChange
      );
      
      await chatRef.current.init();
      
      toast({
        title: "语音连接成功",
        description: "AI语音助手已准备就绪，可以开始对话",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "连接失败",
        description: error instanceof Error ? error.message : '无法启动语音对话',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    setMessages([]);
    toast({
      title: "已断开连接",
      description: "语音对话已结束",
    });
  };

  const sendTextMessage = async () => {
    if (!textInput.trim() || !chatRef.current?.connected) return;
    
    try {
      await chatRef.current.sendTextMessage(textInput);
      addMessage('user', textInput);
      setTextInput('');
    } catch (error) {
      console.error('Error sending text message:', error);
      toast({
        title: "发送失败",
        description: "无法发送消息，请检查连接",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return (
    <Card className={`bg-card/90 backdrop-blur-sm border-border/50 ${className}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">AI语音助手</h3>
              <p className="text-sm text-muted-foreground">
                专业加密货币交易顾问
              </p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                {isSpeaking && (
                  <Badge variant="default" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
                    <Volume2 className="w-3 h-3 mr-1" />
                    AI说话中
                  </Badge>
                )}
                {isListening && (
                  <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/20">
                    <Mic className="w-3 h-3 mr-1 animate-pulse" />
                    正在聆听
                  </Badge>
                )}
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  已连接
                </Badge>
              </>
            )}
          </div>
        </div>

        {/* Connection Controls */}
        <div className="flex gap-2 mb-4">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Phone className="w-4 h-4 mr-2" />
              开始语音对话
            </Button>
          ) : (
            <Button 
              onClick={endConversation}
              variant="destructive"
              className="flex-1"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              结束对话
            </Button>
          )}
        </div>

        {/* Messages Area */}
        {messages.length > 0 && (
          <div className="border rounded-lg p-4 max-h-64 overflow-y-auto mb-4 bg-background/50">
            {messages.map((message) => (
              <div key={message.id} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'assistant'
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Current Transcript */}
            {currentTranscript && (
              <div className="text-left mb-3">
                <div className="inline-block max-w-[80%] p-3 rounded-lg bg-secondary/50 text-secondary-foreground border-2 border-dashed border-secondary">
                  <p className="text-sm">{currentTranscript}</p>
                  <p className="text-xs opacity-70 mt-1">AI正在回复...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Text Input */}
        {isConnected && (
          <div className="flex gap-2">
            <Input
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="或者输入文字消息..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              onClick={sendTextMessage}
              disabled={!textInput.trim() || !isConnected}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Instructions */}
        {!isConnected && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              点击"开始语音对话"连接AI助手，然后可以直接语音交流或发送文字消息
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceInterface;