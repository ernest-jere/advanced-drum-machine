import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LOCAL_DRUM_PADS } from './audioBank';

export default function App() {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [displayText, setDisplayText] = useState('Welcome');
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recordedSequence, setRecordedSequence] = useState([]);
  const [recordingStartTime, setRecordingStartTime] = useState(null);

  const playbackTimeouts = useRef([]);
  const audioCtxRef = useRef(null);

  // 1. Synthesizer audio tone node engine
  const playSynthesizedTone = useCallback((key) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const frequencies = { Q: 261.63, W: 293.66, E: 329.63, A: 349.23, S: 392.00, D: 440.00, Z: 493.88, X: 523.25, C: 587.33 };
      
      osc.type = key === 'Q' || key === 'A' || key === 'Z' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(frequencies[key] || 440, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.4);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.error("Web Audio fallback error: ", e);
    }
  }, [volume]);

  // 2. Core trigger function wrapped in useCallback (Placed above effects!)
  const playSound = useCallback((id, key) => {
    if (!isPowerOn) return;

    playSynthesizedTone(key);
    
    const padElement = document.getElementById(id);
    if (padElement) {
      padElement.classList.add('bg-cyan-500', 'scale-95');
      setTimeout(() => {
        padElement.classList.remove('bg-cyan-500', 'scale-95');
      }, 100);
    }
    
    setDisplayText(id.replace(/-/g, ' '));

    if (isRecording) {
      setRecordedSequence(prev => [...prev, { id, key, timeOffset: Date.now() - recordingStartTime }]);
    }
  }, [isPowerOn, isRecording, recordingStartTime, playSynthesizedTone]);

  // 3. Global keyboard listeners (Safely down below, accessing playSound)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isPowerOn || isPlayingBack) return;
      const targetKey = event.key.toUpperCase();
      const pad = LOCAL_DRUM_PADS.find(p => p.key === targetKey);
      if (pad) {
        playSound(pad.id, pad.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPowerOn, isPlayingBack, playSound]);

  useEffect(() => {
    return () => playbackTimeouts.current.forEach(clearTimeout);
  }, []);

  const toggleRecording = () => {
    if (!isPowerOn || isPlayingBack) return;
    
    if (!isRecording) {
      setRecordedSequence([]);
      setRecordingStartTime(Date.now());
      setIsRecording(true);
      setDisplayText('Recording...');
    } else {
      setIsRecording(false);
      setDisplayText('Recording Saved');
    }
  };

  const startReplay = () => {
    if (!isPowerOn || isRecording || recordedSequence.length === 0) return;
    
    setIsPlayingBack(true);
    setDisplayText('Replaying...');

    playbackTimeouts.current.forEach(clearTimeout);
    playbackTimeouts.current = [];

    recordedSequence.forEach((note) => {
      const timeoutId = setTimeout(() => {
        playSynthesizedTone(note.key);
        const padElement = document.getElementById(note.id);
        if (padElement) {
          padElement.classList.add('bg-cyan-500', 'scale-95');
          setTimeout(() => {
            padElement.classList.remove('bg-cyan-500', 'scale-95');
          }, 100);
        }
        setDisplayText(note.id.replace(/-/g, ' '));
      }, note.timeOffset);
      
      playbackTimeouts.current.push(timeoutId);
    });

    const totalDuration = Math.max(...recordedSequence.map(n => n.timeOffset), 0) + 600;
    
    const endTimeoutId = setTimeout(() => {
      setIsPlayingBack(false);
      setDisplayText('Replay Finished');
    }, totalDuration);

    playbackTimeouts.current.push(endTimeoutId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 select-none p-4">
      <div 
        id="drum-machine" 
        className="w-full max-w-xl bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <div className="md:col-span-3 grid grid-cols-3 gap-2">
          {LOCAL_DRUM_PADS.map((pad) => (
            <button
              key={pad.key}
              id={pad.id}
              onClick={() => playSound(pad.id, pad.key)}
              disabled={!isPowerOn || isPlayingBack}
              className={`drum-pad h-20 flex flex-col items-center justify-center font-bold text-xl rounded-xl border border-slate-600 shadow-md transition-all duration-150
                ${!isPowerOn 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-slate-800 shadow-none' 
                  : isPlayingBack 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-95 text-white cursor-pointer'
                }`}
            >
              {pad.key}
              <audio src={pad.url} className="clip" id={pad.key} preload="auto" />
            </button>
          ))}
        </div>

        <div className="md:col-span-2 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between bg-slate-700 p-2 rounded-lg">
            <span className="font-semibold tracking-wide text-sm">POWER</span>
            <button 
              onClick={() => {
                setIsPowerOn(!isPowerOn);
                setDisplayText(isPowerOn ? 'Power Off' : 'Welcome');
                if (isRecording) setIsRecording(false);
              }}
              className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isPowerOn ? 'bg-green-500 justify-end' : 'bg-slate-600 justify-start'}`}
            >
              <div className="bg-white w-5 h-5 rounded-full shadow-md" />
            </button>
          </div>

          <div 
            id="display" 
            className={`p-4 rounded-xl text-center font-mono text-sm tracking-widest uppercase border h-14 flex items-center justify-center transition-all duration-300
              ${isPowerOn 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' 
                : 'bg-slate-900 text-slate-600 border-slate-700'
              }`}
          >
            {isPowerOn ? displayText : ''}
          </div>

          <div className="flex flex-col space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <span>VOLUME</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.01" value={volume}
              disabled={!isPowerOn}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-blue-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 space-y-2 flex flex-col">
            <span className="text-xs font-bold text-slate-400 tracking-wider">SEQUENCER</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleRecording}
                disabled={!isPowerOn || isPlayingBack}
                className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-red-600 border-red-500 text-white animate-pulse' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                } disabled:opacity-45`}
              >
                {isRecording ? '🛑 STOP' : '🎙️ RECORD'}
              </button>
              <button
                onClick={startReplay}
                disabled={!isPowerOn || isRecording || recordedSequence.length === 0}
                className="py-2 px-3 bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer disabled:opacity-35"
              >
                ▶️ PLAY BACK
              </button>
            </div>
            <button
              onClick={() => setRecordedSequence([])}
              disabled={!isPowerOn || isRecording || recordedSequence.length === 0}
              className="w-full py-1 text-[10px] tracking-wider font-bold bg-slate-900 border border-slate-800 text-slate-500 hover:text-red-400 rounded-md transition-all cursor-pointer"
            >
              CLEAR SEQUENCE ({recordedSequence.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
