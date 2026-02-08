/**
 * Dubai Crab Gateway Client
 * Tauri 앱과 Gateway 간 WebSocket 통신
 */

export interface GatewayConfig {
  url: string;
  token?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface GatewayResponse {
  type: 'message' | 'typing' | 'error' | 'connected' | 'disconnected';
  content?: string;
  error?: string;
}

type MessageHandler = (response: GatewayResponse) => void;

export class GatewayClient {
  private ws: WebSocket | null = null;
  private config: GatewayConfig;
  private messageHandlers: Set<MessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(config: GatewayConfig) {
    this.config = config;
  }

  /**
   * 게이트웨이에 연결
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = this.config.url.replace('http', 'ws');
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[Gateway] Connected');
          this.reconnectAttempts = 0;
          this.notifyHandlers({ type: 'connected' });
          
          // 인증 토큰 전송
          if (this.config.token) {
            this.ws?.send(JSON.stringify({
              type: 'auth',
              token: this.config.token
            }));
          }
          
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (e) {
            console.error('[Gateway] Parse error:', e);
          }
        };

        this.ws.onerror = (error) => {
          console.error('[Gateway] Error:', error);
          this.notifyHandlers({ type: 'error', error: 'Connection error' });
        };

        this.ws.onclose = () => {
          console.log('[Gateway] Disconnected');
          this.notifyHandlers({ type: 'disconnected' });
          this.attemptReconnect();
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 연결 해제
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * 메시지 전송
   */
  sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.notifyHandlers({ type: 'error', error: 'Not connected' });
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'chat',
      content,
      timestamp: Date.now()
    }));
  }

  /**
   * 파일과 함께 메시지 전송
   */
  sendMessageWithFile(content: string, fileContent: string, fileName: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.notifyHandlers({ type: 'error', error: 'Not connected' });
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'chat',
      content,
      file: {
        name: fileName,
        content: fileContent
      },
      timestamp: Date.now()
    }));
  }

  /**
   * 메시지 핸들러 등록
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * 연결 상태 확인
   */
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private handleMessage(data: any): void {
    switch (data.type) {
      case 'response':
        this.notifyHandlers({
          type: 'message',
          content: data.content
        });
        break;

      case 'typing':
        this.notifyHandlers({ type: 'typing' });
        break;

      case 'error':
        this.notifyHandlers({
          type: 'error',
          error: data.message || 'Unknown error'
        });
        break;

      case 'stream':
        // 스트리밍 응답 처리
        this.notifyHandlers({
          type: 'message',
          content: data.chunk
        });
        break;

      default:
        console.log('[Gateway] Unknown message type:', data.type);
    }
  }

  private notifyHandlers(response: GatewayResponse): void {
    this.messageHandlers.forEach(handler => handler(response));
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[Gateway] Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[Gateway] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(console.error);
    }, delay);
  }
}

/**
 * 기본 게이트웨이 클라이언트 인스턴스
 */
let defaultClient: GatewayClient | null = null;

export function getGatewayClient(config?: GatewayConfig): GatewayClient {
  if (!defaultClient && config) {
    defaultClient = new GatewayClient(config);
  }
  if (!defaultClient) {
    // 기본 로컬 게이트웨이
    defaultClient = new GatewayClient({
      url: 'ws://127.0.0.1:18789'
    });
  }
  return defaultClient;
}

/**
 * 게이트웨이 상태 확인
 */
export async function checkGatewayStatus(): Promise<{
  available: boolean;
  url: string;
  error?: string;
}> {
  const url = 'http://127.0.0.1:18789/api/status';
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      return { available: true, url };
    } else {
      return { available: false, url, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    return { 
      available: false, 
      url, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}
