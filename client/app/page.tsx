import { Brain, Activity, ShieldCheck, Zap, ArrowRight, Microscope, Target } from 'lucide-react';
import Link from 'next/link';

const CoolBrainIllustration = () => (
  <div className="relative w-full h-full min-h-[550px] flex items-center justify-center select-none">
    {/* Deep Atmospheric Glows */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-500/10 blur-[80px] rounded-full animate-pulse"></div>

    <svg viewBox="0 0 800 600" className="relative z-10 w-full h-full drop-shadow-2xl">
      <defs>
        <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="brainCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rotating Scanning Rings */}
      <g className="animate-spin-slow" style={{ transformOrigin: '400px 300px' }}>
        <circle cx="400" cy="300" r="220" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="20 40" opacity="0.3" />
        <circle cx="400" cy="300" r="240" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="5 15" opacity="0.2" />
      </g>
      <g className="animate-spin-reverse-slow" style={{ transformOrigin: '400px 300px' }}>
        <circle cx="400" cy="300" r="200" fill="none" stroke="url(#neuralGrad)" strokeWidth="1" strokeDasharray="80 120" opacity="0.4" />
      </g>

      {/* Main Brain Structure - Sophisticated Silhouette */}
      <g filter="url(#neonGlow)">
        {/* Left Hemisphere */}
        <path
          d="M400,120 C320,120 250,180 250,280 C250,380 320,480 400,480 L400,120 Z"
          fill="white" fillOpacity="0.05"
          stroke="url(#neuralGrad)" strokeWidth="3" strokeLinecap="round"
        />
        {/* Right Hemisphere */}
        <path
          d="M400,120 C480,120 550,180 550,280 C550,380 480,480 400,480 L400,120 Z"
          fill="white" fillOpacity="0.05"
          stroke="url(#neuralGrad)" strokeWidth="3" strokeLinecap="round"
        />

        {/* Internal Neural Network Lines */}
        <path d="M300,280 Q350,200 400,200" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
        <path d="M350,380 Q400,350 450,380" fill="none" stroke="#818cf8" strokeWidth="1.5" opacity="0.4" />
        <path d="M500,280 Q450,200 400,200" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.4" />
        <path d="M400,150 Q450,250 400,450" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Pulsing Synaptic Nodes */}
      <g>
        {[
          { x: 320, y: 220, r: 4, color: '#3b82f6', d: '0s' },
          { x: 480, y: 220, r: 4, color: '#6366f1', d: '0.5s' },
          { x: 400, y: 180, r: 5, color: '#8b5cf6', d: '1.2s' },
          { x: 300, y: 320, r: 6, color: '#60a5fa', d: '0.8s' },
          { x: 500, y: 320, r: 6, color: '#818cf8', d: '2s' },
          { x: 400, y: 420, r: 4, color: '#3b82f6', d: '1.5s' },
          { x: 350, y: 400, r: 3, color: '#6366f1', d: '0.3s' },
          { x: 450, y: 400, r: 3, color: '#8b5cf6', d: '1.8s' },
        ].map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r={node.r} fill={node.color} filter="url(#neonGlow)">
            <animate attributeName="opacity" values="1;0.2;1" dur="2s" begin={node.d} repeatCount="indefinite" />
            <animate attributeName="r" values={`${node.r};${node.r + 2};${node.r}`} dur="2s" begin={node.d} repeatCount="indefinite" />
          </circle>
        ))}
      </g>

      {/* Floating Modern UI Data Cards */}
      <g transform="translate(560, 150)" className="animate-float-slow">
        <rect width="160" height="56" rx="16" fill="white" className="shadow-lg" />
        <circle cx="28" cy="28" r="14" fill="#dcfce7" />
        <path d="M23 28l3 3 5-5" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="52" y="24" fontSize="10" fontWeight="900" fill="#94a3b8" fontFamily="sans-serif" letterSpacing="1">ANALYSIS</text>
        <text x="52" y="40" fontSize="14" fontWeight="900" fill="#1e293b" fontFamily="sans-serif">NORMAL</text>
      </g>

      <g transform="translate(100, 260)" className="animate-float">
        <rect width="140" height="56" rx="16" fill="white" className="shadow-lg" />
        <circle cx="28" cy="28" r="14" fill="#eff6ff" />
        <path d="M22 28h12 M28 22v12" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="52" y="24" fontSize="10" fontWeight="900" fill="#94a3b8" fontFamily="sans-serif" letterSpacing="1">ACCURACY</text>
        <text x="52" y="40" fontSize="14" fontWeight="900" fill="#2563eb" fontFamily="sans-serif">99.21%</text>
      </g>

      <g transform="translate(520, 420)" className="animate-float-delayed">
        <rect width="180" height="64" rx="18" fill="white" className="shadow-lg" />
        <rect x="15" y="15" width="34" height="34" rx="10" fill="#fef2f2" />
        <path d="M24 32l4 4 8-8" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="60" y="28" fontSize="10" fontWeight="900" fill="#94a3b8" fontFamily="sans-serif" letterSpacing="1">SCAN STATUS</text>
        <text x="60" y="46" fontSize="15" fontWeight="900" fill="#1e293b" fontFamily="sans-serif">PROCESSING</text>
      </g>

      {/* Kinetic Data Particles */}
      {[...Array(6)].map((_, i) => (
        <circle key={i} r="2.5" fill="white" filter="url(#neonGlow)">
          <animateMotion
            path={`M400,300 C${300 + i * 30},${200 + i * 20} ${500 - i * 20},${400 + i * 10} ${600},${300}`}
            dur={`${3 + i}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  </div>
);

const LandingPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Navigation - Made slightly more compact */}
      <nav className="fixed w-full z-50 glass-morphism py-3 px-6 md:px-12 flex justify-between items-center border-b border-gray-100/50 backdrop-blur-md bg-white/80">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200 hover:rotate-3 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">
            NeuroScan<span className="text-blue-600">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition-colors">Features</a>
          <Link href="/login" className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">Sign In</Link>
          <Link href="/signup" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
            GET STARTED
          </Link>
        </div>
      </nav>

      {/* Hero Section - Reduced top padding and text sizes */}
      <section className="pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-center lg:text-left z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Next-Gen Brain Analysis</span>
            </div>

            {/* H1 scaled down from 8xl to 7xl/5xl */}
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[0.9] tracking-tighter">
              Clarity in every <span className="text-blue-600">Neuron.</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
              Experience clinical-grade MRI analysis at the speed of thought. Our advanced neural vision transforms complex scan data into actionable insights instantly.
            </p>

            {/* Buttons made tighter */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center lg:justify-start pt-2">
              <Link href="/signup" className="flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 group">
                START SCAN <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center justify-center bg-white border-2 border-gray-100 text-gray-700 px-8 py-4 rounded-2xl text-base font-black hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95">
                VIEW DEMO
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 md:flex relative hidden justify-center">
            {/* Kept illustration but removed extra scaling to fit better */}
            <div className="relative w-full max-w-lg">
              <CoolBrainIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Significantly reduced padding and card bulk */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Scientific Precision</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Intelligence for Imaging.</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-medium">Empowering diagnostics with state-of-the-art vision models.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Microscope className="text-blue-600 w-6 h-6" />, title: "Voxel Processing", desc: "Automated analysis of signal intensity and volumetric changes across T1, T2, and FLAIR." },
              { icon: <Target className="text-indigo-600 w-6 h-6" />, title: "Anomaly Detection", desc: "Pinpoint morphological variations and periventricular hyperintensities accurately." },
              { icon: <ShieldCheck className="text-green-500 w-6 h-6" />, title: "Secure Pipeline", desc: "Enterprise-level data isolation and HIPAA-ready processing ensures absolute privacy." }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-[32px] border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-blue-50 transition-all duration-300">
                  {f.icon}
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{f.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote - Reduced vertical height */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <Activity className="w-10 h-10 text-blue-500 mx-auto mb-8 animate-pulse" />
          <p className="text-2xl md:text-3xl font-black leading-snug italic opacity-95">
            &quot;NeuroScan AI represents the single most significant leap in preliminary radiological screening I&apos;ve seen in a decade.&quot;
          </p>
          <div className="mt-10 flex items-center justify-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center font-black text-blue-400 text-sm">AM</div>
            <div className="text-left">
              <p className="font-black text-base">Dr. Adrian Miller</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Director of Neuroradiology</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Compacted */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center pb-8 mb-8 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tight">NeuroScan AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">
              <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Compliance</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Status</a>
            </div>
          </div>
          <p className="text-center text-gray-300 font-black text-[10px] tracking-[0.2em] uppercase">
            © 2025 NEUROSCAN AI TECHNOLOGIES.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LandingPage;
