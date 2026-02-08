/**
 * Gateway Store
 * 게이트웨이 연결 상태 및 설정 관리
 */

import { writable, derived, get } from 'svelte/store';
import { getGatewayClient, checkGatewayStatus, type GatewayResponse } from '$lib/gateway-client';

export type ConnectionMode = 'ollama' | 'gateway';

interface GatewayState {
  mode: ConnectionMode;
  gatewayUrl: string;
  gatewayToken: string;
  isConnected: boolean;
  lastError: string | null;
}

// 기본 상태
const initialState: GatewayState = {
  mode: 'ollama',  // 기본은 Ollama
  gatewayUrl: 'ws://127.0.0.1:18789',
  gatewayToken: '',
  isConnected: false,
  lastError: null
};

// Store 생성
function createGatewayStore() {
  const { subscribe, set, update } = writable<GatewayState>(initialState);

  return {
    subscribe,

    // 모드 전환
    setMode(mode: ConnectionMode) {
      update(state => ({ ...state, mode }));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dubaicrab-mode', mode);
      }
    },

    // 게이트웨이 URL 설정
    setGatewayUrl(url: string) {
      update(state => ({ ...state, gatewayUrl: url }));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dubaicrab-gateway-url', url);
      }
    },

    // 토큰 설정
    setGatewayToken(token: string) {
      update(state => ({ ...state, gatewayToken: token }));
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('dubaicrab-gateway-token', token);
      }
    },

    // 연결 상태 업데이트
    setConnected(isConnected: boolean, error?: string) {
      update(state => ({
        ...state,
        isConnected,
        lastError: error || null
      }));
    },

    // 저장된 설정 로드
    loadSavedSettings() {
      if (typeof localStorage === 'undefined') return;

      const savedMode = localStorage.getItem('dubaicrab-mode') as ConnectionMode | null;
      const savedUrl = localStorage.getItem('dubaicrab-gateway-url');
      const savedToken = localStorage.getItem('dubaicrab-gateway-token');

      update(state => ({
        ...state,
        mode: savedMode || state.mode,
        gatewayUrl: savedUrl || state.gatewayUrl,
        gatewayToken: savedToken || state.gatewayToken
      }));
    },

    // 게이트웨이 연결 시도
    async connectGateway(): Promise<boolean> {
      const state = get({ subscribe });
      
      try {
        const status = await checkGatewayStatus();
        
        if (status.available) {
          const client = getGatewayClient({
            url: state.gatewayUrl,
            token: state.gatewayToken || undefined
          });

          await client.connect();
          
          update(s => ({ ...s, isConnected: true, lastError: null }));
          return true;
        } else {
          update(s => ({ 
            ...s, 
            isConnected: false, 
            lastError: status.error || 'Gateway not available' 
          }));
          return false;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Connection failed';
        update(s => ({ ...s, isConnected: false, lastError: errorMsg }));
        return false;
      }
    },

    // 현재 상태 가져오기
    getState(): GatewayState {
      return get({ subscribe });
    }
  };
}

export const gatewayStore = createGatewayStore();

// Derived store: 현재 모드가 게이트웨이인지
export const isGatewayMode = derived(gatewayStore, $state => $state.mode === 'gateway');

// Derived store: 연결됨
export const isGatewayConnected = derived(gatewayStore, $state => 
  $state.mode === 'gateway' && $state.isConnected
);
