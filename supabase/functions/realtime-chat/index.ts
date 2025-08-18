import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  console.log("WebSocket upgrade requested");
  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error("OPENAI_API_KEY not found");
    return new Response("Server configuration error", { status: 500 });
  }

  // Connect to OpenAI Realtime API
  const openAISocket = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
    ["realtime", `openai-insecure-api-key.${openAIApiKey}`, "openai-beta.realtime-v1"]
  );
  
  let sessionConfigured = false;
  
  openAISocket.onopen = () => {
    console.log("Connected to OpenAI Realtime API");
  };

  openAISocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Received from OpenAI:", data.type);
    
    // Configure session after receiving session.created event
    if (data.type === 'session.created' && !sessionConfigured) {
      console.log("Configuring session...");
      const sessionConfig = {
        event_id: `event_${Date.now()}`,
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: "你是一个专业的加密货币和区块链交易助手。你可以帮助用户分析市场趋势、提供交易建议，并解答关于加密货币的问题。请用中文回答用户的问题，保持专业和友好的语调。",
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: {
            model: "whisper-1"
          },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000
          },
          tools: [
            {
              type: "function",
              name: "get_crypto_price",
              description: "获取加密货币的当前价格和市场信息",
              parameters: {
                type: "object",
                properties: {
                  symbol: { type: "string", description: "加密货币符号，如BTC、ETH等" }
                },
                required: ["symbol"]
              }
            }
          ],
          tool_choice: "auto",
          temperature: 0.8,
          max_response_output_tokens: "inf"
        }
      };
      
      openAISocket.send(JSON.stringify(sessionConfig));
      sessionConfigured = true;
      console.log("Session configuration sent");
    }
    
    // Forward all messages to client
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(event.data);
    }
  };

  openAISocket.onclose = (event) => {
    console.log("OpenAI connection closed:", event.code, event.reason);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(event.code, event.reason);
    }
  };

  openAISocket.onerror = (error) => {
    console.error("OpenAI WebSocket error:", error);
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(1011, "OpenAI connection error");
    }
  };

  socket.onopen = () => {
    console.log("Client connected to relay");
  };

  socket.onmessage = (event) => {
    console.log("Received from client:", typeof event.data);
    
    // Handle tool responses from client
    const data = JSON.parse(event.data);
    if (data.type === 'conversation.item.create' && data.item?.type === 'function_call_output') {
      console.log("Handling function call output:", data);
    }
    
    // Forward client messages to OpenAI
    if (openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.send(event.data);
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected from relay");
    if (openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    if (openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  return response;
});