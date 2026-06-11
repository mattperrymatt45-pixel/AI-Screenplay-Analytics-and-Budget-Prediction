import { CompTitle, ExtractedFeatures } from '../types';

interface MovieRecord {
  title: string;
  year: number;
  genre: string;         // primary genre
  genres: string[];      // all applicable genres for matching
  budget: number;
  locations: number;
  castSize: number;
  vfxHeavy: number;      // 0-10
  stuntHeavy: number;    // 0-10
  period: 'contemporary' | 'period' | 'futuristic';
  dialogueRatio: number; // 0-1
  actionRatio: number;   // 0-1
  pages: number;
  nightHeavy: boolean;
}

const DB: MovieRecord[] = [
  // ── DRAMA ─────────────────────────────────────────────────────
  { title: "Moonlight", year: 2016, genre: "Drama", genres: ["Drama"], budget: 4000000, locations: 15, castSize: 18, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 111, nightHeavy: true },
  { title: "Whiplash", year: 2014, genre: "Drama", genres: ["Drama"], budget: 3300000, locations: 8, castSize: 12, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 107, nightHeavy: false },
  { title: "Manchester by the Sea", year: 2016, genre: "Drama", genres: ["Drama"], budget: 8500000, locations: 18, castSize: 15, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 135, nightHeavy: false },
  { title: "Lost in Translation", year: 2003, genre: "Drama", genres: ["Drama", "Romance"], budget: 4000000, locations: 15, castSize: 8, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 75, nightHeavy: true },
  { title: "The Social Network", year: 2010, genre: "Drama", genres: ["Drama", "Thriller"], budget: 40000000, locations: 18, castSize: 25, vfxHeavy: 1, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.8, actionRatio: 0.2, pages: 164, nightHeavy: false },
  { title: "Marriage Story", year: 2019, genre: "Drama", genres: ["Drama", "Romance"], budget: 18000000, locations: 12, castSize: 14, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.75, actionRatio: 0.25, pages: 136, nightHeavy: false },
  { title: "The Shawshank Redemption", year: 1994, genre: "Drama", genres: ["Drama"], budget: 25000000, locations: 8, castSize: 25, vfxHeavy: 0, stuntHeavy: 2, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 142, nightHeavy: false },
  { title: "12 Years a Slave", year: 2013, genre: "Drama", genres: ["Drama"], budget: 20000000, locations: 22, castSize: 30, vfxHeavy: 0, stuntHeavy: 3, period: 'period', dialogueRatio: 0.5, actionRatio: 0.5, pages: 134, nightHeavy: false },
  { title: "The Godfather", year: 1972, genre: "Drama", genres: ["Drama", "Thriller"], budget: 6000000, locations: 22, castSize: 40, vfxHeavy: 0, stuntHeavy: 3, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 175, nightHeavy: true },
  { title: "Schindler's List", year: 1993, genre: "Drama", genres: ["Drama", "War"], budget: 22000000, locations: 25, castSize: 45, vfxHeavy: 1, stuntHeavy: 3, period: 'period', dialogueRatio: 0.55, actionRatio: 0.45, pages: 195, nightHeavy: true },
  { title: "Oppenheimer", year: 2023, genre: "Drama", genres: ["Drama"], budget: 100000000, locations: 30, castSize: 50, vfxHeavy: 5, stuntHeavy: 2, period: 'period', dialogueRatio: 0.7, actionRatio: 0.3, pages: 180, nightHeavy: false },
  { title: "Forrest Gump", year: 1994, genre: "Drama", genres: ["Drama", "Romance"], budget: 55000000, locations: 30, castSize: 30, vfxHeavy: 5, stuntHeavy: 3, period: 'period', dialogueRatio: 0.55, actionRatio: 0.45, pages: 144, nightHeavy: false },
  { title: "The Revenant", year: 2015, genre: "Drama", genres: ["Drama", "Action"], budget: 135000000, locations: 30, castSize: 20, vfxHeavy: 5, stuntHeavy: 8, period: 'period', dialogueRatio: 0.3, actionRatio: 0.7, pages: 127, nightHeavy: true },
  { title: "Nomadland", year: 2020, genre: "Drama", genres: ["Drama"], budget: 5000000, locations: 20, castSize: 6, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 108, nightHeavy: false },
  { title: "The Pianist", year: 2002, genre: "Drama", genres: ["Drama", "War"], budget: 35000000, locations: 18, castSize: 20, vfxHeavy: 3, stuntHeavy: 4, period: 'period', dialogueRatio: 0.4, actionRatio: 0.6, pages: 150, nightHeavy: true },

  // ── COMEDY ────────────────────────────────────────────────────
  { title: "Clerks", year: 1994, genre: "Comedy", genres: ["Comedy"], budget: 27575, locations: 2, castSize: 12, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.85, actionRatio: 0.15, pages: 100, nightHeavy: false },
  { title: "Lady Bird", year: 2017, genre: "Comedy", genres: ["Comedy", "Drama"], budget: 10000000, locations: 20, castSize: 22, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.65, actionRatio: 0.35, pages: 108, nightHeavy: false },
  { title: "Juno", year: 2007, genre: "Comedy", genres: ["Comedy", "Drama"], budget: 7500000, locations: 12, castSize: 16, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.7, actionRatio: 0.3, pages: 96, nightHeavy: false },
  { title: "Little Miss Sunshine", year: 2006, genre: "Comedy", genres: ["Comedy", "Drama"], budget: 8000000, locations: 18, castSize: 10, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 108, nightHeavy: false },
  { title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", genres: ["Comedy", "Drama"], budget: 25000000, locations: 25, castSize: 35, vfxHeavy: 3, stuntHeavy: 2, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 111, nightHeavy: false },
  { title: "Superbad", year: 2007, genre: "Comedy", genres: ["Comedy"], budget: 20000000, locations: 15, castSize: 18, vfxHeavy: 0, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.75, actionRatio: 0.25, pages: 111, nightHeavy: true },
  { title: "The Hangover", year: 2009, genre: "Comedy", genres: ["Comedy"], budget: 35000000, locations: 14, castSize: 12, vfxHeavy: 0, stuntHeavy: 2, period: 'contemporary', dialogueRatio: 0.65, actionRatio: 0.35, pages: 100, nightHeavy: true },
  { title: "Bridesmaids", year: 2011, genre: "Comedy", genres: ["Comedy", "Romance"], budget: 32500000, locations: 16, castSize: 14, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.7, actionRatio: 0.3, pages: 125, nightHeavy: false },
  { title: "Napoleon Dynamite", year: 2004, genre: "Comedy", genres: ["Comedy"], budget: 400000, locations: 8, castSize: 10, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 92, nightHeavy: false },

  // ── HORROR ────────────────────────────────────────────────────
  { title: "The Blair Witch Project", year: 1999, genre: "Horror", genres: ["Horror"], budget: 60000, locations: 4, castSize: 3, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 35, nightHeavy: true },
  { title: "Paranormal Activity", year: 2007, genre: "Horror", genres: ["Horror"], budget: 15000, locations: 1, castSize: 4, vfxHeavy: 1, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 88, nightHeavy: true },
  { title: "Get Out", year: 2017, genre: "Horror", genres: ["Horror", "Thriller"], budget: 4500000, locations: 10, castSize: 15, vfxHeavy: 1, stuntHeavy: 2, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 104, nightHeavy: true },
  { title: "Hereditary", year: 2018, genre: "Horror", genres: ["Horror", "Drama"], budget: 10000000, locations: 6, castSize: 8, vfxHeavy: 3, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 127, nightHeavy: true },
  { title: "A Quiet Place", year: 2018, genre: "Horror", genres: ["Horror", "Thriller", "Sci-Fi"], budget: 17000000, locations: 6, castSize: 5, vfxHeavy: 5, stuntHeavy: 3, period: 'contemporary', dialogueRatio: 0.15, actionRatio: 0.85, pages: 90, nightHeavy: true },
  { title: "The Conjuring", year: 2013, genre: "Horror", genres: ["Horror"], budget: 20000000, locations: 8, castSize: 12, vfxHeavy: 3, stuntHeavy: 2, period: 'period', dialogueRatio: 0.5, actionRatio: 0.5, pages: 112, nightHeavy: true },
  { title: "It", year: 2017, genre: "Horror", genres: ["Horror"], budget: 35000000, locations: 18, castSize: 16, vfxHeavy: 6, stuntHeavy: 4, period: 'period', dialogueRatio: 0.5, actionRatio: 0.5, pages: 135, nightHeavy: true },
  { title: "Midsommar", year: 2019, genre: "Horror", genres: ["Horror", "Drama"], budget: 9000000, locations: 5, castSize: 10, vfxHeavy: 2, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 147, nightHeavy: false },
  { title: "The Witch", year: 2015, genre: "Horror", genres: ["Horror", "Drama"], budget: 3500000, locations: 3, castSize: 7, vfxHeavy: 1, stuntHeavy: 1, period: 'period', dialogueRatio: 0.5, actionRatio: 0.5, pages: 93, nightHeavy: true },
  { title: "Us", year: 2019, genre: "Horror", genres: ["Horror", "Thriller"], budget: 20000000, locations: 12, castSize: 12, vfxHeavy: 3, stuntHeavy: 4, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 116, nightHeavy: true },

  // ── ACTION ────────────────────────────────────────────────────
  { title: "John Wick", year: 2014, genre: "Action", genres: ["Action", "Thriller"], budget: 20000000, locations: 18, castSize: 15, vfxHeavy: 2, stuntHeavy: 9, period: 'contemporary', dialogueRatio: 0.25, actionRatio: 0.75, pages: 99, nightHeavy: true },
  { title: "Mad Max: Fury Road", year: 2015, genre: "Action", genres: ["Action", "Sci-Fi"], budget: 150000000, locations: 12, castSize: 25, vfxHeavy: 8, stuntHeavy: 10, period: 'futuristic', dialogueRatio: 0.15, actionRatio: 0.85, pages: 100, nightHeavy: false },
  { title: "The Dark Knight", year: 2008, genre: "Action", genres: ["Action", "Thriller", "Drama"], budget: 185000000, locations: 40, castSize: 30, vfxHeavy: 8, stuntHeavy: 9, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 152, nightHeavy: true },
  { title: "Die Hard", year: 1988, genre: "Action", genres: ["Action", "Thriller"], budget: 28000000, locations: 5, castSize: 18, vfxHeavy: 3, stuntHeavy: 9, period: 'contemporary', dialogueRatio: 0.4, actionRatio: 0.6, pages: 131, nightHeavy: true },
  { title: "The Raid", year: 2011, genre: "Action", genres: ["Action"], budget: 1100000, locations: 2, castSize: 15, vfxHeavy: 1, stuntHeavy: 10, period: 'contemporary', dialogueRatio: 0.15, actionRatio: 0.85, pages: 77, nightHeavy: false },
  { title: "Baby Driver", year: 2017, genre: "Action", genres: ["Action", "Thriller"], budget: 34000000, locations: 20, castSize: 12, vfxHeavy: 3, stuntHeavy: 8, period: 'contemporary', dialogueRatio: 0.4, actionRatio: 0.6, pages: 113, nightHeavy: false },
  { title: "Gladiator", year: 2000, genre: "Action", genres: ["Action", "Drama"], budget: 103000000, locations: 25, castSize: 35, vfxHeavy: 7, stuntHeavy: 9, period: 'period', dialogueRatio: 0.4, actionRatio: 0.6, pages: 135, nightHeavy: false },
  { title: "Everything Everywhere All at Once", year: 2022, genre: "Action", genres: ["Action", "Comedy", "Sci-Fi"], budget: 25000000, locations: 15, castSize: 12, vfxHeavy: 8, stuntHeavy: 7, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 132, nightHeavy: false },
  { title: "Mission: Impossible – Fallout", year: 2018, genre: "Action", genres: ["Action", "Thriller"], budget: 178000000, locations: 35, castSize: 20, vfxHeavy: 7, stuntHeavy: 10, period: 'contemporary', dialogueRatio: 0.35, actionRatio: 0.65, pages: 147, nightHeavy: true },
  { title: "Avengers: Endgame", year: 2019, genre: "Action", genres: ["Action", "Sci-Fi"], budget: 356000000, locations: 40, castSize: 50, vfxHeavy: 10, stuntHeavy: 10, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 180, nightHeavy: false },

  // ── THRILLER ──────────────────────────────────────────────────
  { title: "Pulp Fiction", year: 1994, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 8000000, locations: 18, castSize: 20, vfxHeavy: 0, stuntHeavy: 4, period: 'contemporary', dialogueRatio: 0.7, actionRatio: 0.3, pages: 154, nightHeavy: true },
  { title: "Drive", year: 2011, genre: "Thriller", genres: ["Thriller", "Action"], budget: 15000000, locations: 22, castSize: 14, vfxHeavy: 1, stuntHeavy: 6, period: 'contemporary', dialogueRatio: 0.35, actionRatio: 0.65, pages: 100, nightHeavy: true },
  { title: "No Country for Old Men", year: 2007, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 25000000, locations: 28, castSize: 20, vfxHeavy: 0, stuntHeavy: 5, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 122, nightHeavy: true },
  { title: "Parasite", year: 2019, genre: "Thriller", genres: ["Thriller", "Drama", "Comedy"], budget: 11400000, locations: 8, castSize: 14, vfxHeavy: 2, stuntHeavy: 3, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 132, nightHeavy: true },
  { title: "Knives Out", year: 2019, genre: "Thriller", genres: ["Thriller", "Comedy"], budget: 40000000, locations: 8, castSize: 18, vfxHeavy: 0, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.75, actionRatio: 0.25, pages: 130, nightHeavy: false },
  { title: "Fight Club", year: 1999, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 63000000, locations: 25, castSize: 20, vfxHeavy: 3, stuntHeavy: 6, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 142, nightHeavy: true },
  { title: "Gone Girl", year: 2014, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 61000000, locations: 15, castSize: 16, vfxHeavy: 1, stuntHeavy: 2, period: 'contemporary', dialogueRatio: 0.6, actionRatio: 0.4, pages: 145, nightHeavy: false },
  { title: "Zodiac", year: 2007, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 65000000, locations: 22, castSize: 20, vfxHeavy: 2, stuntHeavy: 2, period: 'period', dialogueRatio: 0.65, actionRatio: 0.35, pages: 158, nightHeavy: true },
  { title: "Sicario", year: 2015, genre: "Thriller", genres: ["Thriller", "Action"], budget: 30000000, locations: 15, castSize: 14, vfxHeavy: 2, stuntHeavy: 6, period: 'contemporary', dialogueRatio: 0.4, actionRatio: 0.6, pages: 121, nightHeavy: true },
  { title: "Nightcrawler", year: 2014, genre: "Thriller", genres: ["Thriller", "Drama"], budget: 8500000, locations: 20, castSize: 8, vfxHeavy: 1, stuntHeavy: 3, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 117, nightHeavy: true },

  // ── SCI-FI ────────────────────────────────────────────────────
  { title: "Primer", year: 2004, genre: "Sci-Fi", genres: ["Sci-Fi", "Thriller"], budget: 7000, locations: 3, castSize: 5, vfxHeavy: 1, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.7, actionRatio: 0.3, pages: 77, nightHeavy: false },
  { title: "Ex Machina", year: 2014, genre: "Sci-Fi", genres: ["Sci-Fi", "Thriller"], budget: 15000000, locations: 3, castSize: 4, vfxHeavy: 5, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.65, actionRatio: 0.35, pages: 108, nightHeavy: false },
  { title: "Arrival", year: 2016, genre: "Sci-Fi", genres: ["Sci-Fi", "Drama"], budget: 47000000, locations: 12, castSize: 15, vfxHeavy: 7, stuntHeavy: 1, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 116, nightHeavy: false },
  { title: "Inception", year: 2010, genre: "Sci-Fi", genres: ["Sci-Fi", "Action", "Thriller"], budget: 160000000, locations: 35, castSize: 20, vfxHeavy: 9, stuntHeavy: 8, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 148, nightHeavy: true },
  { title: "Interstellar", year: 2014, genre: "Sci-Fi", genres: ["Sci-Fi", "Drama"], budget: 165000000, locations: 20, castSize: 18, vfxHeavy: 10, stuntHeavy: 5, period: 'futuristic', dialogueRatio: 0.5, actionRatio: 0.5, pages: 169, nightHeavy: false },
  { title: "The Martian", year: 2015, genre: "Sci-Fi", genres: ["Sci-Fi", "Drama"], budget: 108000000, locations: 15, castSize: 18, vfxHeavy: 8, stuntHeavy: 3, period: 'futuristic', dialogueRatio: 0.55, actionRatio: 0.45, pages: 128, nightHeavy: false },
  { title: "Gravity", year: 2013, genre: "Sci-Fi", genres: ["Sci-Fi", "Thriller"], budget: 100000000, locations: 3, castSize: 5, vfxHeavy: 10, stuntHeavy: 3, period: 'contemporary', dialogueRatio: 0.4, actionRatio: 0.6, pages: 91, nightHeavy: false },
  { title: "Avatar", year: 2009, genre: "Sci-Fi", genres: ["Sci-Fi", "Action"], budget: 237000000, locations: 10, castSize: 20, vfxHeavy: 10, stuntHeavy: 7, period: 'futuristic', dialogueRatio: 0.4, actionRatio: 0.6, pages: 152, nightHeavy: false },
  { title: "Blade Runner 2049", year: 2017, genre: "Sci-Fi", genres: ["Sci-Fi", "Thriller", "Drama"], budget: 150000000, locations: 18, castSize: 12, vfxHeavy: 9, stuntHeavy: 4, period: 'futuristic', dialogueRatio: 0.45, actionRatio: 0.55, pages: 161, nightHeavy: true },
  { title: "Annihilation", year: 2018, genre: "Sci-Fi", genres: ["Sci-Fi", "Horror"], budget: 40000000, locations: 8, castSize: 8, vfxHeavy: 8, stuntHeavy: 4, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 115, nightHeavy: true },

  // ── WAR ───────────────────────────────────────────────────────
  { title: "1917", year: 2019, genre: "War", genres: ["War", "Drama", "Action"], budget: 95000000, locations: 18, castSize: 20, vfxHeavy: 6, stuntHeavy: 7, period: 'period', dialogueRatio: 0.3, actionRatio: 0.7, pages: 102, nightHeavy: true },
  { title: "Dunkirk", year: 2017, genre: "War", genres: ["War", "Drama", "Action"], budget: 100000000, locations: 15, castSize: 25, vfxHeavy: 7, stuntHeavy: 8, period: 'period', dialogueRatio: 0.2, actionRatio: 0.8, pages: 76, nightHeavy: false },
  { title: "Saving Private Ryan", year: 1998, genre: "War", genres: ["War", "Drama", "Action"], budget: 70000000, locations: 20, castSize: 30, vfxHeavy: 5, stuntHeavy: 9, period: 'period', dialogueRatio: 0.4, actionRatio: 0.6, pages: 148, nightHeavy: true },
  { title: "Hacksaw Ridge", year: 2016, genre: "War", genres: ["War", "Drama"], budget: 40000000, locations: 12, castSize: 22, vfxHeavy: 4, stuntHeavy: 8, period: 'period', dialogueRatio: 0.45, actionRatio: 0.55, pages: 139, nightHeavy: false },
  { title: "The Hurt Locker", year: 2008, genre: "War", genres: ["War", "Thriller"], budget: 15000000, locations: 20, castSize: 20, vfxHeavy: 3, stuntHeavy: 7, period: 'contemporary', dialogueRatio: 0.45, actionRatio: 0.55, pages: 128, nightHeavy: true },

  // ── ROMANCE ───────────────────────────────────────────────────
  { title: "La La Land", year: 2016, genre: "Romance", genres: ["Romance", "Drama", "Comedy"], budget: 30000000, locations: 20, castSize: 15, vfxHeavy: 2, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.5, actionRatio: 0.5, pages: 120, nightHeavy: true },
  { title: "The Notebook", year: 2004, genre: "Romance", genres: ["Romance", "Drama"], budget: 29000000, locations: 12, castSize: 14, vfxHeavy: 1, stuntHeavy: 0, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 115, nightHeavy: false },
  { title: "Before Sunrise", year: 1995, genre: "Romance", genres: ["Romance", "Drama"], budget: 2500000, locations: 10, castSize: 4, vfxHeavy: 0, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.9, actionRatio: 0.1, pages: 105, nightHeavy: true },
  { title: "Crazy Rich Asians", year: 2018, genre: "Romance", genres: ["Romance", "Comedy"], budget: 30000000, locations: 18, castSize: 22, vfxHeavy: 1, stuntHeavy: 0, period: 'contemporary', dialogueRatio: 0.65, actionRatio: 0.35, pages: 120, nightHeavy: true },
  { title: "Pride & Prejudice", year: 2005, genre: "Romance", genres: ["Romance", "Drama"], budget: 28000000, locations: 15, castSize: 20, vfxHeavy: 0, stuntHeavy: 0, period: 'period', dialogueRatio: 0.65, actionRatio: 0.35, pages: 127, nightHeavy: false },

  // ── FANTASY ───────────────────────────────────────────────────
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, genre: "Fantasy", genres: ["Fantasy", "Action", "Drama"], budget: 93000000, locations: 35, castSize: 40, vfxHeavy: 9, stuntHeavy: 8, period: 'period', dialogueRatio: 0.5, actionRatio: 0.5, pages: 214, nightHeavy: true },
  { title: "Pan's Labyrinth", year: 2006, genre: "Fantasy", genres: ["Fantasy", "Drama", "War"], budget: 19000000, locations: 10, castSize: 14, vfxHeavy: 7, stuntHeavy: 3, period: 'period', dialogueRatio: 0.45, actionRatio: 0.55, pages: 120, nightHeavy: true },
  { title: "The Shape of Water", year: 2017, genre: "Fantasy", genres: ["Fantasy", "Drama", "Romance"], budget: 19500000, locations: 10, castSize: 12, vfxHeavy: 6, stuntHeavy: 2, period: 'period', dialogueRatio: 0.4, actionRatio: 0.6, pages: 123, nightHeavy: true },
  { title: "Harry Potter and the Sorcerer's Stone", year: 2001, genre: "Fantasy", genres: ["Fantasy"], budget: 125000000, locations: 20, castSize: 30, vfxHeavy: 8, stuntHeavy: 5, period: 'contemporary', dialogueRatio: 0.55, actionRatio: 0.45, pages: 152, nightHeavy: true },

  // ── WESTERN ───────────────────────────────────────────────────
  { title: "Django Unchained", year: 2012, genre: "Western", genres: ["Western", "Action", "Drama"], budget: 100000000, locations: 30, castSize: 35, vfxHeavy: 2, stuntHeavy: 7, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 166, nightHeavy: false },
  { title: "True Grit", year: 2010, genre: "Western", genres: ["Western", "Drama"], budget: 38000000, locations: 15, castSize: 14, vfxHeavy: 1, stuntHeavy: 5, period: 'period', dialogueRatio: 0.6, actionRatio: 0.4, pages: 118, nightHeavy: false },
  { title: "The Hateful Eight", year: 2015, genre: "Western", genres: ["Western", "Thriller"], budget: 44000000, locations: 4, castSize: 12, vfxHeavy: 1, stuntHeavy: 4, period: 'period', dialogueRatio: 0.75, actionRatio: 0.25, pages: 167, nightHeavy: false },
];

