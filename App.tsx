
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Home, 
  Sparkles, 
  Plus, 
  GitGraph, 
  User, 
  Feather, 
  Wind,
  Search,
  MoreHorizontal,
  X,
  Share2,
  Maximize2,
  LayoutGrid,
  Calendar,
  Folder,
  ChevronRight,
  Mic,
  Camera,
  Image as ImageIcon,
  PenTool,
  Scroll,
  Trophy,
  History,
  CheckCircle2,
  Circle,
  Zap,
  Lightbulb,
  Heart,
  Bookmark,
  Trash2,
  Settings,
  Globe,
  Droplets,
  Cloud
} from 'lucide-react';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import * as d3 from 'd3';
import { AppTab, Inspiration, GraphNode, GraphLink, ViewMode, CaptureMode, Challenge, SocialPost } from './types';
import { MOCK_INSPIRATIONS, DAILY_WISDOM, MOCK_CHALLENGES, MOCK_SOCIAL_POSTS } from './constants';
import { analyzeInspiration, expandInspiration, generateConnections } from './services/geminiService';

// --- Visual Background Component ---
const BackgroundCanvas = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-moon-white pointer-events-none">
             {/* Noise Texture is handled in index.html styles */}
             <div className="bg-noise"></div>

             {/* Animated Ink/Mist Blobs */}
             <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-radial from-stone-200/40 to-transparent rounded-full blur-[80px] animate-mist-flow opacity-60"></div>
             <div className="absolute bottom-[10%] right-[-20%] w-[400px] h-[400px] bg-gradient-radial from-emerald-50/40 to-transparent rounded-full blur-[60px] animate-pulse-slow opacity-50"></div>
             <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-gradient-radial from-stone-100/50 to-transparent rounded-full blur-[50px] animate-float-slow opacity-40" style={{animationDelay: '2s'}}></div>
        </div>
    )
}

// --- Splash Screen Component ---
const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadingOut(true);
      setTimeout(onFinish, 800); // Wait for fade out animation
    }, 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-[100] bg-moon-white flex flex-col items-center justify-between py-20 transition-opacity duration-1000 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <BackgroundCanvas />
        
        {/* Top Space */}
        <div className="flex-1"></div>

        {/* Center Logo Area */}
        <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Stacked Stones Animation */}
            <div className="flex flex-col items-center gap-1 mb-12">
               {/* Top Stone */}
               <div className="w-8 h-6 bg-ink-black rounded-[40%_60%_60%_40%/50%_50%_50%_50%] animate-[fadeIn_1s_ease-out_0.5s_backwards] relative shadow-lg transform rotate-[-5deg]"></div>
               {/* Middle Stone */}
               <div className="w-14 h-9 bg-ink-black rounded-[50%_50%_40%_60%/60%_40%_60%_40%] animate-[fadeIn_1s_ease-out_0.8s_backwards] relative shadow-lg -mt-2 transform rotate-[2deg]"></div>
               {/* Bottom Stone */}
               <div className="w-20 h-10 bg-ink-black rounded-[60%_40%_50%_50%/50%_60%_40%_60%] animate-[fadeIn_1s_ease-out_1.1s_backwards] relative shadow-lg -mt-3"></div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-serif tracking-[0.5em] text-stone-800 ml-4 animate-[fadeIn_1.5s_ease-out_1.5s_backwards]">
               心 笺
            </h1>
            <p className="text-[10px] text-stone-400 tracking-[0.4em] uppercase mt-4 animate-[fadeIn_1.5s_ease-out_1.8s_backwards] font-serif">
               M O O O O L I
            </p>
        </div>

        {/* Bottom Space / Poem */}
        <div className="flex-1 flex flex-col justify-end items-center z-10 pb-10">
           <div className="space-y-3 text-center opacity-60 animate-[fadeIn_2s_ease-out_2.2s_backwards]">
              <p className="text-[11px] text-stone-600 font-serif tracking-widest">行到水穷处</p>
              <p className="text-[11px] text-stone-600 font-serif tracking-widest">坐看云起时</p>
              <div className="w-0.5 h-8 bg-stone-300 mx-auto mt-2 opacity-50"></div>
              <p className="text-[9px] text-stone-400 font-serif tracking-[0.2em] pt-2">© 轻 颂 雅 意</p>
           </div>
        </div>
    </div>
  );
};

// --- Components ---

// 1. Navigation Bar with Speed Dial
const BottomNav = ({ activeTab, onTabChange, onCapture }: { activeTab: AppTab, onTabChange: (t: AppTab) => void, onCapture: (mode: CaptureMode) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Updated styling for glassmorphism and subtle elegance
  const navItemClass = (tab: AppTab) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-500 ${activeTab === tab ? 'text-emerald-800 scale-105' : 'text-stone-400 hover:text-stone-600'}`;

  const handleCaptureClick = (mode: CaptureMode) => {
    setIsMenuOpen(false);
    onCapture(mode);
  };

  return (
    <>
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Floating Glass Nav */}
      <div className="absolute bottom-6 left-4 right-4 h-16 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 flex items-center justify-between px-6 z-50 shadow-glass">
        <button onClick={() => onTabChange(AppTab.Wall)} className={navItemClass(AppTab.Wall)}>
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[10px] tracking-widest font-serif">灵感</span>
        </button>
        <button onClick={() => onTabChange(AppTab.Insights)} className={navItemClass(AppTab.Insights)}>
          <Sparkles size={20} strokeWidth={1.5} />
          <span className="text-[10px] tracking-widest font-serif">洞察</span>
        </button>
        
        <div className="relative -top-6">
          {/* Speed Dial Menu items */}
          <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col gap-3 transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
             
             <button onClick={() => handleCaptureClick('voice')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-soft flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:scale-110 transition-all delay-75 group relative border border-white/50">
                <Mic size={18} strokeWidth={1.5} />
                <span className="absolute right-12 bg-stone-800/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-serif">语音</span>
             </button>
             
             <button onClick={() => handleCaptureClick('camera')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-soft flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:scale-110 transition-all delay-50 group relative border border-white/50">
                <Camera size={18} strokeWidth={1.5} />
                <span className="absolute right-12 bg-stone-800/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-serif">拍摄</span>
             </button>

             <button onClick={() => handleCaptureClick('album')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-soft flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:scale-110 transition-all delay-0 group relative border border-white/50">
                <ImageIcon size={18} strokeWidth={1.5} />
                <span className="absolute right-12 bg-stone-800/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-serif">相册</span>
             </button>
             
             <button onClick={() => handleCaptureClick('text')} className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full shadow-soft flex items-center justify-center text-stone-600 hover:text-emerald-800 hover:scale-110 transition-all delay-0 group relative border border-white/50">
                <PenTool size={18} strokeWidth={1.5} />
                <span className="absolute right-12 bg-stone-800/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-serif">文字</span>
             </button>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center text-moon-white shadow-float transition-all duration-500 ring-4 ring-white/30 z-50 ${isMenuOpen ? 'bg-stone-600 rotate-45' : 'bg-stone-800 rotate-0 hover:scale-105'}`}
          >
            <Plus size={26} strokeWidth={1.5} />
          </button>
        </div>

        <button onClick={() => onTabChange(AppTab.Connections)} className={navItemClass(AppTab.Connections)}>
          <GitGraph size={20} strokeWidth={1.5} />
          <span className="text-[10px] tracking-widest font-serif">关系</span>
        </button>
        <button onClick={() => onTabChange(AppTab.Profile)} className={navItemClass(AppTab.Profile)}>
          <User size={20} strokeWidth={1.5} />
          <span className="text-[10px] tracking-widest font-serif">我的</span>
        </button>
      </div>
    </>
  );
};

