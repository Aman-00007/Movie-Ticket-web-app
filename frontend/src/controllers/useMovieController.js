import { useState, useEffect, useMemo } from 'react';
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

  // Available genres
  const genres = useMemo(
    () => ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Sports', 'Family', 'Mythology'],
    []
  );

  // Fetch movies from backend or fallback
  useEffect(() => {
    let mounted = true;
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const rawMovies = await api.getMovies();
        if (mounted && rawMovies && rawMovies.length) {
          setMovies(MovieModel.fromArray(rawMovies));
        }
      } catch (err) {
        console.warn('MovieController: using fallback movies', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMovies();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter movies according to MVC model logic
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // 1. Filter by status (now_showing vs upcoming)
      const matchesStatus =
        filterTab === 'now_showing' ? movie.isNowShowing() : movie.isUpcoming();

      // 2. Filter by genre
      const matchesGenre = movie.matchesGenre(selectedGenre);

      // 3. Filter by search query
      const matchesSearch = movie.matchesSearch(searchQuery);

      return matchesStatus && matchesGenre && matchesSearch;
    });
  }, [movies, filterTab, selectedGenre, searchQuery]);

  const [selectedMovieDetail, setSelectedMovieDetail] = useState(null);

  const openMovieDetail = (movie) => {
    setSelectedMovieDetail(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeMovieDetail = () => {
    setSelectedMovieDetail(null);
  };

  const openTrailer = (movie) => setActiveTrailerMovie(movie);
  const closeTrailer = () => setActiveTrailerMovie(null);

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
  };
}
