import { useState, useEffect, useRef } from 'react';
import { Mic, Moon, Star, Sparkles, Zap, Sun, Cloud, Heart, Eye, Volume2, VolumeX, ArrowUp, Facebook, Instagram, Linkedin, type LucideIcon } from 'lucide-react';
import backgroundImage from '../assets/edited background.png';
import { supabase } from '../lib/supabase';
import { useCounterAnimation } from '../hooks/useCounterAnimation';

interface SpiritualSymbol {
  x: number;
  icon: LucideIcon;
  duration: number;
  delay: number;
  size: number;
  fadePattern: number;
  startY: number;
}

function Home() {
  const [input, setInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([]);
  const [spiritualSymbols, setSpiritualSymbols] = useState<SpiritualSymbol[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { count: userCount, isAnimating } = useCounterAnimation({
    end: 42725,
    duration: 2500,
    delay: 500,
  });

  const heroMessages = [
    {
      heading: "🌟 Reflect with Wisdom",
      subtext: "Engage in calm, meaningful conversations that heal and guide."
    },
    {
      heading: "💖 Grow with Empathy",
      subtext: "Understand emotions deeply and nurture compassion through dialogue."
    },
    {
      heading: "🌱 Evolve with Purpose",
      subtext: "Build daily habits of gratitude, balance, and personal transformation."
    },
    {
      heading: "🌍 Unite with Harmony",
      subtext: "Embrace global wisdom to foster peace, tolerance, and shared values."
    },
    {
      heading: "🛡️ Trust with Ethics",
      subtext: "Experience AI designed for safety, dignity, and emotional wellbeing."
    }
  ];

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://cdn1.suno.ai/5fc0cd43-cd4c-47d8-90b5-0604db6f05f8.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;

      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        alert('Failed to load audio. Please check your internet connection.');
      });

      audioRef.current.addEventListener('playing', () => {
        console.log('Audio is playing');
        setIsPlaying(true);
      });

      audioRef.current.addEventListener('pause', () => {
        console.log('Audio is paused');
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Audio started successfully');
      }).catch(err => {
        console.error('Play error:', err);
        alert('Could not play audio: ' + err.message);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    const starCount = 100;
    const generatedStars = Array.from({ length: starCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
    setStars(generatedStars);

    const icons = [Moon, Star, Sparkles, Zap, Sun, Cloud, Heart, Eye];
    const symbolCount = 10;
    const generatedSymbols = Array.from({ length: symbolCount }, () => ({
      x: 5 + Math.random() * 90,
      icon: icons[Math.floor(Math.random() * icons.length)],
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 15,
      size: 24 + Math.random() * 28,
      fadePattern: Math.random(),
      startY: -50 - Math.random() * 100
    }));
    setSpiritualSymbols(generatedSymbols);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % heroMessages.length);
        setIsTransitioning(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, heroMessages.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVoiceClick = () => {
    console.log('Voice input activated');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput.trim()) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const userAgent = navigator.userAgent;
      let ipAddress = null;

      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip;
      } catch (ipError) {
        console.log('Could not fetch IP address');
      }

      const { error } = await supabase
        .from('waitlist')
        .insert([{
          email: emailInput.trim(),
          user_agent: userAgent,
          ip_address: ipAddress
        }]);

      if (error) {
        if (error.code === '23505') {
          setSubmitMessage('You\'re already on the waitlist! ✨');
        } else {
          setSubmitMessage('Something went wrong. Please try again.');
        }
      } else {
        setSubmitMessage('💫 Welcome to WiWi! You\'ve taken the first step into a world where AI listens, reflects, and uplifts.');
        setEmailInput('');
      }
    } catch (err) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27] via-[#1a1b3e] to-[#2d1b4e] opacity-50" />

      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1b3e]/50 via-[#2d1b4e]/40 to-[#4a2c5e]/30" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,14,39,0.3)_70%,rgba(10,14,39,0.6)_100%)]" />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {spiritualSymbols.map((symbol, i) => {
          const IconComponent = symbol.icon;
          const maxOpacity = 0.12 + symbol.fadePattern * 0.08;
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${symbol.x}%`,
                top: `${symbol.startY}px`,
                animation: `fall-${i % 3} ${symbol.duration}s linear infinite`,
                animationDelay: `${symbol.delay}s`,
              }}
            >
              <IconComponent
                size={symbol.size}
                strokeWidth={1.2}
                className="text-purple-300"
                style={{
                  opacity: maxOpacity,
                  filter: `drop-shadow(0 0 ${4 + symbol.fadePattern * 4}px rgba(167, 139, 250, 0.3))`,
                  animation: `fade-pulse-${i % 3} ${symbol.duration}s ease-in-out infinite`,
                  animationDelay: `${symbol.delay}s`
                }}
              />
            </div>
          );
        })}
      </div>

      <svg className="absolute top-0 right-0 pointer-events-none" width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g className="animate-shimmer" filter="url(#glow)">
          <line x1="50" y1="80" x2="100" y2="50" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="100" y1="50" x2="170" y2="70" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="170" y1="70" x2="230" y2="100" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="230" y1="100" x2="270" y2="70" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="270" y1="70" x2="330" y2="80" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />

          <line x1="50" y1="80" x2="30" y2="150" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="30" y1="150" x2="70" y2="210" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="70" y1="210" x2="150" y2="240" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="150" y1="240" x2="230" y2="210" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="230" y1="210" x2="270" y2="150" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="270" y1="150" x2="330" y2="80" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />

          <line x1="170" y1="70" x2="190" y2="130" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
          <line x1="190" y1="130" x2="230" y2="100" stroke="#a78bfa" strokeWidth="1.5" opacity="0.15" />
        </g>
      </svg>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center">
          <h1 className="text-6xl font-black tracking-tighter text-white text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800 }}>
            WiWi
          </h1>
          <p className="text-sm font-light tracking-wider text-purple-300/40 -mt-0.5 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            AI for Humanity
          </p>
        </div>
      </div>

      <div className="absolute top-44 left-1/2 -translate-x-1/2 z-20 w-full max-w-5xl px-4">
        <div className="flex flex-col items-center">
          <div className={`mb-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg transition-all duration-700 ${
            isAnimating ? 'animate-badge-entrance' : ''
          }`}>
            <span className={`text-purple-600 font-bold text-sm tabular-nums transition-all duration-300 ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}>
              {userCount.toLocaleString()}+
            </span>
            <span className="text-gray-700 text-xs">users Worldwide</span>
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-purple-400 border border-white"></div>
              <div className="w-4 h-4 rounded-full bg-pink-400 border border-white"></div>
              <div className="w-4 h-4 rounded-full bg-blue-400 border border-white"></div>
              <div className="w-4 h-4 rounded-full bg-orange-400 border border-white"></div>
            </div>
          </div>

          <div
            className="relative min-h-[140px] flex flex-col items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`${isTransitioning ? 'animate-fadeOutToRight' : 'animate-fadeInFromLeft'}`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-3 leading-tight">
                {heroMessages[currentMessageIndex].heading}
              </h2>
            </div>

            <div className={`${isTransitioning ? 'animate-fadeOutToLeft' : 'animate-fadeInFromRight'}`}>
              <p className="text-center text-purple-100/80 text-lg md:text-xl max-w-2xl leading-relaxed">
                {heroMessages[currentMessageIndex].subtext}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={toggleAudio}
        className="absolute top-8 left-8 z-20 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-md border border-purple-400/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(167,139,250,0.5)]"
        title={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-purple-300" />
        ) : (
          <VolumeX className="w-5 h-5 text-purple-300" />
        )}
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-8 max-w-2xl w-full" style={{ marginTop: '400px' }}>
          <button
            onClick={handleVoiceClick}
            className="group relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-md border border-purple-400/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(167,139,250,0.6)] animate-pulse-glow"
          >
            <Mic className="w-8 h-8 text-purple-300 group-hover:text-purple-100 transition-colors" />
            <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl group-hover:bg-purple-400/40 transition-all" />
          </button>

          <p className="text-center text-purple-100/70 text-lg font-light leading-relaxed max-w-xl px-4 mt-8">
            You've entered a space of calm and clarity. Here, every question echoes through the cosmos — and WiWi listens with wisdom, empathy, and light.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the universe through WiWi…"
                className="w-full px-6 py-4 bg-black/30 backdrop-blur-md border border-purple-400/30 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/60 focus:shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all font-light text-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-purple-500/20 to-violet-600/20 backdrop-blur-md border border-purple-400/30 rounded-2xl text-purple-100 font-light text-lg tracking-wide hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(167,139,250,0.4)] transition-all duration-300 hover:scale-[1.02]"
            >
              Get Response
            </button>
          </form>

          <div className="w-full max-w-5xl mt-16 px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
              The State of Our Minds
            </h2>
            <p className="text-center text-purple-200/80 text-lg mb-12 leading-relaxed">
              Despite progress, loneliness and confusion are rising, here's the reality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-purple-300/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-black text-purple-400 mb-4">67%</div>
                <p className="text-purple-200/70 text-base leading-tight">
                  feel their lives are not "thriving" or fulfilling
                </p>
                <p className="text-white text-xs italic mt-2">
                  Source: World Happiness Report 2024
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-purple-300/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-black text-purple-400 mb-4">33%</div>
                <p className="text-purple-200/70 text-base leading-tight">
                  regularly experience loneliness or disconnection
                </p>
                <p className="text-white text-xs italic mt-2">
                  Source: OECD Global Loneliness Data 2024
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-purple-300/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-black text-purple-400 mb-4">62%</div>
                <p className="text-purple-200/70 text-base leading-tight">
                  say they're unsatisfied or disengaged at work
                </p>
                <p className="text-white text-xs italic mt-2">
                  Source: ManpowerGroup Global Talent Barometer 2025
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              <div className="bg-white/5 backdrop-blur-sm border border-purple-300/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-black text-purple-400 mb-4">50%</div>
                <p className="text-purple-200/70 text-base leading-tight">
                  are not highly satisfied with their jobs overall
                </p>
                <p className="text-white text-xs italic mt-2">
                  Source: Pew Research Center 2024
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-purple-300/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl font-black text-purple-400 mb-4">21%</div>
                <p className="text-purple-200/70 text-base leading-tight">
                  feel truly engaged and inspired in their workplace
                </p>
                <p className="text-white text-xs italic mt-2">
                  Source: Gallup State of the Global Workplace 2024
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-2xl font-semibold text-purple-200">
                🌙 The universe is listening.
              </p>
              <p className="text-xl text-purple-300/80">
                Are you ready to follow the path it designed for you?
              </p>
            </div>

            <div className="mt-16 max-w-5xl mx-auto">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-black/30 backdrop-blur-md border border-purple-400/30 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400/60 focus:shadow-[0_0_20px_rgba(167,139,250,0.3)] transition-all font-light text-lg"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-gradient-to-r from-purple-500/30 to-violet-600/30 backdrop-blur-md border border-purple-400/40 rounded-2xl text-purple-100 font-medium text-base tracking-wide hover:border-purple-400/70 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Joining...' : '✨ Join the Waitlist'}
                </button>
              </form>

              {submitMessage && (
                <div className="mt-4 text-center animate-fadeInUp">
                  <p className={`font-light ${submitMessage.includes('wrong') ? 'text-red-300' : 'text-purple-200'}`} style={{ fontSize: '14px' }}>
                    {submitMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="h-[100px]"></div>
          </div>
        </div>
      </div>

      <footer className="w-full bg-black/40 backdrop-blur-md border-t border-purple-400/20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-purple-200/70 text-sm">
            <a href="#" className="hover:text-purple-300 transition-colors duration-300 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors duration-300 hover:underline">
              Term Of Service
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors duration-300 hover:underline">
              About
            </a>
            <a href="#" className="hover:text-purple-300 transition-colors duration-300 hover:underline">
              Contact
            </a>
            <a href="/waitlistadmin" className="hover:text-purple-300 transition-colors duration-300 hover:underline">
              Admin
            </a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-purple-200/70 hover:text-purple-300 transition-colors duration-300"
              aria-label="Facebook"
            >
              <Facebook size={20} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="text-purple-200/70 hover:text-purple-300 transition-colors duration-300"
              aria-label="Instagram"
            >
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a
              href="#"
              className="text-purple-200/70 hover:text-purple-300 transition-colors duration-300"
              aria-label="TikTok"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
            <a
              href="#"
              className="text-purple-200/70 hover:text-purple-300 transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
          </div>

          <div className="text-purple-200/70 text-sm">
            ©2025 All rights reserved.
          </div>
        </div>
      </footer>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-violet-600/30 backdrop-blur-md border border-purple-400/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_25px_rgba(167,139,250,0.6)] animate-fade-in"
          title="Scroll to top"
        >
          <ArrowUp className="w-6 h-6 text-purple-300" />
        </button>
      )}
    </div>
  );
}

export default Home;
