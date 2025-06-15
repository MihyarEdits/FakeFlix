import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import {
  Header,
  HeroSection,
  ContentRows,
  VideoPlayer,
  SearchResults,
  ProfileSelector,
  MyList
} from './components';

// TMDB API configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

function App() {
  const [user, setUser] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [myList, setMyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState({
    trending: [],
    topRated: [],
    upcoming: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentaries: []
  });
  const [tvShows, setTvShows] = useState({
    trending: [],
    topRated: [],
    popular: [],
    crime: [],
    drama: [],
    sciFi: []
  });

  // Fetch content from TMDB
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch movies
        const [
          trendingMovies,
          topRatedMovies,
          upcomingMovies,
          actionMovies,
          comedyMovies,
          horrorMovies,
          romanceMovies,
          documentaries
        ] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99`).then(r => r.json())
        ]);

        // Fetch TV shows
        const [
          trendingTv,
          topRatedTv,
          popularTv,
          crimeTv,
          dramaTv,
          sciFiTv
        ] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=80`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765`).then(r => r.json())
        ]);

        setMovies({
          trending: trendingMovies.results || [],
          topRated: topRatedMovies.results || [],
          upcoming: upcomingMovies.results || [],
          action: actionMovies.results || [],
          comedy: comedyMovies.results || [],
          horror: horrorMovies.results || [],
          romance: romanceMovies.results || [],
          documentaries: documentaries.results || []
        });

        setTvShows({
          trending: trendingTv.results || [],
          topRated: topRatedTv.results || [],
          popular: popularTv.results || [],
          crime: crimeTv.results || [],
          drama: dramaTv.results || [],
          sciFi: sciFiTv.results || []
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Search functionality
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // My List functionality
  const toggleMyList = (item) => {
    setMyList(prev => {
      const exists = prev.find(listItem => listItem.id === item.id);
      if (exists) {
        return prev.filter(listItem => listItem.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const isInMyList = (item) => {
    return myList.some(listItem => listItem.id === item.id);
  };

  // Play content
  const playContent = async (item) => {
    try {
      // Get videos for the content
      const mediaType = item.title ? 'movie' : 'tv';
      const response = await fetch(
        `${TMDB_BASE_URL}/${mediaType}/${item.id}/videos?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      
      // Find trailer or teaser
      const video = data.results?.find(v => 
        v.type === 'Trailer' || v.type === 'Teaser'
      ) || data.results?.[0];
      
      if (video && video.site === 'YouTube') {
        setCurrentlyPlaying({
          ...item,
          videoKey: video.key
        });
      } else {
        // Fallback - use a sample video key
        setCurrentlyPlaying({
          ...item,
          videoKey: 'dQw4w9WgXcQ' // Sample YouTube video
        });
      }
    } catch (error) {
      console.error('Error playing content:', error);
      // Fallback
      setCurrentlyPlaying({
        ...item,
        videoKey: 'dQw4w9WgXcQ'
      });
    }
  };

  if (!user) {
    return (
      <BrowserRouter>
        <ProfileSelector onSelectUser={setUser} />
      </BrowserRouter>
    );
  }

  return (
    <div className="App bg-black min-h-screen text-white">
      <BrowserRouter>
        <Header 
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
          onLogout={() => setUser(null)}
        />
        
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
                </div>
              ) : (
                <>
                  <HeroSection 
                    content={movies.trending[0] || tvShows.trending[0]}
                    onPlay={playContent}
                    onToggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                  />
                  <ContentRows 
                    movies={movies}
                    tvShows={tvShows}
                    onPlay={playContent}
                    onToggleMyList={toggleMyList}
                    isInMyList={isInMyList}
                  />
                </>
              )}
            </motion.div>
          } />
          
          <Route path="/search" element={
            <SearchResults 
              results={searchResults}
              onPlay={playContent}
              onToggleMyList={toggleMyList}
              isInMyList={isInMyList}
            />
          } />
          
          <Route path="/my-list" element={
            <MyList 
              myList={myList}
              onPlay={playContent}
              onToggleMyList={toggleMyList}
            />
          } />
        </Routes>

        {currentlyPlaying && (
          <VideoPlayer 
            content={currentlyPlaying}
            onClose={() => setCurrentlyPlaying(null)}
          />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;