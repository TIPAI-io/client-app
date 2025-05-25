import * as FileSystem from 'expo-file-system';
import { initLlama } from 'llama.rn';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

function formatQwenPrompt(messages: Message[]) {
  // Qwen-style prompt formatting
  let prompt = '<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n';
  messages.forEach(msg => {
    if (msg.role === 'user') {
      prompt += `<|im_start|>user\n${msg.text}<|im_end|>\n`;
    } else {
      prompt += `<|im_start|>assistant\n${msg.text}<|im_end|>\n`;
    }
  });
  prompt += '<|im_start|>assistant\n';
  return prompt;
}

// Mock model response (replace with real inference)
async function getModelResponse(prompt: string, model: any): Promise<string> {
  // Simulate a delay and return a canned response
  await new Promise(res => setTimeout(res, 1200));
  if (model.name.toLowerCase().includes('qwen')) {
    return "[Qwen] This is a mock response to: " + prompt.split('<|im_start|>user\n').pop()?.split('<|im_end|>')[0];
  }
  return "[Model] This is a mock response to: " + prompt.split('<|im_start|>user\n').pop()?.split('<|im_end|>')[0];
}

export default function Chat({ model, onClose }: { model: any, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const llamaContextRef = useRef<any>(null);

  // Initialize llama model
  useEffect(() => {
    const initModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the model file path
        const modelPath = FileSystem.documentDirectory + model.name + '.gguf';
        
        // Initialize llama context
        const context = await initLlama({
          model: modelPath,
          n_ctx: 2048,
          n_gpu_layers: 99, // Use GPU layers for better performance
        });
        
        llamaContextRef.current = context;
        setLoading(false);
      } catch (err) {
        console.error('Error initializing model:', err);
        setError('Failed to load model. Please try again.');
        setLoading(false);
      }
    };

    initModel();

    // Cleanup
    return () => {
      if (llamaContextRef.current) {
        llamaContextRef.current.free();
      }
    };
  }, [model]);

  const handleSend = async () => {
    if (!input.trim() || sending || !llamaContextRef.current) return;
    
    const userMsg: Message = { id: Date.now() + '-user', role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);

    try {
      // Format prompt for the model
      const prompt = formatQwenPrompt([...messages, userMsg]);
      
      // Get model response
      const { text } = await llamaContextRef.current.completion({
        prompt,
        n_predict: 100,
        stop: ['<|im_end|>', '<|im_start|>'],
      });

      const assistantMsg: Message = { 
        id: Date.now() + '-assistant', 
        role: 'assistant', 
        text: text.trim() 
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error getting model response:', err);
      setError('Failed to get response. Please try again.');
    } finally {
      setSending(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
      <Text style={styles.bubbleText}>{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7d3cff" />
        <Text style={styles.loadingText}>Loading model...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onClose}>
          <Text style={styles.retryButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff', marginBottom: 50 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat with {model.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          editable={!sending}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} disabled={sending || !input.trim()}>
          <Text style={[styles.sendBtnText, (sending || !input.trim()) && { opacity: 0.5 }]}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#faf8ff',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#7d3cff',
  },
  closeBtn: {
    backgroundColor: '#e2c3ff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  closeBtnText: {
    color: '#7d3cff',
    fontWeight: 'bold',
  },
  messagesContainer: {
    padding: 16,
    marginBottom: 50,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#e2c3ff',
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    backgroundColor: '#faf8ff',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 16,
    color: '#222',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: '#faf8ff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2c3ff',
  },
  sendBtn: {
    backgroundColor: '#7d3cff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7d3cff',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7d3cff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 