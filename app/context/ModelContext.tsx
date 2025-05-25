import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface Model {
  id: string;
  name: string;
  image: any;
  desc: string;
  isDownloaded?: boolean;
  downloadProgress?: number;
  downloadUrl?: string;
}

interface ModelContextType {
  models: Model[];
  downloadModel: (modelId: string) => Promise<void>;
  isDownloading: boolean;
  loading: boolean;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

const initialModels: Model[] = [
  {
    id: '1',
    name: 'TinyLlama-3.2 3B',
    image: require('../../assets/images/tiny_llama.png'),
    desc: "Meta AI's most performant LLM.",
    downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q6_K.gguf',
  },
  {
    id: '2',
    name: 'Gemma-2 2B',
    image: require('../../assets/images/gemma.png'),
    desc: 'Gemma is a family of lightweight open models from Google.',
    downloadUrl: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q6_K.gguf',
  },
  {
    id: '3',
    name: 'Qwen-2.5 1.5B',
    image: require('../../assets/images/qwen.png'),
    desc: 'A language model series including decoder language models of different model sizes',
    downloadUrl: 'https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q8_0.gguf',
  },
  {
    id: '4',
    name: 'Phi-3.5 Mini 3.8B',
    image: require('../../assets/images/msft.png'),
    desc: "Microsoft's smaller, less compute-intensive models for generative AI solutions",
    downloadUrl: 'https://huggingface.co/MaziyarPanahi/Phi-3.5-mini-instruct-GGUF/resolve/main/Phi-3.5-mini-instruct.Q4_K_M.gguf',
},
  {
    id: '5',
    name: 'Claude-3 Opus',
    image: require('../../assets/images/claude.png'),
    desc: 'Designed to be fast, tiny, helpful, honest, and harmless.',
  },
];

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [models, setModels] = useState<Model[]>(initialModels);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load download state from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('downloadedModels');
      let downloadState: Record<string, any> = stored ? JSON.parse(stored) : {};
      setModels(prevModels => prevModels.map(m => {
        const state = downloadState[m.id];
        return state
          ? { ...m, isDownloaded: state.isDownloaded, downloadProgress: state.downloadProgress }
          : { ...m, isDownloaded: false, downloadProgress: 0 };
      }));
      setLoading(false);
    })();
  }, []);

  const saveDownloadState = async (modelId: string, state: any) => {
    const stored = await AsyncStorage.getItem('downloadedModels');
    let downloadState: Record<string, any> = stored ? JSON.parse(stored) : {};
    downloadState[modelId] = { ...downloadState[modelId], ...state };
    await AsyncStorage.setItem('downloadedModels', JSON.stringify(downloadState));
  };

  const downloadModel = useCallback(async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model || !model.downloadUrl) return;

    setIsDownloading(true);
    try {
      const fileUri = FileSystem.documentDirectory + model.name + '.gguf';
      const downloadResumable = FileSystem.createDownloadResumable(
        model.downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          setModels(prevModels => 
            prevModels.map(m => 
              m.id === modelId 
                ? { ...m, downloadProgress: progress }
                : m
            )
          );
          saveDownloadState(modelId, { downloadProgress: progress });
        }
      );

      await downloadResumable.downloadAsync();
      setModels(prevModels =>
        prevModels.map(m =>
          m.id === modelId
            ? { ...m, isDownloaded: true, downloadProgress: 1 }
            : m
        )
      );
      await saveDownloadState(modelId, { isDownloaded: true, downloadProgress: 1 });
    } catch (error) {
      console.error('Error downloading model:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [models]);

  if (loading) {
    return <></>; // Or a loading spinner if you prefer
  }

  return (
    <ModelContext.Provider value={{ models, downloadModel, isDownloading, loading }}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModel() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}

export default ModelProvider; 