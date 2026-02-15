import { useState, useRef, useEffect } from 'preact/hooks';
import CalculatorShell from '../base/CalculatorShell';

interface Props {
  defaults?: Record<string, unknown>;
  lang?: string;
}

type QRTab = 'url' | 'text' | 'email' | 'wifi';

export default function QRCodeGenerator({ defaults, lang }: Props) {
  const [tab, setTab] = useState<QRTab>('url');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [size, setSize] = useState(256);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getContent = (): string => {
    switch (tab) {
      case 'url': return url;
      case 'text': return text;
      case 'email': return emailSubject ? `mailto:${email}?subject=${encodeURIComponent(emailSubject)}` : `mailto:${email}`;
      case 'wifi': return `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;
      default: return '';
    }
  };

  const content = getContent();

  useEffect(() => {
    if (!content.trim()) {
      setQrDataUrl('');
      return;
    }
    // Dynamically import qrcode library
    import('qrcode').then((QRCode) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      QRCode.toCanvas(canvas, content, {
        width: size,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      }, (err: Error | null) => {
        if (!err) {
          setQrDataUrl(canvas.toDataURL('image/png'));
        }
      });
    }).catch(() => {});
  }, [content, size]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'calchub-qrcode.png';
    a.click();
  };

  const tabs: { key: QRTab; label: string }[] = [
    { key: 'url', label: 'URL' },
    { key: 'text', label: 'Text' },
    { key: 'email', label: 'Email' },
    { key: 'wifi', label: 'WiFi' },
  ];

  return (
    <CalculatorShell>
      <div class="space-y-4">
        {/* Tab selector */}
        <div class="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              class={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Input fields per tab */}
        {tab === 'url' && (
          <input
            type="url"
            value={url}
            onInput={(e) => setUrl((e.target as HTMLInputElement).value)}
            placeholder="https://example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            aria-label="URL"
          />
        )}

        {tab === 'text' && (
          <textarea
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            placeholder="Enter any text..."
            rows={3}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            aria-label="Text content"
          />
        )}

        {tab === 'email' && (
          <div class="space-y-2">
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
              placeholder="recipient@example.com"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Email address"
            />
            <input
              type="text"
              value={emailSubject}
              onInput={(e) => setEmailSubject((e.target as HTMLInputElement).value)}
              placeholder="Subject (optional)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Email subject"
            />
          </div>
        )}

        {tab === 'wifi' && (
          <div class="space-y-2">
            <input
              type="text"
              value={wifiSsid}
              onInput={(e) => setWifiSsid((e.target as HTMLInputElement).value)}
              placeholder="Network name (SSID)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="WiFi network name"
            />
            <input
              type="text"
              value={wifiPassword}
              onInput={(e) => setWifiPassword((e.target as HTMLInputElement).value)}
              placeholder="Password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="WiFi password"
            />
            <select
              value={wifiEncryption}
              onChange={(e) => setWifiEncryption((e.target as HTMLSelectElement).value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              aria-label="Encryption type"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No password</option>
            </select>
          </div>
        )}

        {/* Size selector */}
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-600">Size:</label>
          <div class="flex gap-2">
            {[128, 256, 512].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                class={`px-3 py-1 text-sm rounded-md border transition-colors ${
                  size === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code output */}
      <div class="mt-6 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          class={content.trim() ? '' : 'hidden'}
          style={{ imageRendering: 'pixelated' }}
        />

        {!content.trim() && (
          <div class="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Enter content to generate QR code
          </div>
        )}

        {qrDataUrl && (
          <div class="mt-4 flex gap-3">
            <button
              onClick={downloadQR}
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Download PNG
            </button>
          </div>
        )}

        {content.trim() && (
          <div class="mt-3 text-xs text-gray-400 text-center max-w-xs break-all">
            {content.length > 100 ? content.slice(0, 100) + '...' : content}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