// ────────────────────────────────────────────────────────────────
// MATCHING ENGINE
// ────────────────────────────────────────────────────────────────

/** Weights for each dimension — genre dominates, then scale, then texture. */
const W = {
  genre:        3.0,   // must match genre or it's heavily penalised
  period:       1.5,   // period vs contemporary is a huge budget driver
  vfx:          1.2,
  stunts:       1.0,
  dialogueRatio:1.0,
  actionRatio:  0.8,
  locations:    0.6,
  castSize:     0.5,
  pages:        0.4,
  nightHeavy:   0.3,
};

function genreSimilarity(features: ExtractedFeatures, movie: MovieRecord): number {
  const sg = features.genre.toLowerCase();
  const scriptGenres = [sg, ...features.subGenres.map(g => g.toLowerCase())];
  const movieGenres = movie.genres.map(g => g.toLowerCase());

  // Exact primary genre match
  if (movie.genre.toLowerCase() === sg) return 1.0;
  // Movie's secondary genres contain script's primary genre
  if (movieGenres.includes(sg)) return 0.8;
  // Script's sub-genres match movie's primary genre
  if (scriptGenres.includes(movie.genre.toLowerCase())) return 0.75;
  // Any overlap between script genres and movie genres
  const overlap = scriptGenres.filter(g => movieGenres.includes(g));
  if (overlap.length > 0) return 0.6;

  // Related genres — map common overlaps
  const related: Record<string, string[]> = {
    action:   ['thriller', 'war', 'western', 'crime', 'espionage', 'heist'],
    thriller: ['action', 'horror', 'drama', 'crime', 'mystery', 'noir', 'psychological', 'espionage'],
    horror:   ['thriller', 'sci-fi', 'supernatural', 'psychological', 'mystery'],
    drama:    ['romance', 'war', 'thriller', 'crime', 'biographical', 'political', 'coming-of-age'],
    comedy:   ['romance', 'drama', 'coming-of-age', 'musical'],
    'sci-fi': ['action', 'horror', 'thriller', 'fantasy', 'disaster', 'survival'],
    romance:  ['comedy', 'drama', 'coming-of-age', 'musical'],
    war:      ['action', 'drama', 'survival'],
    fantasy:  ['sci-fi', 'action', 'drama'],
    western:  ['action', 'drama', 'crime'],
    crime:    ['thriller', 'action', 'drama', 'noir', 'heist'],
    mystery:  ['thriller', 'crime', 'noir', 'horror'],
    noir:     ['thriller', 'crime', 'mystery', 'drama'],
    psychological: ['thriller', 'horror', 'drama'],
    supernatural: ['horror', 'fantasy', 'thriller'],
    'coming-of-age': ['comedy', 'drama', 'romance'],
    musical:  ['comedy', 'romance', 'drama'],
    sports:   ['drama', 'comedy', 'biographical'],
    political:['drama', 'thriller'],
    biographical: ['drama', 'political', 'sports'],
    heist:    ['crime', 'action', 'thriller'],
    espionage:['thriller', 'action'],
    disaster: ['action', 'sci-fi', 'survival'],
    survival: ['drama', 'action', 'war'],
  };
  const allScriptRelated = new Set(scriptGenres.flatMap(g => related[g] || []));
  if (allScriptRelated.has(movie.genre.toLowerCase())) return 0.35;
  if (movieGenres.some(g => allScriptRelated.has(g))) return 0.2;
  return 0.0;
}

