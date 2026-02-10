export namespace auth {
	
	export class UserInfo {
	    id: string;
	    email: string;
	    name: string;
	    avatar?: string;
	    provider: string;
	
	    static createFrom(source: any = {}) {
	        return new UserInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.email = source["email"];
	        this.name = source["name"];
	        this.avatar = source["avatar"];
	        this.provider = source["provider"];
	    }
	}

}

export namespace config {
	
	export class Config {
	    appName: string;
	    version: string;
	    ollamaUrl: string;
	    ollamaModel: string;
	    kakaoEnabled: boolean;
	    kakaoPort: number;
	    kakaoWebhookPath: string;
	    kakaoDmPolicy: string;
	    kakaoAllowFrom: string[];
	    kakaoSystemPrompt: string;
	    kakaoModel: string;
	    relayUrl: string;
	    relayToken: string;
	    authProvider: string;
	    accessToken: string;
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.appName = source["appName"];
	        this.version = source["version"];
	        this.ollamaUrl = source["ollamaUrl"];
	        this.ollamaModel = source["ollamaModel"];
	        this.kakaoEnabled = source["kakaoEnabled"];
	        this.kakaoPort = source["kakaoPort"];
	        this.kakaoWebhookPath = source["kakaoWebhookPath"];
	        this.kakaoDmPolicy = source["kakaoDmPolicy"];
	        this.kakaoAllowFrom = source["kakaoAllowFrom"];
	        this.kakaoSystemPrompt = source["kakaoSystemPrompt"];
	        this.kakaoModel = source["kakaoModel"];
	        this.relayUrl = source["relayUrl"];
	        this.relayToken = source["relayToken"];
	        this.authProvider = source["authProvider"];
	        this.accessToken = source["accessToken"];
	    }
	}

}

export namespace main {
	
	export class AuthStatus {
	    authenticated: boolean;
	    user?: auth.UserInfo;
	    expires_at?: number;
	
	    static createFrom(source: any = {}) {
	        return new AuthStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.authenticated = source["authenticated"];
	        this.user = this.convertValues(source["user"], auth.UserInfo);
	        this.expires_at = source["expires_at"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ChatMessage {
	    role: string;
	    content: string;
	    timestamp: number;
	
	    static createFrom(source: any = {}) {
	        return new ChatMessage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.role = source["role"];
	        this.content = source["content"];
	        this.timestamp = source["timestamp"];
	    }
	}
	export class HWPConvertResult {
	    success: boolean;
	    message?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new HWPConvertResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.message = source["message"];
	        this.error = source["error"];
	    }
	}
	export class HWPParseResult {
	    success: boolean;
	    text?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new HWPParseResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.text = source["text"];
	        this.error = source["error"];
	    }
	}
	export class KakaoConfigJS {
	    enabled: boolean;
	    port: number;
	    webhookPath: string;
	    dmPolicy: string;
	    allowFrom: string[];
	    systemPrompt: string;
	    model: string;
	
	    static createFrom(source: any = {}) {
	        return new KakaoConfigJS(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.enabled = source["enabled"];
	        this.port = source["port"];
	        this.webhookPath = source["webhookPath"];
	        this.dmPolicy = source["dmPolicy"];
	        this.allowFrom = source["allowFrom"];
	        this.systemPrompt = source["systemPrompt"];
	        this.model = source["model"];
	    }
	}
	export class KakaoStatus {
	    running: boolean;
	    enabled: boolean;
	    port: number;
	    webhookPath: string;
	
	    static createFrom(source: any = {}) {
	        return new KakaoStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.running = source["running"];
	        this.enabled = source["enabled"];
	        this.port = source["port"];
	        this.webhookPath = source["webhookPath"];
	    }
	}
	export class OcrResult {
	    success: boolean;
	    text?: string;
	    error?: string;
	    line_count?: number;
	
	    static createFrom(source: any = {}) {
	        return new OcrResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.text = source["text"];
	        this.error = source["error"];
	        this.line_count = source["line_count"];
	    }
	}
	export class RelayStatus {
	    connected: boolean;
	    code: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new RelayStatus(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.connected = source["connected"];
	        this.code = source["code"];
	        this.url = source["url"];
	    }
	}
	export class SystemInfo {
	    os: string;
	    arch: string;
	    memoryGb: number;
	
	    static createFrom(source: any = {}) {
	        return new SystemInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.os = source["os"];
	        this.arch = source["arch"];
	        this.memoryGb = source["memoryGb"];
	    }
	}

}

