import { useState, useEffect, useMemo, useCallback } from 'react';
import { api, fallbackMovies } from '../services/api';
import { MovieModel } from '../models/MovieModel';

export function useMovieController(initialCity = 'Mumbai') {
  const [movies, setMovies] = useState(() => MovieModel.fromArray(fallbackMovies));
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('now_showing'); // 'now_showing' | 'upcoming'
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [selectedMovieDetail, setSelectedMovieDetail] = useState(null);
  const [movieManagerOpen, setMovieManagerOpen] = useState(false);

  // Available genres
  const genres = useMemo(
    () => ['All', 'Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Animation', 'Adventure', 'Mythology', 'Biography'],
    []
  );

  // Fetch movies from backend or fallback
  const refreshMovies = useCallback(async () => {
    setLoading(true);
    try {
      const rawMovies = await api.getMovies();
      if (rawMovies && rawMovies.length) {
        setMovies(MovieModel.fromArray(rawMovies));
      }
    } catch (err) {
      console.warn('MovieController: using fallback movies', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMovies();
  }, [refreshMovies]);

  // Filter movies according to MVC model logic
  const filteredMovies = useMemo(() => {
    const hasSearch = Boolean(searchQuery && searchQuery.trim());
    return movies.filter((movie) => {
      // 1. Filter by status (now_showing vs upcoming) - if actively searching, search all movies
      const matchesStatus = hasSearch
        ? true
        : filterTab === 'now_showing'
          ? movie.isNowShowing()
          : movie.isUpcoming();

      // 2. Filter by genre
      const matchesGenre = movie.matchesGenre(selectedGenre);

      // 3. Filter by search query
      const matchesSearch = movie.matchesSearch(searchQuery);

      return matchesStatus && matchesGenre && matchesSearch;
    });
  }, [movies, filterTab, selectedGenre, searchQuery]);

  const openMovieDetail = (movie) => {
    setSelectedMovieDetail(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeMovieDetail = () => {
    setSelectedMovieDetail(null);
  };

  const openTrailer = (movie) => setActiveTrailerMovie(movie);
  const closeTrailer = () => setActiveTrailerMovie(null);

  const openMovieManager = () => setMovieManagerOpen(true);
  const closeMovieManager = () => setMovieManagerOpen(false);

  // Add new movie
  const addMovie = async (movieData) => {
    const res = await api.createMovie(movieData);
    await refreshMovies();
    return res;
  };

  // Delete movie from database
  const deleteMovie = async (movieId) => {
    const res = await api.deleteMovie(movieId);
    // Optimistically remove from state
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    if (selectedMovieDetail && selectedMovieDetail.id === movieId) {
      setSelectedMovieDetail(null);
    }
    await refreshMovies();
    return res;
  };

  // Update existing movie in database (fix trailers, posters, metadata)
  const updateMovie = async (movieId, updateData) => {
    const res = await api.updateMovie(movieId, updateData);
    await refreshMovies();
    if (selectedMovieDetail && selectedMovieDetail.id === movieId) {
      // Keep selected detail view synchronized
      setSelectedMovieDetail((prev) => (prev ? { ...prev, ...updateData } : null));
    }
    return res;
  };

  // AI Search & Add using Gemini Flash
  const aiSearchAndAddMovie = async (query) => {
    const res = await api.aiSearchMovie(query);
    await refreshMovies();
    return res;
  };

  // Sync 2026 database movies
  const sync2026 = async () => {
    const res = await api.sync2026Movies();
    await refreshMovies();
    return res;
  };

  return {
    movies,
    filteredMovies,
    loading,
    selectedCity,
    setSelectedCity,
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    selectedGenre,
    setSelectedGenre,
    genres,
    activeTrailerMovie,
    openTrailer,
    closeTrailer,
    selectedMovieDetail,
    openMovieDetail,
    closeMovieDetail,
    movieManagerOpen,
    openMovieManager,
    closeMovieManager,
    addMovie,
    updateMovie,
    deleteMovie,
    aiSearchAndAddMovie,
    sync2026,
    refreshMovies,
  };
}
