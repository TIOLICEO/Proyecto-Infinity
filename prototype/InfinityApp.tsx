import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Fingerprint, ScanFace, Lock, Wallet, MessageSquare, Mail, 
  PlaySquare, Settings, Radio, RefreshCcw, Building, Send, Mic, Trash2, 
  EyeOff, Activity, ShieldCheck, Globe, Phone, Video as VideoIcon, 
  Calendar, BarChart2, ChevronLeft, MoreVertical, Paperclip, Play, 
  FileText, Image as ImageIcon, MapPin, Bell, Clock, Power, Zap, 
  Gem, MonitorPlay, GraduationCap, Palette, LayoutGrid, Eye
} from 'lucide-react';

export default function InfinityApp() {
  const [appState, setAppState] = useState('booting'); 
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeModule, setActiveModule] = useState('home');
  const [ghostMode, setGhostMode] = useState(false);
  const [osTheme, setOsTheme] = useState('GLASS'); 
  
  // Seguridad y Bloqueo
  const [pinPad, setPinPad] = useState([]);
  const [dynamicNumbers, setDynamicNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
  const [seedPhrase, setSeedPhrase] = useState([]);
  
  // Billetera y Finanzas
  const [balanceIFC, setBalanceIFC] = useState(1450.25);
  const [balanceUSD, setBalanceUSD] = useState(3200.00);
  const [goldAsset, setGoldAsset] = useState(2.5);
  const [reAsset, setRealEstateAsset] = useState(0.05);
  const [virtualCards, setVirtualCards] = useState([
    { id: 1, label: 'Suscripción Netflix', number: '**** 8812', exp: '24h', color: 'from-red-600/50 to-red-900/30' }
  ]);
  
  // GhostComm y Chat
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'text', text: 'El enlace de radio LoRa G1 con la vecindad está estable.', sender: 'them', time: '10:42 AM' },
    { id: 2, type: 'text', text: 'Excelente. Activando enrutamiento criptográfico asíncrono.', sender: 'me', time: '10:45 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isPttActive, setIsPttActive] = useState(false);
  const [isHushMode, setIsHushMode] = useState(false); 
  const [revealedMessages, setRevealedMessages] = useState({});
  const [screenShake, setScreenShake] = useState(false); 
  
  // SecureMail & IA
  const [autoSyncMail, setAutoSyncMail] = useState(true);
  const [mailSynced, setMailSync] = useState(false);
  
  // Junior Mining
  const [juniorBalance, setJuniorBalance] = useState(12.45);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (appState === 'booting') {
      const timer = setTimeout(() => setAppState('onboarding'), 2200);
      return () => clearTimeout(timer);
    }
  }, [appState]);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedChat]);

  const generateSeed = () => {
    const dictionary = ["quantum", "mesh", "sovereign", "vault", "kyber", "enclave", "sovereign", "iron", "silicon", "matrix", "beacon", "crypto", "shield", "beacon", "titan", "rust", "enigma", "cipher", "bastion", "fenix", "ledger", "lora"];
    const phrase = Array.from({ length: 24 }, () => dictionary[Math.floor(Math.random() * dictionary.length)]);
    setSeedPhrase(phrase);
  };

  const shufflePinPad = () => {
    setDynamicNumbers([...dynamicNumbers].sort(() => Math.random() - 0.5));
  };

  useEffect(() => {
    if (appState === 'active' && !isUnlocked) {
      shufflePinPad();
      setPinPad([]);
    }
  }, [isUnlocked, appState]);

  const handlePinPress = (num) => {
    if (pinPad.length < 4) {
      const newPin = [...pinPad, num];
      setPinPad(newPin);
      if (newPin.length === 4) {
        const pinString = newPin.join('');
        setTimeout(() => {
          if (pinString === '0000') {
            setGhostMode(true);
            setIsUnlocked(true);
          } else {
            setGhostMode(false);
            setIsUnlocked(true);
          }
        }, 300);
      }
    }
  };

  const clearPin = () => {
    setPinPad([]);
    shufflePinPad();
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: Date.now(),
      type: 'text',
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setInputText('');
  };

  const sendAttachment = (type, label) => {
    setShowAttachMenu(false);
    const newMsg = {
      id: Date.now(),
      type: type,
      text: label,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
  };

  const triggerQuantumPing = () => {
    setScreenShake(true);
    const pingMsg = {
      id: Date.now(),
      type: 'ping',
      text: '🚨 ¡QUANTUM PING ENVIADO! Forzando alerta física en el nodo receptor.',
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, pingMsg]);
    setTimeout(() => setScreenShake(false), 800);
  };

  const toggleRevealMessage = (id) => {
    setRevealedMessages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const buyFractionalAsset = (type) => {
    if (balanceUSD < 100) return;
    setBalanceUSD(prev => prev - 100);
    if (type === 'gold') {
      setGoldAsset(prev => Number((prev + 0.2).toFixed(2)));
    } else {
      setRealEstateAsset(prev => Number((prev + 0.01).toFixed(3)));
    }
  };

  const generateDisposableCard = () => {
    const randomCard = {
      id: Date.now(),
      label: 'Compra Única ' + ['Amazon', 'Ebay', 'Alibaba'][Math.floor(Math.random() * 3)],
      number: '**** ' + Math.floor(1000 + Math.random() * 9000),
      exp: '24h',
      color: 'from-amber-600/50 to-amber-900/30'
    };
    setVirtualCards([...virtualCards, randomCard]);
  };

  const triggerJuniorQuiz = () => {
    const quizzes = [
      { q: "¿Qué algoritmo usa INFINITY para cifrar mensajes?", a: "Kyber-1024", options: ["RSA-2048", "Kyber-1024", "SHA-256"], reward: 0.5 },
      { q: "¿En qué lenguaje está programado el núcleo de enrutamiento?", a: "Rust", options: ["Python", "C++", "Rust"], reward: 0.75 }
    ];
    setCurrentQuiz(quizzes[Math.floor(Math.random() * quizzes.length)]);
    setQuizAnswered(false);
  };

  const answerJuniorQuiz = (option) => {
    if (option === currentQuiz.a) {
      setJuniorBalance(prev => Number((prev + currentQuiz.reward).toFixed(2)));
    }
    setQuizAnswered(true);
    setTimeout(() => { setCurrentQuiz(null); }, 1500);
  };

  const currentTheme = osTheme === 'GLASS' ? {
    bg: "bg-zinc-950/95",
    text: "text-slate-100 font-sans",
    accent: "text-cyan-400",
    border: "border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)]",
    card: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl",
    cardItem: "bg-white/5 border border-white/10 rounded-xl",
    button: "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold p-3 rounded-xl transition-all shadow-[0_0_10px_rgba(34,211,238,0.3)]",
    nav: "bg-zinc-950/90 border-t border-white/10 backdrop-blur-md"
  } : osTheme === 'STEALTH' ? {
    bg: "bg-black",
    text: "text-zinc-400 font-mono",
    accent: "text-amber-500",
    card: "bg-zinc-950 border border-zinc-800 rounded-xl",
    cardItem: "bg-black border border-zinc-900 rounded-lg",
    nav: "bg-black border-t border-zinc-900"
  } : { 
    bg: "bg-slate-50",
    text: "text-slate-900 font-sans",
    accent: "text-indigo-600",
    card: "bg-white border border-slate-200 rounded-2xl shadow-sm",
    cardItem: "bg-slate-100 border border-slate-200 rounded-xl",
    nav: "bg-white/95 border-t border-slate-200 backdrop-blur-sm"
  };

  if (appState === 'booting') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-cyan-400 font-mono p-4">
        <div className="animate-pulse flex flex-col items-center">
          <Power size={64} className="mb-4 text-cyan-400 animate-spin duration-3000" />
          <p className="tracking-widest uppercase text-2xl font-black">INFINITY OS</p>
          <div className="w-48 bg-zinc-800 h-1 rounded-full overflow-hidden mt-4">
            <div className="bg-cyan-400 h-full w-[65%] rounded-full animate-pulse" />
          </div>
          <p className="text-[10px] mt-2 opacity-50 uppercase tracking-widest">Iniciando Kernel en Malla Local...</p>
        </div>
      </div>
    );
  }

  if (appState === 'onboarding') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-neutral-950 p-4 font-sans">
        <div className="w-full max-w-[390px] h-[800px] bg-zinc-950 text-cyan-400 rounded-[3rem] border-[10px] border-zinc-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="text-center mt-6">
            <ShieldCheck size={44} className="mx-auto text-cyan-500 animate-bounce" />
            <h2 className="text-xl font-bold tracking-tight text-white mt-3">CREAR IDENTIDAD INFINITY</h2>
            <p className="text-[11px] text-slate-400 mt-1">El enclave criptográfico local forjará tu firma única de no-retención.</p>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center my-4 overflow-y-auto hide-scrollbar">
            {seedPhrase.length === 0 ? (
              <div className="text-center">
                <p className="text-xs text-slate-300 leading-relaxed max-w-[280px] mb-6">
                  Tus datos biométricos se convertirán en una firma matemática irreversible. Genera tu llave física de respaldo antes de continuar.
                </p>
                <button onClick={generateSeed} className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-6 py-3 rounded-2xl shadow-lg transition-all text-xs uppercase tracking-widest cursor-pointer">
                  Generar Seed Phrase
                </button>
              </div>
            ) : (
              <div className="w-full animate-in fade-in zoom-in duration-500">
                <p className="text-[10px] text-amber-400 font-bold text-center mb-3">⚠️ GUARDA ESTAS 24 PALABRAS FUERA DE LÍNEA</p>
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-2xl border border-zinc-800 max-h-[280px] overflow-y-auto">
                  {seedPhrase.map((word, i) => (
                    <div key={i} className="text-[10px] bg-zinc-900 p-1.5 rounded-lg border border-zinc-800 text-slate-300 font-mono flex gap-1">
                      <span className="opacity-40">{i+1}.</span> <span className="font-bold">{word}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <button onClick={() => setAppState('active')} className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition-transform">
                      <Fingerprint size={36} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2">Mantén pulsado para vincular datos</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center min-h-screen bg-neutral-900 p-2 md:p-4 font-sans transition-all duration-300 ${screenShake ? 'animate-bounce' : ''}`}>
      <div className={`relative w-full max-w-[390px] h-[800px] ${currentTheme.bg} ${currentTheme.text} rounded-[3rem] border-[12px] border-zinc-800 flex flex-col shadow-2xl overflow-hidden transition-all duration-500`}>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-3 h-3 bg-black rounded-full border-2 border-zinc-900 mr-8" />
          <div className="w-12 h-1 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex justify-between items-center px-8 pt-6 pb-2 text-[10px] opacity-60 font-mono z-40 bg-zinc-950/10 shrink-0">
          <span className="flex items-center gap-1"><Lock size={10} className={currentTheme.accent}/> {ghostMode ? 'GHOST-SECURE' : 'PQC-SECURE'}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1"><Radio size={10} className="text-green-400"/> {selectedChat ? 'P2P MESH' : 'SWARM'}</span>
            <div className="flex items-center gap-1"><span>85%</span><div className="w-5 h-2.5 border border-slate-500 rounded-sm p-[1px] flex items-center"><div className="w-[85%] h-full bg-green-400 rounded-[1px]"></div></div></div>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="flex-1 flex flex-col justify-between p-8 pt-12 text-center animate-in fade-in duration-500">
            <div className="mt-8">
              <Shield size={56} className="mx-auto opacity-80 text-cyan-400" />
              <h1 className="text-3xl font-black tracking-widest text-white mt-4">INFINITY OS</h1>
              <p className="text-[10px] opacity-50 mt-1 uppercase font-mono tracking-widest text-cyan-400">Zero-Knowledge Mesh</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex gap-4 mb-4"><ScanFace size={28} className="opacity-50" /><Fingerprint size={28} className="animate-pulse text-cyan-400" /></div>
              <p className="text-[10px] mb-4 opacity-70 font-mono uppercase tracking-wider">Ingrese PIN dinámico</p>
              <div className="flex gap-3 mb-8">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${pinPad.length > i ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_#22d3ee]' : 'border-zinc-700 bg-zinc-900'}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 w-full px-2">
                {dynamicNumbers.map((num) => (
                  <button key={num} onClick={() => handlePinPress(num)} className="h-14 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xl font-bold text-white hover:bg-zinc-800 active:scale-95 active:bg-cyan-900/40 transition-all cursor-pointer">{num}</button>
                ))}
                <button onClick={clearPin} className="h-14 rounded-2xl bg-red-950/20 border border-red-900/20 text-xs font-mono font-bold text-red-400 flex items-center justify-center hover:bg-red-900/20 cursor-pointer">BORRAR</button>
              </div>
            </div>
            <p className="text-[9px] opacity-40 font-mono max-w-[260px] mx-auto leading-relaxed">El PIN cambia de posición para eludir rastros dactilares. (PIN Señuelo: 0000)</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            
            {!selectedChat && (
              <div className="px-6 py-4 flex justify-between items-center bg-zinc-950/10 shrink-0 border-b border-white/5">
                <div>
                  <h3 className="font-black text-white text-lg tracking-tight uppercase">{activeModule}</h3>
                  <p className="text-[9px] text-cyan-400 font-mono tracking-widest flex items-center gap-1">
                    <Activity size={10} /> {ghostMode ? 'GHOST ACTIVADO' : 'ID: J4X-99-INF'}
                  </p>
                </div>
                <button onClick={() => setIsUnlocked(false)} className="p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white cursor-pointer"><Lock size={16} /></button>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4 pb-24 hide-scrollbar">
              
              {/* HOME */}
              {activeModule === 'home' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className={`${currentTheme.card} p-5 relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black`}>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black flex items-center gap-2 tracking-widest"><Calendar size={14} className={currentTheme.accent}/> AGENDA NEURONAL</h4>
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-bold uppercase">MAY 2026</span>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border-l-4 border-red-500 text-xs">
                        <div className="flex items-center gap-2"><Clock size={12} className="text-red-400" /><div><span className="font-bold block">Pago Luz</span><span className="text-[9px] text-slate-400">18:00 hrs</span></div></div>
                        <span className="font-mono text-[10px] opacity-75">$12.450</span>
                      </div>
                      {mailSynced && (
                        <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border-l-4 border-amber-500 text-xs animate-in slide-in-from-top-4">
                          <div className="flex items-center gap-2"><Clock size={12} className="text-amber-400" /><span className="font-bold">Factura IA</span></div>
                          <span className="font-mono text-[10px] opacity-75">$14.200</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 mb-3 tracking-widest uppercase">Ecosistema Soberano</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <AppGridIcon icon={<Wallet />} name="Wallet" onClick={() => setActiveModule('wallet')} theme={currentTheme} color="text-cyan-400" disabled={ghostMode} />
                      <AppGridIcon icon={<MessageSquare />} name="GhostComm" onClick={() => setActiveModule('comm')} theme={currentTheme} color="text-green-400" alert={!ghostMode} disabled={ghostMode} />
                      <AppGridIcon icon={<Mail />} name="SecureMail" onClick={() => setActiveModule('mail')} theme={currentTheme} color="text-purple-400" disabled={ghostMode} />
                      <AppGridIcon icon={<MonitorPlay />} name="Vision" onClick={() => setActiveModule('social')} theme={currentTheme} color="text-pink-400" />
                      <AppGridIcon icon={<FileText />} name="Office" onClick={() => setActiveModule('office')} theme={currentTheme} color="text-blue-400" />
                      <AppGridIcon icon={<GraduationCap />} name="Junior" onClick={() => setActiveModule('junior')} theme={currentTheme} color="text-amber-400" />
                    </div>
                  </div>
                </div>
              )}

              {/* WALLET */}
              {activeModule === 'wallet' && !ghostMode && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center py-2">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Capital Neto Soberano</p>
                    <h1 className="text-4xl font-black text-white tracking-tighter">${(balanceIFC * 1.25 + balanceUSD + 11000).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => buyFractionalAsset('gold')} className={`${currentTheme.cardItem} p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-zinc-800`}><Gem size={20} className="text-amber-400" /><span className="text-[10px] font-bold">Comprar Oro ($100)</span></button>
                    <button onClick={() => buyFractionalAsset('estate')} className={`${currentTheme.cardItem} p-3 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-zinc-800`}><Building size={20} className="text-blue-400" /><span className="text-[10px] font-bold">Comprar Frac. NY ($100)</span></button>
                  </div>

                  <div className={currentTheme.card + " p-4"}>
                    <h4 className="text-[10px] font-black opacity-60 uppercase mb-3 tracking-widest">Activos del Mundo Real (RWA)</h4>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center"><span className="font-bold flex items-center gap-2"><Gem size={14} className="text-amber-400"/> Oro Físico Custodiado</span><span className="font-mono">{goldAsset} oz</span></div>
                      <div className="h-[1px] bg-white/5" />
                      <div className="flex justify-between items-center"><span className="font-bold flex items-center gap-2"><Building size={14} className="text-blue-400"/> Real Estate NY</span><span className="font-mono">{reAsset}%</span></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black opacity-60 uppercase tracking-widest">Tarjetas (Burner)</h4>
                      <button onClick={generateDisposableCard} className="text-[10px] text-cyan-400 border border-cyan-400/30 px-2.5 py-1 rounded-lg hover:bg-cyan-500/10 cursor-pointer">+ Nueva</button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                      {virtualCards.map(card => (
                        <div key={card.id} className={`min-w-[210px] p-4 rounded-2xl bg-gradient-to-br ${card.color} border border-white/10 flex flex-col justify-between h-[110px]`}>
                          <div className="flex justify-between items-center text-[10px] font-black"><span>VISA SOBERANA</span><Clock size={12} className="animate-pulse" /></div>
                          <p className="font-mono tracking-widest text-lg font-bold">{card.number}</p>
                          <div className="flex justify-between items-center text-[9px] opacity-70"><span>{card.label}</span><span className="font-bold text-amber-300">Vence: {card.exp}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GHOSTCOMM */}
              {activeModule === 'comm' && !ghostMode && (
                <div className="h-full flex flex-col absolute inset-0 bg-zinc-950 z-50 overflow-hidden">
                  {!selectedChat ? (
                    <div className="p-4 pt-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-2"><MessageSquare className="text-cyan-400" /> GhostComm</h2>
                        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded-lg font-mono">KYBER-1024</span>
                      </div>
                      <div onClick={() => setSelectedChat({ name: 'Operaciones', pin: 'OP-42' })} className={`${currentTheme.card} p-3 flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition-colors`}>
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black border border-cyan-500/20">OP</div>
                        <div className="flex-1"><div className="flex justify-between"><span className="font-bold text-sm text-white">Canal Operativo</span><span className="text-[9px] opacity-40">Ahora</span></div><p className="text-xs opacity-50 truncate mt-1">Conectado a la malla local...</p></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full bg-zinc-950">
                      <div className="bg-zinc-900/90 backdrop-blur-md p-4 pt-10 flex justify-between items-center border-b border-white/5 shrink-0 z-40">
                        <div className="flex items-center gap-3">
                          <ChevronLeft onClick={() => { setSelectedChat(null); setIsHushMode(false); }} className="cursor-pointer text-cyan-400"/>
                          <div><h3 className="font-bold text-sm text-white leading-tight">{selectedChat.name}</h3><span className="text-[9px] text-green-400 font-mono flex items-center gap-1"><Activity size={8}/> Enlace Mesh</span></div>
                        </div>
                        <div className="flex gap-4 text-slate-400">
                          <button onClick={triggerQuantumPing} className="text-red-400 hover:text-red-300 transition-colors cursor-pointer" title="Quantum Ping"><Radio size={18} className="animate-pulse" /></button>
                          <button onClick={() => setIsHushMode(!isHushMode)} className={`transition-colors cursor-pointer ${isHushMode ? 'text-amber-400' : 'text-slate-400'}`} title="Tinta Invisible (Hush Mode)"><EyeOff size={18} /></button>
                          <MoreVertical size={18} className="cursor-pointer"/>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
                        {chatMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.type === 'text' && (
                              <div className={`max-w-[85%] p-3 rounded-2xl relative ${msg.sender === 'me' ? 'bg-cyan-700 text-white rounded-tr-none shadow-lg' : 'bg-zinc-800 text-slate-200 rounded-tl-none border border-white/5'}`}>
                                <div className="flex items-center gap-1">
                                  {isHushMode ? (
                                    <div onClick={() => toggleRevealMessage(msg.id)} className="cursor-pointer">
                                      {revealedMessages[msg.id] ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p> : <div className="flex items-center gap-2 blur-[4px] select-none text-xs"><span>{msg.text}</span><Eye size={12} className="text-amber-400 animate-pulse ml-1 absolute right-3" /></div>}
                                    </div>
                                  ) : (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                  )}
                                </div>
                                <span className="text-[8px] opacity-40 block text-right mt-1 font-mono">{msg.time}</span>
                              </div>
                            )}
                            {msg.type === 'ping' && (
                              <div className="w-[90%] bg-red-950/40 border border-red-500/40 p-3 rounded-2xl flex items-center gap-3 animate-pulse">
                                <Radio size={20} className="text-red-500 animate-ping" />
                                <div className="flex-1"><p className="text-xs font-black text-red-400">{msg.text}</p><span className="text-[8px] opacity-40 block mt-1">{msg.time}</span></div>
                              </div>
                            )}
                            {msg.type === 'invoice' && (
                              <div className="w-[90%] bg-amber-500/5 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-4 shadow-xl animate-in slide-in-from-bottom-4">
                                <div className="bg-amber-500 p-2.5 rounded-xl text-black shadow-[0_0_10px_rgba(245,158,11,0.3)]"><FileText size={20}/></div>
                                <div className="flex-1"><p className="text-xs font-black text-amber-400">{msg.text}</p><p className="text-xl font-black mt-1 text-white">{msg.amount}</p><p className="text-[9px] opacity-50 italic">{msg.sub}</p><div className="flex gap-2 mt-3"><button onClick={() => { setBalanceUSD(prev => prev - 14.20); sendAttachment('text', 'Pago Procesado con éxito por $14.20'); }} className="text-[9px] bg-amber-500 text-black px-4 py-1.5 rounded-lg font-black flex items-center gap-2 cursor-pointer"><Wallet size={10}/> PAGAR AHORA</button></div></div>
                              </div>
                            )}
                            {msg.type === 'doc' && (
                              <div className="w-[85%] bg-blue-950/20 border border-blue-500/30 p-3 rounded-2xl flex items-center gap-3"><FileText className="text-blue-400" /><div><p className="text-xs font-bold text-white">{msg.text}</p><span className="text-[8px] opacity-50">Documento en Malla • RAM Only</span></div></div>
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-4 bg-zinc-950 relative z-50 shrink-0">
                        {showAttachMenu && (
                          <div className="absolute bottom-full left-4 bg-zinc-900 p-2 rounded-2xl border border-white/10 mb-3 space-y-1 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] w-56 animate-in slide-in-from-bottom-4">
                            <button onClick={() => sendAttachment('doc', 'Contrato_Maestro_v2.pdf')} className="flex items-center gap-3 text-[11px] font-bold p-3 hover:bg-zinc-800 w-full rounded-xl text-white cursor-pointer"><FileText size={16} className="text-blue-400"/> Documento Seguro</button>
                            <button onClick={() => { setMailSync(true); setShowAttachMenu(false); syncWithMail(); }} className="flex items-center gap-3 text-[11px] font-black p-3 bg-purple-500/10 hover:bg-purple-500/20 w-full rounded-xl text-purple-400 border border-purple-500/20 cursor-pointer"><RefreshCcw size={16}/> SINC. DESDE MAIL</button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-3xl border border-zinc-700 focus-within:border-cyan-500/50">
                          <button onClick={() => setShowAttachMenu(!showAttachMenu)} className={`p-2 rounded-full cursor-pointer ${showAttachMenu ? 'bg-cyan-500 text-black' : 'text-slate-500 hover:text-white'}`}><Paperclip size={20} className={showAttachMenu ? 'rotate-45 transition-transform' : 'transition-transform'}/></button>
                          <input value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') handleSendMessage(); }} placeholder={isHushMode ? "Escribe en tinta invisible..." : "Mensaje encriptado..."} className="flex-1 bg-transparent text-sm focus:outline-none text-white px-2" autoComplete="off" />
                          {inputText.trim() ? (
                            <button onClick={handleSendMessage} className="p-2.5 bg-cyan-500 text-black rounded-full shadow-lg cursor-pointer"><Send size={18}/></button>
                          ) : (
                            <button onMouseDown={() => setIsPttActive(true)} onMouseUp={() => setIsPttActive(false)} className={`p-2.5 rounded-full cursor-pointer ${isPttActive ? 'bg-red-500 animate-pulse' : 'bg-zinc-800 text-slate-400'}`}><Radio size={18}/></button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MÓDULO 4: SECUREMAIL & IA EXTRACTOR */}
              {activeModule === 'mail' && !ghostMode && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className={`${currentTheme.card} p-5 bg-gradient-to-r from-zinc-900 to-purple-950/10 border-purple-500/30`}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xs font-black text-purple-400 tracking-widest uppercase">Escaneo IA local</h3>
                      <input type="checkbox" checked={autoSyncMail} onChange={() => setAutoSyncMail(!autoSyncMail)} className="accent-purple-500" />
                    </div>
                    <p className="text-[11px] opacity-70 leading-relaxed text-slate-300">La IA local procesa tus bandejas cifradas para extraer facturas de forma segura sin conexión a la nube.</p>
                  </div>
                </div>
              )}

              {/* MÓDULO 6: JUNIOR MINING */}
              {activeModule === 'junior' && (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="bg-black/50 border border-zinc-800 rounded-3xl p-6 text-center shadow-xl">
                    <GraduationCap size={44} className="text-amber-400 mx-auto mb-3" />
                    <p className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">Prueba Soberana (Junior)</p>
                    <p className="text-4xl font-mono font-bold text-white mb-6">{juniorBalance} IFC</p>

                    {currentQuiz ? (
                      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 text-left animate-in zoom-in duration-300">
                        <p className="text-xs font-bold text-slate-300 mb-3">{currentQuiz.q}</p>
                        <div className="space-y-2">
                          {currentQuiz.options.map((opt, i) => (
                            <button key={i} onClick={() => answerJuniorQuiz(opt)} disabled={quizAnswered} className="w-full text-left text-xs bg-black/60 p-2.5 rounded-xl border border-zinc-800 hover:border-cyan-500 transition-colors">{opt}</button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button onClick={triggerJuniorQuiz} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer"><Zap size={16} /> RESOLVER RETO</button>
                    )}
                  </div>
                </div>
              )}

              {/* MÓDULO 7: CONFIGURACIÓN Y THEME ENGINE */}
              {activeModule === 'settings' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                  <div className={currentTheme.card + " p-5"}>
                    <h3 className="text-xs font-black text-cyan-400 mb-4 flex items-center gap-2"><Palette size={16}/> Motor de Temas IA</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['GLASS', 'STEALTH', 'LUMINOUS'].map(mode => (
                        <button key={mode} onClick={() => setOsTheme(mode)} className={`p-2.5 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${osTheme === mode ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-zinc-900 border-zinc-800 text-slate-400'}`}>{mode}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* BARRA DE NAVEGACIÓN INFERIOR (DOCK) */}
            {!selectedChat && (
              <div className={`absolute bottom-0 w-full px-2 py-4 pb-8 flex justify-around items-center ${currentTheme.nav} z-40 rounded-b-[2.5rem]`}>
                <NavIcon icon={<LayoutGrid />} label="Home" id="home" current={activeModule} set={setActiveModule} theme={currentTheme} />
                <NavIcon icon={<Wallet />} label="Wallet" id="wallet" current={activeModule} set={setActiveModule} theme={currentTheme} disabled={ghostMode} />
                <NavIcon icon={<MessageSquare />} label="Chat" id="comm" current={activeModule} set={setActiveModule} theme={currentTheme} disabled={ghostMode} />
                <NavIcon icon={<Settings />} label="Config" id="settings" current={activeModule} set={setActiveModule} theme={currentTheme} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NavIcon({ icon, label, id, current, set, theme, disabled }) {
  const active = current === id;
  if (disabled) return null;
  return (
    <button onClick={() => set(id)} className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 cursor-pointer ${active ? theme.accent + ' scale-110 -translate-y-1' : 'text-slate-600 hover:text-slate-400'}`}>
      {React.cloneElement(icon, { size: active ? 22 : 20, className: active ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]' : '' })}
      <span className={`text-[8px] font-black uppercase tracking-tighter transition-opacity ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    </button>
  );
}

function AppGridIcon({ icon, name, onClick, theme, color, alert, disabled }) {
  if (disabled) return null;
  return (
    <button onClick={onClick} className={`${theme.cardItem} flex flex-col items-center justify-center gap-2 hover:bg-zinc-700/50 transition-all active:scale-95 relative cursor-pointer shadow-lg aspect-square`}>
      <div className={`${color} drop-shadow-[0_0_5px_currentColor]`}>{React.cloneElement(icon, { size: 28 })}</div>
      <span className="text-[9px] font-black text-white uppercase tracking-tight">{name}</span>
      {alert && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></span>}
    </button>
  );
}