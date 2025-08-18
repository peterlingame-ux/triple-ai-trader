// Audio recorder for capturing microphone input
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  async start() {
    try {
      console.log("Starting audio recorder...");
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      this.audioContext = new AudioContext({
        sampleRate: 24000,
      });
      
      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };
      
      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      console.log("Audio recorder started successfully");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    console.log("Stopping audio recorder...");
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Encode audio for OpenAI API (Float32Array to base64 PCM16)
export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

// Create WAV file from PCM data
const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  // Convert bytes to 16-bit samples (little endian)
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  // Create WAV header
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  // WAV header parameters
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;
  const dataLength = int16Data.byteLength;

  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Sub-chunk 1 size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Combine header and data
  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

// Audio queue for sequential playback
class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    console.log("Adding audio chunk to queue:", audioData.length, "bytes");
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      console.log("Audio queue empty, stopping playback");
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;
    console.log("Playing audio chunk:", audioData.length, "bytes");

    try {
      const wavData = createWavFromPCM(audioData);
      const audioBuffer = await this.audioContext.decodeAudioData(wavData.buffer.slice(0));
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => {
        console.log("Audio chunk finished, playing next...");
        this.playNext();
      };
      
      source.start(0);
    } catch (error) {
      console.error('Error playing audio chunk:', error);
      this.playNext(); // Continue with next segment even if current fails
    }
  }

  clear() {
    console.log("Clearing audio queue");
    this.queue = [];
    this.isPlaying = false;
  }
}

// Global audio queue instance
let audioQueueInstance: AudioQueue | null = null;

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
  }
  await audioQueueInstance.addToQueue(audioData);
};

export const clearAudioQueue = () => {
  if (audioQueueInstance) {
    audioQueueInstance.clear();
  }
};

// Realtime chat class for managing WebSocket connection
export class RealtimeChat {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private recorder: AudioRecorder | null = null;
  private isConnected = false;
  private currentCallId: string | null = null;

  constructor(
    private onMessage: (message: any) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onSpeakingChange: (speaking: boolean) => void
  ) {}

  async init() {
    try {
      console.log("Initializing realtime chat...");
      
      // Initialize audio context
      this.audioContext = new AudioContext({ sampleRate: 24000 });
      
      // Connect to WebSocket relay
      const supabaseUrl = window.location.origin.includes('localhost') 
        ? 'ws://localhost:54321'
        : 'wss://c5b8ad01-acc1-4427-bf64-8b3b15b1e715.supabase.co';
      
      const wsUrl = `${supabaseUrl}/functions/v1/realtime-chat`;
      console.log("Connecting to:", wsUrl);
      
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnected = true;
        this.onConnectionChange(true);
      };
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Received message type:", data.type);
        this.handleMessage(data);
      };
      
      this.ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        this.isConnected = false;
        this.onConnectionChange(false);
      };
      
      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnected = false;
        this.onConnectionChange(false);
      };
      
      // Start recording
      this.recorder = new AudioRecorder((audioData) => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          this.ws.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });
      
      await this.recorder.start();
      console.log("Realtime chat initialized successfully");
      
    } catch (error) {
      console.error("Error initializing realtime chat:", error);
      throw error;
    }
  }

  private async handleMessage(data: any) {
    this.onMessage(data);
    
    switch (data.type) {
      case 'response.audio.delta':
        if (this.audioContext && data.delta) {
          try {
            // Convert base64 to Uint8Array
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await playAudioData(this.audioContext, bytes);
            this.onSpeakingChange(true);
          } catch (error) {
            console.error('Error playing audio delta:', error);
          }
        }
        break;
        
      case 'response.audio.done':
        console.log("AI finished speaking");
        this.onSpeakingChange(false);
        break;
        
      case 'response.function_call_arguments.done':
        console.log("Function call completed:", data);
        this.handleFunctionCall(data);
        break;
        
      default:
        console.log("Unhandled message type:", data.type);
    }
  }

  private async handleFunctionCall(data: any) {
    console.log("Handling function call:", data.call_id, data.arguments);
    
    try {
      const args = JSON.parse(data.arguments);
      let result = "";
      
      if (data.call_id) {
        this.currentCallId = data.call_id;
        
        // Handle different function calls
        if (data.name === 'get_crypto_price') {
          result = `${args.symbol}的当前价格信息已获取。这是一个示例响应，实际应用中会连接真实的API获取价格数据。`;
        }
        
        // Send function response
        const functionResponse = {
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: data.call_id,
            output: result
          }
        };
        
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(functionResponse));
          // Trigger response generation
          this.ws.send(JSON.stringify({ type: 'response.create' }));
        }
      }
    } catch (error) {
      console.error("Error handling function call:", error);
    }
  }

  async sendTextMessage(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    console.log("Sending text message:", text);
    
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text
          }
        ]
      }
    };

    this.ws.send(JSON.stringify(event));
    this.ws.send(JSON.stringify({ type: 'response.create' }));
  }

  disconnect() {
    console.log("Disconnecting realtime chat...");
    this.recorder?.stop();
    this.ws?.close();
    clearAudioQueue();
    this.isConnected = false;
    this.onConnectionChange(false);
  }

  get connected() {
    return this.isConnected;
  }
}