// 2. Inspiration Wall (Home)
const InspirationWall = ({ items, onSelect, viewMode }: { items: Inspiration[], onSelect: (id: string) => void, viewMode: ViewMode }) => {
  
  // -- Masonry Layout (Refined) --
  const renderMasonry = () => (
    <div className="columns-2 gap-4 space-y-4 animate-fade-in pb-32">
      {items.map((item, idx) => (
        <div 
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="break-inside-avoid bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-soft border border-white/60 hover:shadow-glass hover:bg-white/80 transition-all duration-700 cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Subtle watermark */}
          <div className="absolute top-[-10px] right-[-10px] w-12 h-12 bg-stone-100/50 rounded-full blur-xl"></div>
          
          {item.challengeId && (
            <div className="absolute top-3 left-3 flex items-center gap-1 opacity-60">
               <Scroll size={8} className="text-emerald-800" />
               <span className="text-[8px] text-emerald-800 uppercase tracking-wider font-serif">修习</span>
            </div>
          )}

          {item.imageUrl && (
             <div className="mb-3 overflow-hidden rounded-md opacity-90 group-hover:opacity-100 transition-opacity mt-4">
               <img src={item.imageUrl} alt="visual" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-1000 ease-out mix-blend-multiply" />
             </div>
          )}

          <p className={`font-serif text-sm text-stone-800 leading-7 mb-3 line-clamp-4 tracking-wide ${!item.imageUrl && !item.challengeId ? 'mt-0' : 'mt-2'}`}>
            {item.content}
          </p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {item.imagery.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] px-2 py-0.5 border border-stone-200/50 bg-stone-50/50 rounded-full text-stone-500 font-serif">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between opacity-30 group-hover:opacity-60 transition-opacity duration-500">
             <span className="text-[9px] text-stone-500 font-serif">{item.date.slice(5)}</span>
             {item.mood === 'peaceful' && <Wind size={10} />}
             {item.mood === 'melancholic' && <Droplets size={10} />}
             {item.mood === 'joyful' && <Sparkles size={10} />}
          </div>
        </div>
      ))}
    </div>
  );

  // -- Timeline Layout --
  const renderTimeline = () => {
    const sortedItems = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return (
      <div className="relative pl-6 py-4 animate-fade-in space-y-10 pb-32">
        {/* Continuous Line (Gradient Ink) */}
        <div className="absolute left-[35px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-stone-300 to-transparent opacity-50"></div>

        {sortedItems.map((item, idx) => (
          <div key={item.id} onClick={() => onSelect(item.id)} className="relative flex gap-6 group cursor-pointer">
            {/* Time Node */}
            <div className="flex flex-col items-center min-w-[20px]">
               <div className="w-2.5 h-2.5 rounded-full bg-white border border-stone-300 z-10 group-hover:border-emerald-700 group-hover:scale-125 transition-all duration-500 mt-3 shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
               <div className="text-[9px] text-stone-400 mt-2 font-serif opacity-70 group-hover:opacity-100 transition-opacity">{item.date.slice(5)}</div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/60 backdrop-blur-sm p-5 rounded-lg border-l-2 border-l-stone-100 shadow-sm hover:border-l-emerald-800/40 hover:bg-white/80 transition-all duration-500">
               {item.imageUrl && (
                 <div className="mb-3 h-24 overflow-hidden rounded-sm relative">
                   <img src={item.imageUrl} alt="visual" className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" />
                 </div>
               )}
               <p className="font-serif text-sm text-stone-700 leading-relaxed line-clamp-2">
                 {item.content}
               </p>
               <div className="flex items-center gap-2 mt-3">
                 <div className="h-[1px] w-6 bg-stone-200/50"></div>
                 <span className="text-[10px] text-stone-400 font-serif tracking-wider">{item.tags[0] || '随想'}</span>
                 {item.challengeId && <Scroll size={10} className="text-emerald-800/50 ml-auto" />}
               </div>
            </div>
          </div>
        ))}
        
        <div className="flex justify-center pt-8">
            <span className="text-[10px] text-stone-300 tracking-[0.2em] font-serif">岁月如流</span>
        </div>
      </div>
    );
  };

  // -- Folder Layout --
  const renderFolders = () => {
    // Group by first tag
    const groups: Record<string, Inspiration[]> = {};
    items.forEach(item => {
      const tag = item.tags[0] || '未分类';
      if (!groups[tag]) groups[tag] = [];
      groups[tag].push(item);
    });

    return (
      <div className="animate-fade-in pt-4 pb-32 px-1">
        <div className="grid grid-cols-2 gap-5">
          {Object.entries(groups).map(([tag, groupItems], idx) => (
            <div key={tag} className="aspect-square bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center justify-center relative cursor-pointer hover:shadow-float hover:bg-white/70 transition-all duration-700 group">
               {/* Moon Gate Effect */}
               <div className="w-24 h-24 rounded-full border border-stone-100/50 bg-stone-50/30 flex items-center justify-center overflow-hidden mb-3 relative group-hover:scale-105 transition-transform duration-1000 shadow-inner">
                  {/* Abstract visualization inside moon gate */}
                  <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-stone-400 to-transparent"></div>
                  <div className="text-2xl font-serif text-stone-400 font-light italic">{groupItems.length}</div>
               </div>
               
               <h3 className="text-sm font-serif text-stone-600 tracking-widest z-10">{tag}</h3>
               <div className="w-4 h-[1px] bg-stone-300/50 mt-2 group-hover:w-8 transition-all duration-700"></div>
            </div>
          ))}
        </div>
        
        {/* Simple list of items below the grid for accessibility in this demo */}
        <div className="mt-12 space-y-8 px-2">
           {Object.entries(groups).map(([tag, groupItems]) => (
             <div key={tag + '-list'}>
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-1 h-3 bg-emerald-800/30 rounded-full"></div>
                 <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-serif">{tag}</h4>
               </div>
               <div className="space-y-4 pl-3 border-l border-stone-100">
                 {groupItems.map(item => (
                   <div key={item.id} onClick={() => onSelect(item.id)} className="text-sm text-stone-600 font-serif hover:text-emerald-800 cursor-pointer py-1 truncate flex items-center gap-2 group">
                     {item.imageUrl ? <ImageIcon size={12} className="text-stone-300 group-hover:text-emerald-800/50"/> : <span className="w-3"></span>}
                     <span className="group-hover:translate-x-1 transition-transform duration-300">{item.content}</span>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto pt-4 px-5 scroll-smooth relative z-10 no-scrollbar">
      {/* Daily Wisdom (Only show on Masonry and Timeline) */}
      {viewMode !== 'folder' && (
        <div className="mb-10 mt-6 text-center space-y-3 p-6 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm mx-2">
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-800/50 tracking-[0.2em] font-serif">
             <div className="w-2 h-[1px] bg-emerald-800/30"></div>
             {DAILY_WISDOM.term}
             <div className="w-2 h-[1px] bg-emerald-800/30"></div>
          </div>
          <div className="font-serif text-lg text-stone-700 leading-relaxed tracking-wide">"{DAILY_WISDOM.quote}"</div>
          <div className="text-[10px] text-stone-400 font-serif">— {DAILY_WISDOM.author}</div>
        </div>
      )}

      {/* Render based on mode */}
      {viewMode === 'masonry' && renderMasonry()}
      {viewMode === 'timeline' && renderTimeline()}
      {viewMode === 'folder' && renderFolders()}
      
      <div className="text-center text-xs text-stone-300 mt-10 tracking-[0.3em] font-serif mb-10 pb-32">
        {viewMode === 'folder' ? '分类尽头' : '到底了'}
      </div>
    </div>
  );
};

// Social Wall Component
const SocialWall = () => {
  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);

  const toggleLike = (id: string) => {
    setPosts(posts.map(post => 
      post.id === id 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="h-full overflow-y-auto px-5 pt-6 pb-32 animate-fade-in no-scrollbar relative z-10">
      <div className="flex flex-col items-center mb-10">
        <span className="text-xs text-stone-400 tracking-[0.4em] font-serif">灵感回响</span>
        <div className="w-6 h-[1px] bg-stone-200 mt-3"></div>
      </div>

      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50 relative hover:shadow-float transition-all duration-700">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 ring-2 ring-white shadow-sm">
                  <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h4 className="text-sm font-serif text-stone-800">{post.author}</h4>
                   <p className="text-[10px] text-stone-400 font-serif">{post.date}</p>
                </div>
             </div>
             
             <p className="font-serif text-sm text-stone-700 leading-loose mb-5 tracking-wide">
                {post.content}
             </p>

             <div className="flex items-center justify-between border-t border-stone-100/50 pt-4">
                <div className="flex gap-2">
                   {post.tags.map(tag => (
                     <span key={tag} className="text-[9px] px-2 py-0.5 bg-stone-50 text-stone-400 rounded-full font-serif border border-stone-100">{tag}</span>
                   ))}
                </div>
                <div className="flex items-center gap-5">
                   <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 transition-colors ${post.isLiked ? 'text-rose-400' : 'text-stone-300 hover:text-stone-500'}`}>
                      <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} strokeWidth={1.5} />
                      <span className="text-xs font-serif">{post.likes}</span>
                   </button>
                   <button className="text-stone-300 hover:text-emerald-700 transition-colors">
                      <Bookmark size={16} strokeWidth={1.5} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Detail View Overlay
const DetailView = ({ item, onClose, onDelete }: { item: Inspiration, onClose: () => void, onDelete: (id: string) => void }) => {
  const [expandedText, setExpandedText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExpand = async () => {
    setLoading(true);
    const result = await expandInspiration(item.content);
    setExpandedText(result);
    setLoading(false);
  };

  const confirmDelete = () => {
     if(window.confirm("确定要让这个念头随风而去吗？")) {
         onDelete(item.id);
     }
  }

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-moon-white/95 backdrop-blur-xl flex flex-col animate-ink-spread">
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6">
        <button onClick={onClose} className="p-2 -ml-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-100/50 transition-colors">
          <X size={24} strokeWidth={1} />
        </button>
        <div className="flex gap-4">
           <button onClick={confirmDelete} className="p-2 text-stone-400 hover:text-red-400 transition-colors">
              <Trash2 size={20} strokeWidth={1} />
           </button>
           <Share2 size={20} strokeWidth={1} className="text-stone-400" />
           <MoreHorizontal size={20} strokeWidth={1} className="text-stone-400" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
        <div className="flex flex-col items-center mb-10 opacity-60">
           <span className="text-xs text-stone-500 tracking-[0.4em] font-serif mb-2">灵感印记</span>
           <div className="w-6 h-[1px] bg-stone-300"></div>
        </div>

        {item.imageUrl && (
            <div className="mb-10 w-full rounded-lg overflow-hidden shadow-float">
                <img src={item.imageUrl} alt="attached" className="w-full h-auto grayscale opacity-90 mix-blend-multiply" />
            </div>
        )}

        {item.challengeId && (
            <div className="mb-8 mx-auto px-5 py-1.5 border border-emerald-100/50 rounded-full inline-flex items-center gap-2 bg-emerald-50/30">
                <Scroll size={12} className="text-emerald-700/70" />
                <span className="text-[10px] text-emerald-800/70 uppercase tracking-widest font-serif">修习回应</span>
            </div>
        )}

        <p className="font-serif text-xl text-stone-800 leading-loose text-center mb-12 px-4">
          {item.content}
        </p>

        {/* AI Expansion Area */}
        <div className="bg-stone-50/50 backdrop-blur-md p-8 rounded-2xl border border-stone-100/60 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-100/40 to-transparent opacity-50"></div>
           
           {!expandedText ? (
             <div className="flex flex-col items-center justify-center py-4">
               <button 
                 onClick={handleExpand}
                 className="flex items-center gap-2 text-stone-400 text-sm hover:text-emerald-800 transition-colors font-serif"
                 disabled={loading}
               >
                 <Sparkles size={16} className={loading ? "animate-spin" : ""} />
                 {loading ? "寻觅词句..." : "AI 续写意境"}
               </button>
             </div>
           ) : (
             <div className="animate-fade-in">
                <p className="font-serif text-stone-600 text-sm leading-8 tracking-wide text-justify">
                   {expandedText}
                </p>
                <div className="mt-6 text-right">
                  <span className="text-[10px] text-stone-300 font-serif">心笺 AI 生成</span>
                </div>
             </div>
           )}
        </div>

        {/* Analysis Tags */}
        <div className="mt-12 grid grid-cols-2 gap-10 px-4">
           <div>
             <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4 font-serif">意象</h3>
             <div className="flex flex-wrap gap-2">
               {item.imagery.map(t => (
                 <span key={t} className="px-3 py-1 bg-white/60 border border-stone-100 rounded-full text-xs text-stone-500 font-serif shadow-sm">{t}</span>
               ))}
             </div>
           </div>
           <div>
             <h3 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-4 font-serif">心境</h3>
             <div className="flex items-center gap-3">
               <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${item.mood === 'peaceful' ? 'text-emerald-300 bg-emerald-300' : 'text-stone-400 bg-stone-400'}`}></div>
               <span className="text-sm text-stone-600 font-serif">{item.mood === 'peaceful' ? '宁静' : item.mood === 'melancholic' ? '忧郁' : item.mood === 'joyful' ? '欢愉' : '平淡'}</span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

// 4. Capture Modal (Multi-mode)
const CaptureModal = ({ mode, challenge, onClose, onSave }: { mode: CaptureMode, challenge?: Challenge, onClose: () => void, onSave: (text: string, image?: string) => void }) => {
  const [text, setText] = useState('');
  const [currentMode, setCurrentMode] = useState<CaptureMode>(mode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Specific state for voice
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
     if (mode === 'voice') {
         setIsListening(true);
         setTimeout(() => {
             setIsListening(false);
             setText("竹窗听雨，一任平生..."); // Simulated
             setCurrentMode('text');
         }, 3000);
     }
  }, [mode]);

  const handleSave = () => {
    if (!text.trim() && !capturedImage) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      onSave(text, capturedImage || undefined);
      setIsAnalyzing(false);
      onClose();
    }, 1200);
  };

  const handleImageSelect = (src: string) => {
      setCapturedImage(src);
      setCurrentMode('text');
  };

  const renderContent = () => {
      if (currentMode === 'voice' && isListening) {
          return (
              <div className="flex flex-col items-center justify-center h-full space-y-10 animate-fade-in">
                  <div className="w-28 h-28 rounded-full bg-stone-50 flex items-center justify-center relative shadow-inner">
                      <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-20"></div>
                      <Mic size={40} className="text-stone-500" strokeWidth={1} />
                  </div>
                  <p className="text-stone-400 font-serif animate-pulse tracking-widest">聆听风的声音...</p>
                  <button onClick={() => { setIsListening(false); setCurrentMode('text'); }} className="text-xs text-stone-400 border-b border-stone-200 pb-1 hover:text-stone-600 font-serif">停止</button>
              </div>
          );
      }

      if (currentMode === 'camera') {
          return (
              <div className="flex flex-col items-center h-full p-6 animate-fade-in">
                  <div className="w-full aspect-[3/4] bg-stone-900 rounded-2xl relative overflow-hidden flex items-center justify-center mb-8 shadow-2xl">
                      <div className="absolute inset-0 border-[0.5px] border-white/20 m-6"></div>
                      {/* Corner marks */}
                      <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-white/60"></div>
                      <div className="absolute top-6 right-6 w-4 h-4 border-t border-r border-white/60"></div>
                      <div className="absolute bottom-6 left-6 w-4 h-4 border-b border-l border-white/60"></div>
                      <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-white/60"></div>
                      
                      <p className="text-white/40 text-xs font-serif tracking-widest">取景</p>
                  </div>
                  <button 
                    onClick={() => handleImageSelect('https://picsum.photos/400/600?grayscale')} 
                    className="w-16 h-16 rounded-full border border-white shadow-float bg-white/10 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform"
                  >
                      <div className="w-12 h-12 bg-white rounded-full shadow-inner"></div>
                  </button>
              </div>
          );
      }

      if (currentMode === 'album') {
          return (
              <div className="h-full overflow-y-auto p-4 animate-fade-in no-scrollbar">
                  <h3 className="text-center text-stone-400 font-serif mb-8 tracking-[0.2em] text-xs">往日记忆</h3>
                  <div className="grid grid-cols-3 gap-2">
                      {[1,2,3,4,5,6,7,8,9].map(i => (
                          <div 
                             key={i} 
                             onClick={() => handleImageSelect(`https://picsum.photos/200/200?random=${i}&grayscale`)}
                             className="aspect-square bg-stone-100 rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          >
                              <img src={`https://picsum.photos/200/200?random=${i}&grayscale`} alt="album" className="w-full h-full object-cover opacity-80" />
                          </div>
                      ))}
                  </div>
              </div>
          );
      }

      // Default Text Mode
      return (
        <div className="flex-1 flex flex-col justify-center px-8 animate-fade-in">
            {challenge && (
                <div className="mb-10 p-5 bg-emerald-50/40 border border-emerald-100/40 rounded-xl text-center backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Scroll size={14} className="text-emerald-800/50"/>
                        <span className="text-[10px] text-emerald-800/50 uppercase tracking-[0.2em] font-serif">每日修习</span>
                    </div>
                    <p className="font-serif text-stone-700 italic tracking-wide">"{challenge.prompt}"</p>
                </div>
            )}
            
            {capturedImage && (
                <div className="w-32 h-32 mx-auto mb-8 rounded-lg overflow-hidden shadow-float relative group">
                    <img src={capturedImage} alt="captured" className="w-full h-full object-cover grayscale" />
                    <button onClick={() => setCapturedImage(null)} className="absolute top-2 right-2 bg-black/30 backdrop-blur text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                    </button>
                </div>
            )}
            <textarea
                placeholder={challenge ? "回应此刻..." : "捕捉一闪而过的念头..."}
                className="w-full bg-transparent text-2xl font-serif text-stone-800 placeholder-stone-300 resize-none outline-none leading-relaxed h-56 text-center"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus={(currentMode as string) === 'text'}
            />
            
            <div className="flex justify-center mt-8 gap-8 text-stone-300">
               <button onClick={() => setCurrentMode('text')} className={`${currentMode === 'text' ? 'text-stone-800' : ''} hover:text-stone-600 transition-colors`}><Feather size={22} strokeWidth={1}/></button>
               <button onClick={() => setCurrentMode('voice')} className="hover:text-stone-600 transition-colors"><Mic size={22} strokeWidth={1}/></button>
               <button onClick={() => setCurrentMode('album')} className="hover:text-stone-600 transition-colors"><ImageIcon size={22} strokeWidth={1}/></button>
               <button onClick={() => setCurrentMode('camera')} className="hover:text-stone-600 transition-colors"><Camera size={22} strokeWidth={1}/></button>
            </div>
        </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[70] bg-moon-white/95 backdrop-blur-2xl flex flex-col animate-ink-spread">
      <div className="flex justify-end p-6">
        <button onClick={onClose} className="p-3 text-stone-400 hover:text-stone-800 transition-colors">
          <X size={28} strokeWidth={1} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <div className="p-8 pb-12">
        {(currentMode as CaptureMode) === 'text' && (
            <button 
            onClick={handleSave}
            disabled={(!text.trim() && !capturedImage) || isAnalyzing}
            className="w-full h-14 bg-stone-800 text-moon-white font-serif text-lg tracking-[0.2em] rounded-xl shadow-float hover:bg-stone-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
            {isAnalyzing ? (
                <span className="animate-pulse">封存中...</span>
            ) : (
                "落笔封存"
            )}
            </button>
        )}
      </div>
    </div>
  );
};

// 5. Connection Graph (D3) - Enhanced
const ConnectionGraph = ({ data, onSaveGenerated }: { data: Inspiration[], onSaveGenerated: (text: string) => void }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<GraphNode | null>(null);
  const [brainstorming, setBrainstorming] = useState(false);
  const [extraNodes, setExtraNodes] = useState<GraphNode[]>([]);
  const [extraLinks, setExtraLinks] = useState<GraphLink[]>([]);

  // Reset extra nodes when data source changes significantly
  useEffect(() => {
    setExtraNodes([]);
    setExtraLinks([]);
  }, [data.length]);

  const handleBrainstorm = async () => {
    if (brainstorming) return;
    setBrainstorming(true);

    const connections = await generateConnections(data);
    
    // Create new temporary "Ghost Nodes"
    const newNodes: GraphNode[] = connections.map((c, i) => ({
      id: `generated-${Date.now()}-${i}`,
      label: c,
      type: 'generated',
      group: 2,
      val: 8,
      x: 0, 
      y: 0
    }));

    // Connect new nodes to random existing nodes
    const newLinks: GraphLink[] = newNodes.map(node => {
      const randomSource = data[Math.floor(Math.random() * data.length)];
      return {
        source: randomSource.id,
        target: node.id
      };
    });

    setExtraNodes(newNodes);
    setExtraLinks(newLinks);
    setBrainstorming(false);
  };

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    // Clear previous D3 elements
    d3.select(svgRef.current).selectAll("*").remove();

    // Prepare Data
    const baseNodes: GraphNode[] = data.map(d => ({ 
      id: d.id, 
      label: d.content, 
      type: 'inspiration',
      group: 1,
      val: 5,
      data: d
    }));

    const nodes: GraphNode[] = [...baseNodes, ...extraNodes];

    // Prepare Links
    let links: GraphLink[] = [];
    
    // Internal links
    data.forEach(source => {
      source.connections.forEach(targetId => {
        if(data.find(d => d.id === targetId)) {
          links.push({ source: source.id, target: targetId });
        }
      });
    });

    links = [...links, ...extraLinks];

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Definition for glowing filter
    const defs = svg.append("defs");
    const filter = defs.append("filter")
      .attr("id", "glow");
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40))
      .force("radial", d3.forceRadial(150, width / 2, height / 2).strength(0.08));

    // Draw Links
    const link = svg.append("g")
      .attr("stroke-opacity", 0.3)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.target.type === 'generated' ? "#C8B698" : "#a1a1aa")
      .attr("stroke-width", (d: any) => d.target.type === 'generated' ? 1.5 : 1)
      .attr("stroke-dasharray", (d: any) => d.target.type === 'generated' ? "4 4" : "none");

    // Draw Nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
        setActiveNode(d);
        event.stopPropagation();
      });

    // Node Circles
    node.append("circle")
      .attr("r", (d) => d.type === 'generated' ? 8 : 5)
      .attr("fill", (d) => d.type === 'generated' ? "#C8B698" : "#575757")
      .attr("fill-opacity", (d) => d.type === 'generated' ? 0.9 : 0.7)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("filter", (d) => d.type === 'generated' ? "url(#glow)" : "none");

    // Node Labels
    node.append("text")
      .text(d => d.label.length > 8 ? d.label.substring(0, 8) + '...' : d.label)
      .attr("x", 12)
      .attr("y", 4)
      .attr("font-family", "Noto Serif SC")
      .attr("font-size", "10px")
      .attr("fill", (d) => d.type === 'generated' ? "#b89e72" : "#a8a29e")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function drag(simulation: any) {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

  }, [data, extraNodes, extraLinks]);

  // Handle saving a generated node
  const handleSaveNode = () => {
    if (activeNode && activeNode.type === 'generated') {
      onSaveGenerated(activeNode.label);
      setExtraNodes(prev => prev.filter(n => n.id !== activeNode.id));
      setExtraLinks(prev => prev.filter(l => (l.target as any).id !== activeNode.id));
      setActiveNode(null);
    }
  };

  return (
    <div className="w-full h-full relative z-10" ref={wrapperRef} onClick={() => setActiveNode(null)}>
      {/* Header Info */}
      <div className="absolute top-8 left-6 z-10 pointer-events-none">
        <h2 className="text-xl font-serif text-stone-800">思维星图</h2>
        <p className="text-xs text-stone-400 mt-2 font-serif tracking-wide">
            {data.length} 个灵感 • {extraNodes.length > 0 ? `${extraNodes.length} 个回响` : '静谧'}
        </p>
      </div>

      {/* Brainstorm Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleBrainstorm(); }}
        disabled={brainstorming}
        className="absolute top-8 right-6 z-10 flex items-center gap-2 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-soft text-stone-600 border border-white/50 hover:text-emerald-800 transition-all active:scale-95 disabled:opacity-50"
      >
        <Sparkles size={14} className={brainstorming ? "animate-spin" : ""} />
        <span className="text-xs font-serif tracking-widest">
            {brainstorming ? "寻觅中..." : "神游"}
        </span>
      </button>

      {/* D3 Canvas */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Node Detail Popup */}
      {activeNode && (
          <div 
            className="absolute bottom-32 left-6 right-6 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-float border border-white/50 z-20 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] uppercase tracking-widest font-serif ${activeNode.type === 'generated' ? 'text-faint-gold' : 'text-stone-400'}`}>
                    {activeNode.type === 'generated' ? '稍纵即逝' : '已封存'}
                </span>
                <button onClick={() => setActiveNode(null)}><X size={16} className="text-stone-400" /></button>
              </div>
              <p className="font-serif text-lg text-stone-800 mb-6 leading-relaxed">{activeNode.label}</p>
              
              {activeNode.type === 'generated' ? (
                  <button 
                    onClick={handleSaveNode}
                    className="w-full py-3 bg-stone-800 text-moon-white text-xs tracking-[0.2em] hover:bg-stone-700 transition-colors rounded-lg font-serif"
                  >
                      捕捉此念
                  </button>
              ) : (
                  <div className="flex gap-2">
                      {activeNode.data?.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-1 bg-stone-100 text-stone-500 rounded-full font-serif">{tag}</span>
                      ))}
                  </div>
              )}
          </div>
      )}
    </div>
  );
};

