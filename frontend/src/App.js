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
    documentaries: [],
    blockbusters: [],
    awards: [],
    imax: []
  });
  const [tvShows, setTvShows] = useState({
    trending: [],
    topRated: [],
    popular: [],
    crime: [],
    drama: [],
    sciFi: [],
    netflixOriginals: [],
    limitedSeries: []
  });

  // Fetch detailed content from TMDB
  useEffect(() => {
    const fetchContentWithDetails = async () => {
      try {
        setIsLoading(true);
        
        // Enhanced movie fetching with more data
        const [
          trendingMovies,
          topRatedMovies,
          upcomingMovies,
          actionMovies,
          comedyMovies,
          horrorMovies,
          romanceMovies,
          documentaries,
          blockbusters,
          awards,
          imaxMovies
        ] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=28&sort_by=vote_average.desc&vote_count.gte=1000`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=35&sort_by=popularity.desc`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=27&sort_by=vote_average.desc&vote_count.gte=500`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=10749&sort_by=popularity.desc`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=99&sort_by=vote_average.desc&vote_count.gte=100`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=revenue.desc&vote_count.gte=2000`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=vote_average.desc&vote_count.gte=5000&primary_release_date.gte=2015-01-01`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=158431|9715&sort_by=popularity.desc`).then(r => r.json()) // IMAX keywords
        ]);

        // Enhanced TV shows fetching
        const [
          trendingTv,
          topRatedTv,
          popularTv,
          crimeTv,
          dramaTv,
          sciFiTv,
          netflixOriginals,
          limitedSeries
        ] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=1`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=80&sort_by=vote_average.desc&vote_count.gte=500`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=18&sort_by=popularity.desc`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_genres=10765&sort_by=vote_average.desc&vote_count.gte=300`).then(r => r.json()),
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_networks=213&sort_by=popularity.desc`).then(r => r.json()), // Netflix network
          fetch(`${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_type=2&sort_by=vote_average.desc&vote_count.gte=100`).then(r => r.json()) // Limited series
        ]);

        // Enhance content with 4K indicators and additional details
        const enhanceContent = (content) => {
          return content.map(item => ({
            ...item,
            // Add 4K indicator based on release date and popularity
            has4K: item.vote_average >= 7.0 && item.vote_count >= 1000 && 
                   new Date(item.release_date || item.first_air_date) >= new Date('2016-01-01'),
            hasHDR: item.vote_average >= 8.0 && item.vote_count >= 2000,
            hasIMAX: imaxMovies.results?.some(imax => imax.id === item.id) || false,
            isBlockbuster: blockbusters.results?.some(block => block.id === item.id) || false,
            quality: item.vote_average >= 8.5 ? 'Premium' : 
                    item.vote_average >= 7.5 ? 'High' : 
                    item.vote_average >= 6.5 ? 'Standard' : 'Basic',
            // Add runtime estimation
            estimatedRuntime: item.runtime || (item.title ? '120 min' : '45 min'),
            // Add genre information
            primaryGenre: item.genre_ids?.[0] ? getGenreName(item.genre_ids[0]) : 'Drama'
          }));
        };

        const getGenreName = (genreId) => {
          const genres = {
            28: 'Action', 35: 'Comedy', 18: 'Drama', 27: 'Horror', 10749: 'Romance',
            878: 'Sci-Fi', 53: 'Thriller', 16: 'Animation', 99: 'Documentary', 80: 'Crime',
            12: 'Adventure', 14: 'Fantasy', 36: 'History', 10402: 'Music', 9648: 'Mystery',
            10770: 'TV Movie', 10752: 'War', 37: 'Western', 10751: 'Family'
          };
          return genres[genreId] || 'Drama';
        };

        setMovies({
          trending: enhanceContent(trendingMovies.results || []),
          topRated: enhanceContent(topRatedMovies.results || []),
          upcoming: enhanceContent(upcomingMovies.results || []),
          action: enhanceContent(actionMovies.results || []),
          comedy: enhanceContent(comedyMovies.results || []),
          horror: enhanceContent(horrorMovies.results || []),
          romance: enhanceContent(romanceMovies.results || []),
          documentaries: enhanceContent(documentaries.results || []),
          blockbusters: enhanceContent(blockbusters.results || []),
          awards: enhanceContent(awards.results || []),
          imax: enhanceContent(imaxMovies.results || [])
        });

        setTvShows({
          trending: enhanceContent(trendingTv.results || []),
          topRated: enhanceContent(topRatedTv.results || []),
          popular: enhanceContent(popularTv.results || []),
          crime: enhanceContent(crimeTv.results || []),
          drama: enhanceContent(dramaTv.results || []),
          sciFi: enhanceContent(sciFiTv.results || []),
          netflixOriginals: enhanceContent(netflixOriginals.results || []),
          limitedSeries: enhanceContent(limitedSeries.results || [])
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setIsLoading(false);
      }
    };

    fetchContentWithDetails();
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