function normalize(val: number, max: number): number {
  return Math.min(val / max, 1.0);
}

function computeSimilarity(features: ExtractedFeatures, movie: MovieRecord): number {
  const gSim = genreSimilarity(features, movie);

  // If genre similarity is zero, this is not a valid comp at all
  if (gSim === 0) return 0;

  const periodMatch = features.periodSetting === movie.period ? 1.0 :
    (features.periodSetting === 'contemporary' && movie.period === 'contemporary') ? 1.0 :
    (features.periodSetting !== 'contemporary' && movie.period !== 'contemporary') ? 0.5 : 0.0;

  // Normalise script features to same 0-1 scale as movie features
  const sVfx = normalize(features.vfxPages, 10);
  const mVfx = movie.vfxHeavy / 10;
  const sStunt = normalize(features.stuntPages, 10);
  const mStunt = movie.stuntHeavy / 10;
  const sLoc = normalize(features.uniqueLocations, 50);
  const mLoc = normalize(movie.locations, 50);
  const sCast = normalize(features.speakingRoles, 60);
  const mCast = normalize(movie.castSize, 60);
  const sPages = normalize(features.estimatedPages, 220);
  const mPages = normalize(movie.pages, 220);
  const sNight = features.nightSceneRatio > 0.35 ? 1 : 0;
  const mNight = movie.nightHeavy ? 1 : 0;

  // Compute per-dimension similarity (1 - |diff|)
  const dims = [
    { w: W.genre,         sim: gSim },
    { w: W.period,        sim: periodMatch },
    { w: W.vfx,           sim: 1 - Math.abs(sVfx - mVfx) },
    { w: W.stunts,        sim: 1 - Math.abs(sStunt - mStunt) },
    { w: W.dialogueRatio, sim: 1 - Math.abs(features.dialogueRatio - movie.dialogueRatio) },
    { w: W.actionRatio,   sim: 1 - Math.abs(features.actionRatio - movie.actionRatio) },
    { w: W.locations,     sim: 1 - Math.abs(sLoc - mLoc) },
    { w: W.castSize,      sim: 1 - Math.abs(sCast - mCast) },
    { w: W.pages,         sim: 1 - Math.abs(sPages - mPages) },
    { w: W.nightHeavy,    sim: sNight === mNight ? 1 : 0 },
  ];

  const totalWeight = dims.reduce((s, d) => s + d.w, 0);
  const weightedSum = dims.reduce((s, d) => s + d.w * d.sim, 0);

  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

/**
 * Find the most similar movies — genre-aware, weighted multi-factor matching
 */
export function findCompTitles(features: ExtractedFeatures, topN: number = 5): CompTitle[] {
  const scored = DB.map(movie => ({
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    budget: movie.budget,
    similarity: computeSimilarity(features, movie),
    features: {
      uniqueLocations: movie.locations,
      speakingRoles: movie.castSize,
      vfxPages: movie.vfxHeavy,
      stuntPages: movie.stuntHeavy,
      periodSetting: movie.period,
      dialogueRatio: movie.dialogueRatio,
      estimatedPages: movie.pages,
    } as Partial<ExtractedFeatures>,
  }));

  // Filter out zero-similarity (completely unrelated genre), then sort
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.filter(s => s.similarity > 0).slice(0, topN);
}
