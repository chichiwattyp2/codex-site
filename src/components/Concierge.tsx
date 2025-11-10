import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import type { Strain } from '../data/strains';
import products from '../data/products';

const MODEL_URI = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/weights';

type Mood = 'uplifted' | 'focused' | 'creative' | 'relaxed' | 'balanced' | 'sleepy' | 'social';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
};

type Props = {
  strains: Strain[];
  onAddToCart: (productId: string) => void;
};

const expressionMoodMap: Record<string, Mood> = {
  happy: 'uplifted',
  surprised: 'creative',
  neutral: 'balanced',
  angry: 'focused',
  disgusted: 'relaxed',
  fearful: 'sleepy',
  sad: 'relaxed'
};

const moodCopy: Record<Mood, string> = {
  uplifted: 'You are glowing today. Let us keep that energy elevated!',
  focused: 'Grounded focus detected. Here is something to keep the flow steady.',
  creative: 'Sparks are flying—let us channel that into something special.',
  relaxed: 'Your aura feels calm and serene. Pair it with something soothing.',
  balanced: 'A harmonious vibe deserves an equally balanced cultivar.',
  sleepy: 'You look ready to unwind. A dreamy strain will be perfect.',
  social: 'A social pulse is rising—time for an extroverted companion.'
};

const keywordMoodMap: Array<{ keywords: string[]; mood: Mood }> = [
  { keywords: ['sleep', 'rest', 'calm', 'stress'], mood: 'relaxed' },
  { keywords: ['focus', 'work', 'study'], mood: 'focused' },
  { keywords: ['party', 'friends', 'social'], mood: 'social' },
  { keywords: ['creative', 'paint', 'write'], mood: 'creative' },
  { keywords: ['balanced', 'chill', 'any'], mood: 'balanced' },
  { keywords: ['uplift', 'energy', 'day'], mood: 'uplifted' }
];

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const Concierge: React.FC<Props> = ({ strains, onAddToCart }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [status, setStatus] = useState<string>('Models idle');
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [lastMoodNotified, setLastMoodNotified] = useState<Mood | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: createId(),
      sender: 'bot',
      text: 'Hey there! Activate the camera or tell me how you are feeling and I will pair you with the perfect pre-roll.'
    }
  ]);

  const recommendedStrain = useMemo(() => {
    if (!currentMood) return null;
    return (
      strains.find(strain => strain.moodTags.includes(currentMood)) ??
      strains.find(strain => strain.moodTags.includes('balanced')) ??
      null
    );
  }, [currentMood, strains]);

  const ensureModels = useCallback(async () => {
    if (modelsReady) {
      return;
    }

    setStatus('Loading face models…');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URI),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URI)
    ]);
    setModelsReady(true);
    setStatus('Models ready');
  }, [modelsReady]);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach(track => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setStatus('Camera stopped');
  }, []);

  const analyzeMood = useCallback(async () => {
    if (!videoRef.current) return;

    const result = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!result) {
      setStatus('Face not detected. Try adjusting lighting or distance.');
      return;
    }

    const { expressions } = result;
    const dominant = Object.entries(expressions).reduce(
      (prev, curr) => (curr[1] > prev[1] ? curr : prev),
      ['neutral', 0] as [string, number]
    );

    const mood = expressionMoodMap[dominant[0]] ?? 'balanced';
    setCurrentMood(mood);
    setStatus(`Detected mood: ${mood}`);

    const canvas = canvasRef.current;
    if (canvas && videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.strokeRect(
          result.detection.box.x,
          result.detection.box.y,
          result.detection.box.width,
          result.detection.box.height
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!isCameraActive) return;

    let timeoutId: number;

    const loop = async () => {
      await analyzeMood();
      timeoutId = window.setTimeout(loop, 900);
    };

    loop();

    return () => window.clearTimeout(timeoutId);
  }, [analyzeMood, isCameraActive]);

  const startCamera = useCallback(async () => {
    try {
      await ensureModels();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
      setStatus('Camera active. Analyzing mood…');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(err);
      setStatus('Unable to access camera. You can still choose a mood manually.');
    }
  }, [ensureModels]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => {
    if (!currentMood || currentMood === lastMoodNotified) {
      return;
    }

    setLastMoodNotified(currentMood);

    const strain = recommendedStrain;
    if (!strain) return;

    const copy = moodCopy[currentMood];

    setMessages(prev => [
      ...prev,
      {
        id: createId(),
        sender: 'bot',
        text: `${copy} I recommend **${strain.name}**. ${strain.description}`
      }
    ]);
  }, [currentMood, lastMoodNotified, recommendedStrain]);

  const inferMoodFromText = (text: string): Mood | null => {
    const normalized = text.toLowerCase();
    for (const entry of keywordMoodMap) {
      if (entry.keywords.some(keyword => normalized.includes(keyword))) {
        return entry.mood;
      }
    }
    return null;
  };

  const formatStrainResponse = (strain: Strain, mood: Mood | null) => {
    const product = strain.productId ? products.find(p => p.id === strain.productId) : undefined;
    const terpeneList = strain.terpeneProfile.join(', ');
    const tasting = strain.tastingNotes.join(', ');
    const activities = strain.pairedActivities.join(', ');

    let response = `${mood ? moodCopy[mood] + ' ' : ''}Consider **${strain.name}** (${strain.lineage}). `;
    response += `${strain.description} `;
    response += `Primary terpenes: ${terpeneList}. Tasting notes: ${tasting}. `;
    response += `Pairs well with ${activities}.`;
    if (product) {
      response += ` It is available as ${product.name} for $${product.price.toFixed(2)}. Say "add to cart" to pick it up.`;
    }
    return response;
  };

  const handleSend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    const userMessage: Message = {
      id: createId(),
      sender: 'user',
      text: value
    };

    setMessages(prev => [...prev, userMessage]);
    input.value = '';

    const lower = value.toLowerCase();

    if (lower.includes('add to cart') && recommendedStrain?.productId) {
      onAddToCart(recommendedStrain.productId);
      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          sender: 'bot',
          text: `Got it! **${recommendedStrain.name}** is now in your cart.`
        }
      ]);
      return;
    }

    const moodFromText = inferMoodFromText(value);
    if (moodFromText) {
      setCurrentMood(moodFromText);
    }

    const strain = moodFromText
      ? strains.find(item => item.moodTags.includes(moodFromText)) ?? recommendedStrain
      : recommendedStrain;

    if (strain) {
      const response = formatStrainResponse(strain, moodFromText ?? currentMood);
      setMessages(prev => [
        ...prev,
        {
          id: createId(),
          sender: 'bot',
          text: response
        }
      ]);
      return;
    }

    setMessages(prev => [
      ...prev,
        {
          id: createId(),
        sender: 'bot',
        text: 'I am still getting to know our menu better. Could you tell me how you would like to feel?'
      }
    ]);
  };

  const handleManualMood = (mood: Mood) => {
    setCurrentMood(mood);
    setMessages(prev => [
      ...prev,
      {
        id: createId(),
        sender: 'bot',
        text: moodCopy[mood]
      }
    ]);
  };

  return (
    <div className="concierge">
      <div style={{ position: 'relative' }}>
        <video ref={videoRef} style={{ display: isCameraActive ? 'block' : 'none' }} muted playsInline />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            display: isCameraActive ? 'block' : 'none'
          }}
        />
        {!isCameraActive && (
          <div
            style={{
              padding: '2.5rem',
              borderRadius: '24px',
              background: 'rgba(15, 118, 110, 0.07)',
              border: '2px dashed rgba(16, 185, 129, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'flex-start'
            }}
          >
            <h3 style={{ margin: 0 }}>Camera Concierge</h3>
            <p style={{ margin: 0, color: '#0f172a' }}>
              We analyze facial expressions in real time. No photos are stored or transmitted.
            </p>
            <button className="primary-button" onClick={startCamera}>
              Activate Camera
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(['uplifted', 'relaxed', 'focused', 'creative', 'balanced', 'sleepy', 'social'] as Mood[]).map(mood => (
                <button
                  key={mood}
                  style={{
                    borderRadius: '999px',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '0.5rem 1.25rem',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleManualMood(mood)}
                >
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        <div
          className="gradient-card"
          style={{
            marginTop: '1.5rem',
            background: '#ffffff',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 14px 30px rgba(59, 130, 246, 0.18)'
          }}
        >
          <strong>Status:</strong>
          <span style={{ color: '#1d4ed8' }}>{status}</span>
          {currentMood && recommendedStrain && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Suggested strain:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                {recommendedStrain.name} — {recommendedStrain.description}
              </p>
              {recommendedStrain.productId && (
                <button className="primary-button" onClick={() => onAddToCart(recommendedStrain.productId!)}>
                  Add {recommendedStrain.name} to cart
                </button>
              )}
            </div>
          )}
          {isCameraActive && (
            <button
              onClick={stopCamera}
              style={{
                marginTop: '1rem',
                background: 'none',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '999px',
                padding: '0.5rem 1.5rem',
                color: '#b91c1c',
                cursor: 'pointer'
              }}
            >
              Stop Camera
            </button>
          )}
        </div>
      </div>

      <div className="chat-panel">
        <h3 style={{ margin: 0 }}>Chat Concierge</h3>
        <div className="chat-log">
          {messages.map(message => (
            <div key={message.id} className={`chat-message ${message.sender}`}>
              <span>
                {message.text.split('**').map((segment, index) =>
                  index % 2 === 1 ? <strong key={index}>{segment}</strong> : <React.Fragment key={index}>{segment}</React.Fragment>
                )}
              </span>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={handleSend}>
          <input name="message" placeholder="Ask about effects, terpenes, or type your mood…" autoComplete="off" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Concierge;