// 6. Insights (Charts & Challenges)
const ChallengeHistory = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-moon-white z-[60] flex flex-col animate-fade-in">
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-100">
            <button onClick={onClose} className="p-2 -ml-2 text-stone-500 hover:text-stone-800">
                <ChevronRight className="rotate-180" size={24} strokeWidth={1} />
            </button>
            <span className="text-sm font-serif text-stone-800 tracking-widest">修习记录</span>
            <div className="w-8"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/30">
            {/* Streak Header */}
            <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-sm border border-stone-100 mb-8 flex items-center justify-between">
                <div>
                    <h3 className="text-3xl font-serif text-stone-800">12</h3>
                    <p className="text-xs text-stone-400 tracking-widest mt-1 font-serif">连续修习天数</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-50/50 flex items-center justify-center text-emerald-800">
                    <Trophy size={20} strokeWidth={1.5} />
                </div>
            </div>

            {/* History List */}
            <div className="space-y-4">
                {MOCK_CHALLENGES.slice(1).map(challenge => (
                    <div key={challenge.id} className="bg-white/60 p-5 rounded-xl border border-stone-100/50 flex gap-4 items-start hover:bg-white transition-colors">
                        <div className="mt-1">
                            {challenge.completed ? 
                                <CheckCircle2 size={16} className="text-emerald-700/70" /> : 
                                <Circle size={16} className="text-stone-300" />
                            }
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[10px] text-stone-400 font-serif">{challenge.date}</span>
                                <span className="text-[9px] px-2 py-0.5 border border-stone-200 rounded-full text-stone-400 font-serif">{challenge.theme}</span>
                            </div>
                            <h4 className="font-serif text-stone-700 text-sm mb-1">{challenge.title}</h4>
                            <p className="text-xs text-stone-500 line-clamp-2">{challenge.prompt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

const Insights = ({ onStartChallenge }: { onStartChallenge: (challenge: Challenge) => void }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  const dailyChallenge = MOCK_CHALLENGES[0];

  const data = [
    { name: '一', calm: 4, joy: 2 },
    { name: '二', calm: 3, joy: 1 },
    { name: '三', calm: 5, joy: 3 },
    { name: '四', calm: 2, joy: 4 },
    { name: '五', calm: 6, joy: 2 },
    { name: '六', calm: 4, joy: 5 },
    { name: '日', calm: 7, joy: 3 },
  ];

  const keywords = [
    { name: '风', count: 12 },
    { name: '月', count: 8 },
    { name: '雨', count: 6 },
    { name: '云', count: 5 },
  ];

  if (showHistory) {
      return <ChallengeHistory onClose={() => setShowHistory(false)} />;
  }

  return (
    <div className="h-full overflow-y-auto pb-32 px-6 pt-10 space-y-10 relative z-10 no-scrollbar">
      <div className="space-y-2">
        <h2 className="text-2xl font-serif text-stone-800">洞察</h2>
        <p className="text-sm text-stone-400 font-serif tracking-wide">观照内心山水。</p>
      </div>

      {/* Daily Challenge Card */}
      <div className="relative bg-stone-800 rounded-2xl shadow-float overflow-hidden text-moon-white group">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-900/40 rounded-full blur-2xl translate-y-10 -translate-x-10"></div>

         <div className="relative p-7 z-10">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <Scroll size={14} className="text-faint-gold" />
                    <span className="text-[10px] text-faint-gold uppercase tracking-[0.2em] font-serif">每日修习</span>
                </div>
                <button 
                  onClick={() => setShowHistory(true)}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                    <History size={18} strokeWidth={1.5} />
                </button>
            </div>

            <h3 className="font-serif text-xl italic leading-relaxed mb-8 text-stone-200 tracking-wide">
                "{dailyChallenge.prompt}"
            </h3>

            <div className="flex justify-between items-center mt-2">
                 <span className="text-[10px] text-stone-500 font-serif">主题: {dailyChallenge.theme}</span>
                 <button 
                   onClick={() => onStartChallenge(dailyChallenge)}
                   className="bg-moon-white/90 backdrop-blur text-stone-900 px-5 py-2.5 rounded-lg text-xs font-serif tracking-widest hover:bg-white transition-colors shadow-lg"
                 >
                    提笔
                 </button>
            </div>
         </div>
      </div>

      {/* Mood Trend */}
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 font-serif">情绪流变</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
               <XAxis dataKey="name" tick={{fontSize: 10, fill: '#a8a29e', fontFamily: 'Noto Serif SC'}} axisLine={false} tickLine={false} />
               <Tooltip 
                 contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'Noto Serif SC', fontSize: '12px' }}
                 itemStyle={{ color: '#575757' }}
               />
               <Line type="monotone" dataKey="calm" stroke="#647D68" strokeWidth={2} dot={false} activeDot={{r: 4, fill: '#647D68'}} />
               <Line type="monotone" dataKey="joy" stroke="#C8B698" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Imagery Frequency */}
      <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 font-serif">意象统计</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={keywords} layout="vertical">
               <XAxis type="number" hide />
               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', border: 'none', fontSize: '12px', fontFamily: 'Noto Serif SC' }} />
               <Bar dataKey="count" fill="#575757" radius={[0, 4, 4, 0]} barSize={16} background={{ fill: 'rgba(0,0,0,0.02)' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {keywords.map((k, i) => (
             <div key={k.name} className="flex justify-between text-xs text-stone-600 font-serif">
                <span>{k.name}</span>
                <span className="text-stone-400">{k.count}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Profile - Enhanced
const Profile = ({ totalInspirations }: { totalInspirations: number }) => {
    return (
        <div className="h-full overflow-y-auto pt-10 px-6 pb-32 relative z-10 no-scrollbar">
            
            {/* Header / Avatar */}
            <div className="flex flex-col items-center justify-center text-center mb-10">
                <div className="w-24 h-24 rounded-full bg-stone-100 mb-6 overflow-hidden relative border-4 border-white shadow-soft group cursor-pointer ring-1 ring-stone-100">
                     <div className="absolute inset-0 bg-stone-200/50 flex items-center justify-center text-stone-500 hover:scale-105 transition-transform">
                        <User size={32} strokeWidth={1} />
                     </div>
                </div>
                <h2 className="text-xl font-serif text-stone-800 mb-2 font-medium">吟游诗人</h2>
                <div className="flex items-center gap-2 text-stone-400">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                    <p className="text-[10px] uppercase tracking-widest font-serif">在线</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/50 text-center">
                    <div className="text-3xl font-serif text-stone-800 mb-2">{totalInspirations}</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest font-serif">灵感碎片</div>
                </div>
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-xl shadow-sm border border-white/50 text-center">
                    <div className="text-3xl font-serif text-stone-800 mb-2">24</div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-widest font-serif">入驻天数</div>
                </div>
            </div>

            {/* Spirit Totem */}
            <div className="bg-stone-800 rounded-2xl p-7 text-moon-white mb-8 relative overflow-hidden shadow-float">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-faint-gold" />
                            <span className="text-[10px] text-faint-gold uppercase tracking-[0.2em] font-serif">精神图腾</span>
                        </div>
                        <h3 className="text-2xl font-serif italic mb-2">静鹤</h3>
                        <p className="text-xs text-stone-400 font-serif">向往孤绝与高远之地。</p>
                    </div>
                    <Feather size={48} strokeWidth={0.5} className="text-stone-600 opacity-80" />
                </div>
                {/* Minimal viz bar */}
                <div className="mt-8 flex gap-1 h-1">
                    <div className="w-2/3 bg-emerald-700/50 rounded-full"></div>
                    <div className="w-1/3 bg-stone-600/50 rounded-full"></div>
                </div>
            </div>
            
            {/* Menu Options */}
            <div className="space-y-3">
                <button className="w-full py-4 px-6 bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl flex items-center justify-between text-stone-600 hover:bg-white/80 transition-colors group">
                    <div className="flex items-center gap-4">
                        <Settings size={18} className="text-stone-400 group-hover:text-stone-600" />
                        <span className="text-sm font-serif">偏好设置</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                </button>
                <button className="w-full py-4 px-6 bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl flex items-center justify-between text-stone-600 hover:bg-white/80 transition-colors group">
                    <div className="flex items-center gap-4">
                        <Scroll size={18} className="text-stone-400 group-hover:text-stone-600" />
                        <span className="text-sm font-serif">导出灵感集</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300" />
                </button>
                <button className="w-full py-4 px-6 bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-xl flex items-center justify-between text-stone-600 hover:bg-white/80 transition-colors group">
                    <div className="flex items-center gap-4">
                        <Globe size={18} className="text-stone-400 group-hover:text-stone-600" />
                        <span className="text-sm font-serif">语言</span>
                    </div>
                    <span className="text-xs text-stone-400 font-serif">中文</span>
                </button>
            </div>

            <div className="mt-12 text-center">
                <p className="text-[10px] text-stone-300 uppercase tracking-widest font-serif">心笺 v1.0.4</p>
            </div>
        </div>
    )
}

// --- Main App Logic ---

export default function App() {
  const [loading, setLoading] = useState(true); // Splash state
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Wall);
  const [wallSection, setWallSection] = useState<'mine' | 'circle'>('mine'); 
  const [captureMode, setCaptureMode] = useState<CaptureMode | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | undefined>(undefined);
  const [selectedInspirationId, setSelectedInspirationId] = useState<string | null>(null);
  const [inspirations, setInspirations] = useState<Inspiration[]>(MOCK_INSPIRATIONS);
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');

  const handleCapture = async (text: string, imageUrl?: string) => {
    // Basic optimistic UI update
    const analysis = await analyzeInspiration(text);
    
    const newInspiration: Inspiration = {
      id: Date.now().toString(),
      content: text,
      date: new Date().toISOString().split('T')[0],
      tags: analysis.tags || [],
      mood: (analysis.mood as any) || 'neutral',
      imagery: analysis.imagery || [],
      imageUrl: imageUrl,
      connections: [],
      challengeId: activeChallenge?.id
    };

    setInspirations(prev => [newInspiration, ...prev]);
    setActiveChallenge(undefined);
  };

  const handleDelete = (id: string) => {
      setInspirations(prev => prev.filter(item => item.id !== id));
      setSelectedInspirationId(null);
  };

  const startChallenge = (challenge: Challenge) => {
      setActiveChallenge(challenge);
      setCaptureMode('text');
  };

  const toggleViewMode = () => {
    setViewMode(current => {
      if (current === 'masonry') return 'timeline';
      if (current === 'timeline') return 'folder';
      return 'masonry';
    });
  };

  const ViewToggleIcon = useMemo(() => {
    switch (viewMode) {
      case 'masonry': return LayoutGrid;
      case 'timeline': return Calendar;
      case 'folder': return Folder;
      default: return LayoutGrid;
    }
  }, [viewMode]);

  const selectedItem = inspirations.find(i => i.id === selectedInspirationId);

  return (
    <div className="relative w-full h-full flex flex-col font-serif text-stone-800">
      
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}

      {/* Dynamic Background */}
      <BackgroundCanvas />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative z-10 bg-transparent">
        {activeTab === AppTab.Wall && (
          <div className="h-full flex flex-col animate-fade-in">
             {/* Header with Circle Toggle */}
             <div className="h-20 flex items-center justify-between px-6 sticky top-0 bg-white/70 backdrop-blur-md z-20 border-b border-stone-100/50 shadow-sm transition-all">
                
                {/* Left Action */}
                <div className="w-10">
                    {wallSection === 'mine' && (
                        <button 
                            onClick={toggleViewMode} 
                            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-white/50 rounded-full transition-all active:scale-95"
                        >
                            <ViewToggleIcon size={20} strokeWidth={1.5} />
                        </button>
                    )}
                </div>

                {/* Center Toggle (Mine / Circle) */}
                <div className="flex items-center gap-8 relative">
                    <button 
                       onClick={() => setWallSection('mine')}
                       className={`text-sm font-serif tracking-widest transition-all duration-300 ${wallSection === 'mine' ? 'text-stone-800 font-bold scale-105' : 'text-stone-400'}`}
                    >
                        我的灵感
                    </button>
                    <div className="w-[1px] h-3 bg-stone-300/50"></div>
                    <button 
                       onClick={() => setWallSection('circle')}
                       className={`text-sm font-serif tracking-widest transition-all duration-300 ${wallSection === 'circle' ? 'text-stone-800 font-bold scale-105' : 'text-stone-400'}`}
                    >
                        灵感圈
                    </button>
                </div>

                {/* Right Action */}
                <div className="w-10 flex justify-end">
                    <button className="p-2 text-stone-400 hover:text-stone-800 hover:bg-white/50 rounded-full transition-all">
                        <Search size={20} strokeWidth={1.5} />
                    </button>
                </div>
             </div>

             {/* Content Switching */}
             {wallSection === 'mine' ? (
                 <InspirationWall items={inspirations} onSelect={setSelectedInspirationId} viewMode={viewMode} />
             ) : (
                 <SocialWall />
             )}
          </div>
        )}
        
        {activeTab === AppTab.Insights && (
          <div className="h-full animate-fade-in">
             <Insights onStartChallenge={startChallenge} />
          </div>
        )}

        {activeTab === AppTab.Connections && (
          <div className="h-full animate-fade-in">
             <ConnectionGraph 
               data={inspirations} 
               onSaveGenerated={handleCapture}
             />
          </div>
        )}

        {activeTab === AppTab.Profile && (
            <div className="h-full animate-fade-in">
                <Profile totalInspirations={inspirations.length} />
            </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onCapture={(mode) => { setActiveChallenge(undefined); setCaptureMode(mode); }} 
      />

      {/* Modals */}
      {captureMode && (
        <CaptureModal 
          mode={captureMode}
          challenge={activeChallenge}
          onClose={() => { setCaptureMode(null); setActiveChallenge(undefined); }} 
          onSave={handleCapture} 
        />
      )}

      {selectedItem && (
        <DetailView 
          item={selectedItem} 
          onClose={() => setSelectedInspirationId(null)} 
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}
