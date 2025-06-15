import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Play, 
  Plus, 
  Check, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Calendar,
  Clock,
  X,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Pause
} from 'lucide-react';

// Profile Selector Component
export const ProfileSelector = ({ onSelectUser }) => {
  const profiles = [
    { id: 1, name: 'John', avatar: 'https://images.pexels.com/photos/696407/pexels-photo-696407.jpeg', color: 'bg-blue-600' },
    { id: 2, name: 'Sarah', avatar: 'https://images.pexels.com/photos/7611741/pexels-photo-7611741.jpeg', color: 'bg-pink-600' },
    { id: 3, name: 'Mike', avatar: 'https://images.unsplash.com/photo-1643753072729-d54252008db0', color: 'bg-green-600' },
    { id: 4, name: 'Kids', avatar: 'https://images.unsplash.com/photo-1636337897543-83b55150608f', color: 'bg-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-white mb-8">Who's watching?</h1>
        <div className="flex gap-8 justify-center">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer text-center"
              onClick={() => onSelectUser(profile)}
            >
              <div className={`w-32 h-32 ${profile.color} rounded-lg mb-4 overflow-hidden`}>
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <p className="text-white text-xl font-medium">{profile.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Header Component
export const Header = ({ onSearch, searchQuery, setSearchQuery, user, onLogout }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-md' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
        >
          <h1 className="text-3xl font-bold text-red-600 mr-8">ULTRAFLIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="/" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="/movies" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="/tv-shows" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="/my-list" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </motion.div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 300, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSearch}
                  className="flex items-center bg-black border border-gray-600 rounded"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Titles, people, genres"
                    className="bg-transparent text-white px-4 py-2 w-full outline-none"
                    autoFocus
                  />
                  <button type="submit" className="p-2">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className="w-6 h-6 text-white" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded overflow-hidden">
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl"
                >
                  <div className="p-2">
                    <button
                      onClick={onLogout}
                      className="w-full text-left px-3 py-2 text-white hover:bg-gray-800 rounded"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// Hero Section Component
export const HeroSection = ({ content, onPlay, onToggleMyList, isInMyList }) => {
  if (!content) return null;

  const backdropUrl = content.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${content.backdrop_path}`
    : 'https://images.pexels.com/photos/193777/pexels-photo-193777.jpeg';

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight hero-title">
            {content.title || content.name}
          </h1>
          
          <div className="flex items-center space-x-4 mb-6 flex-wrap">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-white font-medium">{content.vote_average?.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300">
                {(content.release_date || content.first_air_date)?.split('-')[0]}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{content.estimatedRuntime}</span>
            </div>
            {content.has4K && (
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-glow">
                4K ULTRA HD
              </span>
            )}
            {content.hasHDR && (
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                HDR10+
              </span>
            )}
            {content.hasIMAX && (
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                IMAX
              </span>
            )}
            <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">{content.primaryGenre}</span>
          </div>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl hero-description">
            {content.overview}
          </p>

          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPlay(content)}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors shadow-lg"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>Play {content.has4K ? 'in 4K' : ''}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleMyList(content)}
              className="flex items-center space-x-2 bg-gray-700/70 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-600/70 transition-colors"
            >
              {isInMyList(content) ? (
                <Check className="w-6 h-6" />
              ) : (
                <Plus className="w-6 h-6" />
              )}
              <span>My List</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Content Card Component
const ContentCard = ({ item, onPlay, onToggleMyList, isInMyList }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const posterUrl = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://images.unsplash.com/photo-1575388902449-6bca946ad549';

  return (
    <motion.div
      className="relative flex-shrink-0 w-48 cursor-pointer content-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <img 
          src={posterUrl}
          alt={item.title || item.name}
          className="w-full h-72 object-cover"
        />
        
        {/* Quality Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {item.has4K && (
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
              4K
            </span>
          )}
          {item.hasHDR && (
            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
              HDR
            </span>
          )}
          {item.hasIMAX && (
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
              IMAX
            </span>
          )}
        </div>

        {/* Quality Rating Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-bold ${
            item.quality === 'Premium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' :
            item.quality === 'High' ? 'bg-green-600 text-white' :
            item.quality === 'Standard' ? 'bg-blue-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {item.quality}
          </span>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 flex flex-col justify-end p-4"
            >
              <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">
                {item.title || item.name}
              </h3>
              
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white text-xs">{item.vote_average?.toFixed(1)}</span>
                </div>
                <span className="text-gray-300 text-xs">{item.primaryGenre}</span>
              </div>

              <div className="text-gray-400 text-xs mb-3">
                {(item.release_date || item.first_air_date)?.split('-')[0]} • {item.estimatedRuntime}
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPlay(item)}
                  className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleMyList(item)}
                  className="bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  {isInMyList(item) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Content Row Component
const ContentRow = ({ title, items, onPlay, onToggleMyList, isInMyList }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 px-8">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-8 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPlay={onPlay}
              onToggleMyList={onToggleMyList}
              isInMyList={isInMyList}
            />
          ))}
        </div>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Content Rows Component
export const ContentRows = ({ movies, tvShows, onPlay, onToggleMyList, isInMyList }) => {
  return (
    <div className="relative z-10 -mt-32 pb-16">
      <ContentRow
        title="🔥 Trending Now"
        items={[...movies.trending, ...tvShows.trending]}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="🏆 Award Winners & Critical Favorites"
        items={movies.awards}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />

      <ContentRow
        title="💎 4K Ultra HD Blockbusters"
        items={movies.blockbusters?.filter(item => item.has4K)}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />

      <ContentRow
        title="🎬 IMAX Enhanced Experience"
        items={movies.imax}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="⭐ Top Rated Movies"
        items={movies.topRated}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="💥 Action & Adventure"
        items={movies.action}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="😂 Comedy Movies"
        items={movies.comedy}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />

      <ContentRow
        title="📺 Netflix Originals"
        items={tvShows.netflixOriginals}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />

      <ContentRow
        title="🎭 Limited Series"
        items={tvShows.limitedSeries}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="📈 Popular TV Shows"
        items={tvShows.popular}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="🕵️ Crime & Drama"
        items={[...tvShows.crime, ...tvShows.drama]}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="👻 Horror Movies"
        items={movies.horror}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="💕 Romantic Movies"
        items={movies.romance}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="📚 Documentaries"
        items={movies.documentaries}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
      
      <ContentRow
        title="🚀 Sci-Fi & Fantasy"
        items={tvShows.sciFi}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />

      <ContentRow
        title="🎬 Coming Soon"
        items={movies.upcoming}
        onPlay={onPlay}
        onToggleMyList={onToggleMyList}
        isInMyList={isInMyList}
      />
    </div>
  );
};

// Video Player Component
export const VideoPlayer = ({ content, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoUrl = `https://www.youtube.com/embed/${content.videoKey}?autoplay=1&controls=1&modestbranding=1&rel=0&hd=1`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-60 bg-black/70 text-white p-3 rounded-full hover:bg-black/90 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Quality Indicator */}
      <div className="absolute top-4 left-4 z-60 flex space-x-2">
        {content.has4K && (
          <span className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-glow">
            4K ULTRA HD
          </span>
        )}
        {content.hasHDR && (
          <span className="bg-purple-600 text-white px-3 py-2 rounded-full text-sm font-bold">
            HDR10+
          </span>
        )}
        {content.hasIMAX && (
          <span className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-bold">
            IMAX ENHANCED
          </span>
        )}
      </div>

      {/* Video Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <iframe
          src={videoUrl}
          title={content.title || content.name}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Video Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {content.title || content.name}
        </h1>
        <div className="flex items-center space-x-4 mb-4 flex-wrap">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="text-white">{content.vote_average?.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300">
              {(content.release_date || content.first_air_date)?.split('-')[0]}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">{content.estimatedRuntime}</span>
          </div>
          <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm">{content.primaryGenre}</span>
          <span className={`px-2 py-1 rounded text-sm font-bold ${
            content.quality === 'Premium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' :
            content.quality === 'High' ? 'bg-green-600 text-white' :
            content.quality === 'Standard' ? 'bg-blue-600 text-white' :
            'bg-gray-600 text-white'
          }`}>
            {content.quality} Quality
          </span>
        </div>
        <p className="text-gray-300 max-w-2xl">
          {content.overview}
        </p>
      </div>
    </motion.div>
  );
};

// Search Results Component
export const SearchResults = ({ results, onPlay, onToggleMyList, isInMyList }) => {
  return (
    <div className="pt-24 px-8 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Search Results</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            onPlay={onPlay}
            onToggleMyList={onToggleMyList}
            isInMyList={isInMyList}
          />
        ))}
      </div>
    </div>
  );
};

// My List Component
export const MyList = ({ myList, onPlay, onToggleMyList }) => {
  return (
    <div className="pt-24 px-8 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">My List</h1>
      {myList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-xl">Your list is empty</p>
          <p className="text-gray-500 mt-2">Add some movies and shows to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {myList.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onPlay={onPlay}
              onToggleMyList={onToggleMyList}
              isInMyList={() => true}
            />
          ))}
        </div>
      )}
    </div>
  );
};