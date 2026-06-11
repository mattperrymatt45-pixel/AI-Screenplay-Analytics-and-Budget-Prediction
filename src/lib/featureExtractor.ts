import { ParsedScript, ExtractedFeatures, CastTier } from '../types';

// ────────────────────────────────────────────────────────────────
// LOCATION & COUNTRY DETECTION
// ────────────────────────────────────────────────────────────────

// All countries — searched ONLY in scene headings and SUPER/TITLE lines
const ALL_COUNTRIES: Record<string, string> = {
  'afghanistan': 'Afghanistan', 'albania': 'Albania', 'algeria': 'Algeria',
  'argentina': 'Argentina', 'australia': 'Australia', 'austria': 'Austria',
  'bangladesh': 'Bangladesh', 'belgium': 'Belgium', 'brazil': 'Brazil',
  'cambodia': 'Cambodia', 'canada': 'Canada', 'chile': 'Chile',
  'china': 'China', 'colombia': 'Colombia', 'congo': 'Congo',
  'croatia': 'Croatia', 'cuba': 'Cuba', 'czech republic': 'Czech Republic',
  'denmark': 'Denmark', 'egypt': 'Egypt', 'england': 'England',
  'ethiopia': 'Ethiopia', 'finland': 'Finland', 'france': 'France',
  'georgia': 'Georgia', 'germany': 'Germany', 'greece': 'Greece',
  'hungary': 'Hungary', 'iceland': 'Iceland', 'india': 'India',
  'indonesia': 'Indonesia', 'iran': 'Iran', 'iraq': 'Iraq',
  'ireland': 'Ireland', 'israel': 'Israel', 'italy': 'Italy',
  'jamaica': 'Jamaica', 'japan': 'Japan', 'jordan': 'Jordan',
  'kenya': 'Kenya', 'korea': 'Korea', 'south korea': 'South Korea',
  'north korea': 'North Korea', 'lebanon': 'Lebanon', 'libya': 'Libya',
  'malaysia': 'Malaysia', 'mexico': 'Mexico', 'morocco': 'Morocco',
  'nepal': 'Nepal', 'netherlands': 'Netherlands', 'new zealand': 'New Zealand',
  'nigeria': 'Nigeria', 'norway': 'Norway', 'pakistan': 'Pakistan',
  'peru': 'Peru', 'philippines': 'Philippines', 'poland': 'Poland',
  'portugal': 'Portugal', 'romania': 'Romania', 'russia': 'Russia',
  'saudi arabia': 'Saudi Arabia', 'scotland': 'Scotland',
  'singapore': 'Singapore', 'south africa': 'South Africa',
  'spain': 'Spain', 'sweden': 'Sweden', 'switzerland': 'Switzerland',
  'syria': 'Syria', 'thailand': 'Thailand', 'turkey': 'Turkey',
  'ukraine': 'Ukraine', 'united kingdom': 'United Kingdom',
  'vietnam': 'Vietnam', 'wales': 'Wales',
};

// City → Country mapping — detects country from foreign city names in scene headings
const CITY_TO_COUNTRY: Record<string, string> = {
  // Europe
  'london': 'England', 'paris': 'France', 'berlin': 'Germany', 'munich': 'Germany',
  'hamburg': 'Germany', 'frankfurt': 'Germany', 'rome': 'Italy', 'milan': 'Italy',
  'naples': 'Italy', 'venice': 'Italy', 'florence': 'Italy', 'madrid': 'Spain',
  'barcelona': 'Spain', 'seville': 'Spain', 'lisbon': 'Portugal',
  'amsterdam': 'Netherlands', 'brussels': 'Belgium', 'vienna': 'Austria',
  'zurich': 'Switzerland', 'geneva': 'Switzerland', 'prague': 'Czech Republic',
  'budapest': 'Hungary', 'warsaw': 'Poland', 'krakow': 'Poland',
  'athens': 'Greece', 'stockholm': 'Sweden', 'oslo': 'Norway',
  'copenhagen': 'Denmark', 'helsinki': 'Finland', 'dublin': 'Ireland',
  'edinburgh': 'Scotland', 'glasgow': 'Scotland', 'reykjavik': 'Iceland',
  'moscow': 'Russia', 'st. petersburg': 'Russia', 'saint petersburg': 'Russia',
  'kiev': 'Ukraine', 'kyiv': 'Ukraine', 'istanbul': 'Turkey',
  'bucharest': 'Romania', 'belgrade': 'Serbia', 'zagreb': 'Croatia',
  'marseille': 'France', 'lyon': 'France', 'nice': 'France',
  'monte carlo': 'Monaco', 'monaco': 'Monaco',
  // Asia
  'tokyo': 'Japan', 'osaka': 'Japan', 'kyoto': 'Japan',
  'beijing': 'China', 'shanghai': 'China', 'hong kong': 'China',
  'shenzhen': 'China', 'guangzhou': 'China',
  'mumbai': 'India', 'delhi': 'India', 'new delhi': 'India',
  'kolkata': 'India', 'chennai': 'India', 'bangalore': 'India',
  'bangkok': 'Thailand', 'seoul': 'South Korea', 'busan': 'South Korea',
  'taipei': 'Taiwan', 'singapore': 'Singapore', 'kuala lumpur': 'Malaysia',
  'hanoi': 'Vietnam', 'ho chi minh': 'Vietnam', 'saigon': 'Vietnam',
  'phnom penh': 'Cambodia', 'manila': 'Philippines',
  'jakarta': 'Indonesia', 'bali': 'Indonesia',
  'dubai': 'UAE', 'abu dhabi': 'UAE', 'riyadh': 'Saudi Arabia',
  'tehran': 'Iran', 'baghdad': 'Iraq', 'kabul': 'Afghanistan',
  'beirut': 'Lebanon', 'damascus': 'Syria', 'amman': 'Jordan',
  'jerusalem': 'Israel', 'tel aviv': 'Israel',
  // Africa
  'cairo': 'Egypt', 'nairobi': 'Kenya', 'johannesburg': 'South Africa',
  'cape town': 'South Africa', 'lagos': 'Nigeria', 'casablanca': 'Morocco',
  'marrakech': 'Morocco', 'addis ababa': 'Ethiopia', 'accra': 'Ghana',
  // Americas (non-US)
  'toronto': 'Canada', 'montreal': 'Canada', 'vancouver': 'Canada',
  'ottawa': 'Canada', 'calgary': 'Canada',
  'mexico city': 'Mexico', 'cancun': 'Mexico', 'guadalajara': 'Mexico',
  'tijuana': 'Mexico',
  'havana': 'Cuba', 'kingston': 'Jamaica',
  'rio de janeiro': 'Brazil', 'sao paulo': 'Brazil', 'brasilia': 'Brazil',
  'buenos aires': 'Argentina', 'bogota': 'Colombia', 'lima': 'Peru',
  'santiago': 'Chile', 'caracas': 'Venezuela',
  // Oceania
  'sydney': 'Australia', 'melbourne': 'Australia', 'brisbane': 'Australia',
  'perth': 'Australia', 'auckland': 'New Zealand', 'wellington': 'New Zealand',
};

// US cities / states — if these appear in scene headings, the location is domestic
const US_LOCATIONS = new Set([
  'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia',
  'san antonio', 'san diego', 'dallas', 'san francisco', 'austin', 'seattle',
  'denver', 'boston', 'nashville', 'detroit', 'portland', 'las vegas', 'memphis',
  'atlanta', 'miami', 'minneapolis', 'cleveland', 'pittsburgh', 'st. louis',
  'cincinnati', 'kansas city', 'new orleans', 'milwaukee', 'sacramento',
  'honolulu', 'anchorage', 'baltimore', 'charlotte', 'raleigh', 'tampa',
  'orlando', 'jacksonville', 'indianapolis', 'columbus', 'san jose',
  'fort worth', 'el paso', 'tucson', 'albuquerque', 'omaha', 'tulsa',
  'oakland', 'long beach', 'virginia beach', 'reno', 'boise',
  'brooklyn', 'manhattan', 'queens', 'bronx', 'harlem', 'hollywood',
  'beverly hills', 'malibu', 'compton', 'venice beach', 'santa monica',
  'soho', 'tribeca', 'greenwich village', 'times square', 'wall street',
  'central park', 'coney island', 'the bronx', 'staten island',
  'silicon valley', 'napa valley', 'lake tahoe', 'cape cod', 'martha\'s vineyard',
  // States
  'california', 'texas', 'florida', 'illinois', 'ohio', 'pennsylvania',
  'michigan', 'massachusetts', 'virginia', 'washington', 'colorado',
  'arizona', 'tennessee', 'maryland', 'minnesota', 'wisconsin', 'missouri',
  'oregon', 'connecticut', 'louisiana', 'kentucky', 'alabama', 'oklahoma',
  'iowa', 'mississippi', 'arkansas', 'utah', 'nevada', 'new mexico',
  'nebraska', 'montana', 'idaho', 'hawaii', 'maine', 'vermont',
  'wyoming', 'north dakota', 'south dakota', 'alaska', 'georgia',
  'new jersey', 'north carolina', 'south carolina', 'west virginia',
  'new hampshire', 'rhode island', 'delaware',
  'indiana', 'kansas',
]);

/**
 * Normalize a raw scene heading location string:
 * - Strip sub-locations after " - " (keep the base location)
 * - Strip scene numbers (#42#)
 * - Strip parenthetical tags (FLASHBACK), (CONTINUOUS), etc.
 * - Normalize whitespace and case
 */
function normalizeLocation(raw: string): string {
  let loc = raw
    .replace(/#\d+#/g, '')                         // scene numbers
    .replace(/\(.*?\)/g, '')                        // parentheticals
    .replace(/\s*[-–—]\s+(?!(?:INT|EXT))\S.*$/i, '') // sub-locations after dash
    .replace(/\s+/g, ' ')
    .trim();
  // Title-case for consistency
  loc = loc.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  return loc;
}

/**
 * Extract the base/root location from a heading.
 * "JOHN'S APARTMENT - BEDROOM" → "JOHN'S APARTMENT"
 * "WAREHOUSE - BACK ROOM - NIGHT" is already time-stripped, so this handles
 * remaining dashes that are sub-locations.
 */
function baseLocation(loc: string): string {
  // Split on common sub-location separators and take the first part
  const parts = loc.split(/\s*[-–—\/]\s*/);
  return parts[0].trim();
}

// ────────────────────────────────────────────────────────────────
// PERIOD DETECTION
// ────────────────────────────────────────────────────────────────

// Explicit year / decade references (highest signal)
const YEAR_PATTERNS = [
  // "1973", "1840s", "SUPER: 1965", etc.
  /\b(1[0-7]\d{2})\b/g,              // 1000–1799
  /\b(18\d{2})\b/g,                  // 1800–1899
  /\b(19[0-6]\d)\b/g,                // 1900–1969
  /\b(197\d)\b/g,                    // 1970–1979
  /\b(198\d)\b/g,                    // 1980–1989
  /\b(199\d)\b/g,                    // 1990–1999
  /\b(1\d{2}0s)\b/gi,               // "1920s", "1970s", etc.
];
// These decades are contemporary (roughly 2000+)
const CONTEMPORARY_YEAR_MIN = 2000;

// Era-specific vocabulary — grouped by rough era for scoring
const ERA_KEYWORDS: { era: string; minYear: number; maxYear: number; words: string[] }[] = [
  { era: 'ancient', minYear: -5000, maxYear: 500, words: [
    'chariot', 'gladiator', 'colosseum', 'centurion', 'legionnaire', 'toga',
    'pharaoh', 'pyramid', 'hieroglyph', 'senate of rome', 'amphitheater',
    'ancient rome', 'ancient greece', 'ancient egypt', 'bc', 'b.c.',
  ]},
  { era: 'medieval', minYear: 500, maxYear: 1500, words: [
    'castle', 'knight', 'armor', 'armour', 'catapult', 'drawbridge', 'moat',
    'dungeon', 'serf', 'feudal', 'medieval', 'crusade', 'plague',
    'longbow', 'crossbow', 'trebuchet', 'joust', 'tournament',
    'monastery', 'parchment', 'scroll', 'quill',
  ]},
  { era: 'early-modern', minYear: 1500, maxYear: 1800, words: [
    'musket', 'cannon', 'galleon', 'sailing ship', 'corsair', 'pirate ship',
    'colonial', 'plantation', 'powdered wig', 'bayonet', 'flintlock',
    'revolutionary war', 'independence', 'guillotine', 'reign of terror',
    'three-corner hat', 'tricorn',
  ]},
  { era: 'victorian', minYear: 1800, maxYear: 1910, words: [
    'victorian', 'corset', 'bonnet', 'waistcoat', 'cravat', 'petticoat',
    'gas lamp', 'oil lamp', 'horse-drawn', 'carriage', 'top hat',
    'telegraph', 'morse code', 'gramophone', 'phonograph', 'daguerreotype',
    'steam engine', 'locomotive', 'industrial revolution', 'workhouse',
    'civil war', 'confederate', 'union army', 'abolition',
  ]},
  { era: 'early-20th', minYear: 1910, maxYear: 1945, words: [
    'prohibition', 'speakeasy', 'bootlegger', 'flapper', 'jazz age',
    'world war', 'wwi', 'wwii', 'war bonds', 'ration', 'trenches',
    'trench warfare', 'foxhole', 'd-day', 'normandy', 'blitz',
    'nazi', 'gestapo', 'concentration camp', 'allied forces',
    'biplane', 'zeppelin', 'tommy gun', 'thompson', 'model t', 'model-t',
    'great depression', 'dust bowl', 'new deal',
  ]},
  { era: 'mid-century', minYear: 1945, maxYear: 1970, words: [
    'atomic bomb', 'nuclear test', 'cold war', 'iron curtain',
    'mccarthyism', 'red scare', 'beatnik', 'hula hoop',
    'jukebox', 'sock hop', 'poodle skirt', 'greaser',
    'drive-in', 'diner', 'milkshake', 'soda fountain',
    'elvis', 'rock and roll', 'motown',
    'civil rights', 'segregation', 'sit-in', 'freedom riders',
    'kennedy', 'jfk', 'cuban missile', 'bay of pigs',
    'korean war', 'vietnam', 'draft card',
  ]},
  { era: '70s-80s', minYear: 1970, maxYear: 1990, words: [
    'bell-bottoms', 'bell bottoms', 'disco', 'discotheque', 'afro',
    'lava lamp', 'shag carpet', 'wood paneling', 'wood-paneled',
    'watergate', 'nixon', 'vietnam war', 'draft dodger',
    'hippie', 'commune', 'flower power', 'peace sign',
    'payphone', 'pay phone', 'rotary phone', 'rotary dial',
    'cassette', 'cassette tape', 'walkman', 'boombox', 'boom box',
    'vinyl record', 'record player', 'turntable', '8-track', 'eight-track',
    'polaroid', 'polaroid camera', 'typewriter',
    'station wagon', 'wood-paneled', 'muscle car',
    'pager', 'beeper', 'floppy disk', 'floppy', 'commodore', 'atari',
    'reagan', 'cold war', 'berlin wall', 'iron curtain',
    'punk rock', 'new wave', 'mtv', 'breakdancing',
    'cocaine cowboys', 'crack epidemic',
    'mall', 'roller rink', 'roller skates', 'roller disco',
    'vhs', 'betamax', 'vcr', 'video rental',
  ]},
  { era: '90s', minYear: 1990, maxYear: 2000, words: [
    'dial-up', 'aol', 'aim', 'chatroom', 'y2k',
    'pager', 'beeper', 'brick phone', 'flip phone',
    'cd player', 'discman', 'compact disc',
    'grunge', 'nirvana', 'flannel shirt',
    'vhs', 'blockbuster video', 'video rental',
    'super nintendo', 'sega', 'game boy', 'tamagotchi',
    'floppy disk', 'windows 95', 'windows 98',
    'clinton', 'lewinsky', 'gulf war', 'desert storm',
    'world wide web', 'netscape',
  ]},
];

const FUTURISTIC_KEYWORDS = [
  'hologram', 'android', 'cyborg', 'spaceship', 'spacecraft', 'starship',
  'laser', 'plasma', 'quantum computer', 'nanobot', 'nanobots',
  'artificial intelligence', 'neural link', 'neural interface',
  'robot', 'mech suit', 'cybernetic', 'bionic', 'cloning facility',
  'terraforming', 'hyperspace', 'warp drive', 'light speed', 'lightsaber',
  'teleporter', 'replicator', 'force field', 'blaster', 'phaser',
  'augmented reality', 'upload consciousness', 'digital consciousness',
  'dystopian', 'utopian', 'post-apocalyptic', 'colonize mars', 'space station',
  'exoplanet', 'intergalactic', 'interstellar', 'cryosleep', 'cryogenic',
  'singularity', 'matrix', 'metaverse',
  'hover car', 'hovercraft', 'flying car', 'jetpack',
];

// ────────────────────────────────────────────────────────────────
// OTHER KEYWORD LISTS
// ────────────────────────────────────────────────────────────────

const STUNT_KEYWORDS = [
  'fight', 'fights', 'fighting', 'punch', 'punches', 'kick', 'kicks',
  'crash', 'crashes', 'smash', 'smashes', 'shoot', 'shoots', 'shooting',
  'gunshot', 'gunfire', 'bullet', 'bullets', 'chase', 'chases', 'chasing',
  'explosion', 'explode', 'explodes', 'blow up', 'blows up',
  'fall', 'falls', 'falling', 'jump', 'jumps', 'jumping', 'leap',
  'sword', 'stab', 'stabbing', 'knife', 'tackle', 'tackles',
  'car chase', 'helicopter', 'motorcycle', 'wreck', 'collision',
  'hang', 'hanging', 'cliff', 'rappel', 'swing', 'swinging',
  'wrestle', 'grapple', 'combat', 'battle', 'attack', 'attacks',
  'flip', 'flips', 'somersault', 'dodges', 'ducks',
  'slam', 'slams', 'throw', 'throws', 'thrown', 'hit', 'hits',
  'gun', 'rifle', 'pistol', 'weapon', 'weapons', 'blood', 'wound',
];

const VFX_KEYWORDS = [
  'cgi', 'green screen', 'blue screen', 'visual effects', 'vfx',
  'explosion', 'explode', 'morph', 'morphs', 'transform', 'transforms',
  'alien', 'aliens', 'spaceship', 'spacecraft', 'laser', 'lasers',
  'dragon', 'dragons', 'monster', 'monsters', 'creature', 'creatures',
  'magic', 'magical', 'spell', 'spells', 'supernatural', 'teleport',
  'hologram', 'holographic', 'robot', 'robots', 'android', 'cyborg',
  'underwater', 'space', 'galaxy', 'planet', 'planets', 'asteroid',
  'portal', 'dimension', 'invisible', 'invisibility', 'flying', 'levitate',
  'force field', 'shield', 'energy beam', 'lightning bolt',
  'ghost', 'ghosts', 'phantom', 'spirit', 'spirits', 'apparition',
  'miniature', 'giant', 'shrink', 'grow', 'mutation', 'mutant',
  'time travel', 'warp', 'digital', 'simulation', 'virtual reality',
  'fire', 'fireball', 'ice', 'freeze', 'tornado', 'hurricane', 'tsunami',
  'earthquake', 'volcano', 'lava', 'flood', 'avalanche',
];

// ────────────────────────────────────────────────────────────────
// GENRE CLASSIFICATION — primary genres + sub-genres
// ────────────────────────────────────────────────────────────────
// Each genre has heavily-weighted "strong" keywords (×3) that are
// unambiguous indicators, plus normal keywords (×1).

interface GenreEntry {
  strong: string[];   // high-signal, ×3 weight
  normal: string[];   // supporting signal, ×1 weight
}

const GENRE_KEYWORDS: Record<string, GenreEntry> = {
  // ── Primary Genres ────────────────────────────────────────
  'Action': {
    strong: ['gunfire', 'gunshot', 'explosion', 'car chase', 'shootout',
      'hand-to-hand', 'martial arts', 'roundhouse', 'uppercut', 'ambush',
      'detonator', 'grenade', 'sniper', 'assault rifle', 'bazooka',
      'getaway', 'high-speed', 'rooftop chase', 'firefight', 'standoff'],
    normal: ['fight', 'chase', 'gun', 'shoot', 'battle', 'combat', 'attack',
      'weapon', 'crash', 'punch', 'kick', 'tackle', 'slam', 'dodge',
      'bullet', 'rifle', 'pistol', 'knife', 'sword', 'explode',
      'helicopter', 'motorcycle', 'smash', 'wreck', 'collision',
      'blow up', 'detonate', 'sprint', 'leap', 'vault', 'rappel'],
  },
  'Comedy': {
    strong: ['laughs', 'hilarious', 'punchline', 'slapstick', 'pratfall',
      'deadpan', 'wisecrack', 'double take', 'sight gag', 'comic',
      'absurd', 'farce', 'parody', 'satirical', 'tongue-in-cheek',
      'running gag', 'awkward silence', 'cringe', 'embarrassing'],
    normal: ['laugh', 'funny', 'joke', 'chuckle', 'giggle', 'sarcastic',
      'witty', 'smirk', 'grin', 'amused', 'ridiculous', 'goofy',
      'clumsy', 'mishap', 'bumbling', 'shenanigans', 'antic',
      'playful', 'teasing', 'banter', 'snicker', 'roast', 'mock'],
  },
  'Drama': {
    strong: ['emotional', 'betrayal', 'devastating', 'heartbreaking',
      'confession', 'forgiveness', 'grief', 'mourning', 'funeral',
      'divorce', 'custody', 'addiction', 'rehab', 'intervention',
      'estranged', 'reconciliation', 'terminal', 'diagnosis',
      'courtroom', 'testimony', 'verdict', 'injustice'],
    normal: ['tears', 'relationship', 'family', 'conflict', 'struggle',
      'love', 'loss', 'pain', 'anger', 'sorrow', 'regret',
      'argue', 'argument', 'tension', 'disappointed', 'vulnerable',
      'hug', 'crying', 'sob', 'whisper', 'silence', 'burden',
      'sacrifice', 'truth', 'secret', 'shame', 'dignity', 'hope'],
  },
  'Horror': {
    strong: ['scream', 'terrified', 'blood-curdling', 'disembowel',
      'decapitate', 'mutilate', 'possessed', 'exorcism', 'demonic',
      'poltergeist', 'séance', 'undead', 'zombie', 'slaughter',
      'gore', 'severed', 'impale', 'ritual sacrifice', 'occult',
      'nightmare', 'sleep paralysis', 'doppelganger', 'skinwalker'],
    normal: ['blood', 'dark', 'shadow', 'terror', 'fear', 'dead', 'death',
      'ghost', 'monster', 'haunted', 'creepy', 'sinister', 'eerie',
      'corpse', 'skeleton', 'skull', 'coffin', 'grave', 'cemetery',
      'crypt', 'basement', 'attic', 'whisper', 'growl', 'shriek',
      'dread', 'panic', 'trapped', 'stalked', 'prey', 'darkness',
      'paranormal', 'supernatural', 'curse', 'hex', 'omen',
      'asylum', 'insane', 'madness', 'hallucination', 'apparition'],
  },
  'Sci-Fi': {
    strong: ['spaceship', 'spacecraft', 'starship', 'alien', 'aliens',
      'lightyear', 'wormhole', 'hyperspace', 'warp drive', 'stasis pod',
      'cryosleep', 'android', 'cyborg', 'hologram', 'teleport',
      'terraforming', 'exoplanet', 'asteroid belt', 'zero gravity',
      'artificial intelligence', 'neural interface', 'replicant',
      'singularity', 'time paradox', 'multiverse', 'parallel universe'],
    normal: ['planet', 'robot', 'laser', 'galaxy', 'space', 'quantum',
      'futuristic', 'orbital', 'satellite', 'radiation', 'mutation',
      'clone', 'DNA', 'genetic', 'cybernetic', 'bionic', 'nano',
      'simulation', 'matrix', 'virtual', 'digital', 'transmission',
      'signal', 'frequency', 'specimen', 'laboratory', 'experiment',
      'probe', 'scan', 'coordinates', 'trajectory', 'atmosphere'],
  },
  'Thriller': {
    strong: ['suspense', 'kidnap', 'hostage', 'ransom', 'blackmail',
      'stalker', 'serial killer', 'psychopath', 'sociopath', 'profiler',
      'surveillance', 'wiretap', 'conspiracy', 'cover-up', 'double cross',
      'informant', 'mole', 'undercover', 'interrogation', 'confession',
      'alibi', 'crime scene', 'forensic', 'evidence', 'cold case'],
    normal: ['danger', 'escape', 'detective', 'investigate', 'mystery',
      'clue', 'suspect', 'witness', 'chase', 'tense', 'nervous',
      'paranoid', 'surveillance', 'follow', 'tail', 'pursuit',
      'disappear', 'vanish', 'missing', 'abduct', 'captive',
      'betrayal', 'trust', 'deception', 'lie', 'manipulate',
      'reveal', 'uncover', 'expose', 'confront', 'deadline',
      'ticking clock', 'urgent', 'desperate', 'cornered', 'trapped'],
  },
  'Romance': {
    strong: ['passionate', 'making love', 'first kiss', 'soulmate',
      'heartbroken', 'love letter', 'proposal', 'engagement ring',
      'wedding', 'honeymoon', 'affair', 'infidelity', 'jealousy',
      'unrequited', 'star-crossed', 'candlelit', 'seduction',
      'slow dance', 'love at first sight', 'butterflies'],
    normal: ['kiss', 'love', 'heart', 'romance', 'embrace', 'marry',
      'date', 'flirt', 'attract', 'chemistry', 'desire', 'longing',
      'tender', 'caress', 'intimate', 'blush', 'gaze', 'beautiful',
      'handsome', 'charming', 'swept off', 'crush', 'swoon',
      'boyfriend', 'girlfriend', 'lover', 'darling', 'sweetheart'],
  },
  'Fantasy': {
    strong: ['wizard', 'sorcerer', 'sorceress', 'enchantment', 'prophecy',
      'dragon', 'elven', 'dwarf', 'orc', 'troll', 'goblin',
      'unicorn', 'phoenix', 'griffin', 'centaur', 'fairy',
      'enchanted forest', 'dark lord', 'chosen one', 'ancient tome',
      'magic staff', 'crystal ball', 'potion', 'amulet', 'talisman',
      'spell book', 'incantation', 'conjure', 'summon'],
    normal: ['magic', 'magical', 'spell', 'enchant', 'kingdom', 'quest',
      'mythical', 'realm', 'throne', 'crown', 'sword', 'shield',
      'armor', 'castle', 'dungeon', 'tower', 'portal', 'dimension',
      'curse', 'destiny', 'legend', 'ancient', 'mystical',
      'creature', 'beast', 'shapeshifter', 'immortal', 'eternal'],
  },
  'War': {
    strong: ['battlefield', 'trench warfare', 'foxhole', 'platoon',
      'battalion', 'regiment', 'infantry', 'artillery', 'airstrike',
      'carpet bombing', 'napalm', 'barracks', 'court-martial',
      'prisoner of war', 'pow', 'medic', 'casualty', 'fallen soldier',
      'ceasefire', 'armistice', 'd-day', 'normandy', 'allied forces'],
    normal: ['soldier', 'army', 'military', 'trench', 'bomb', 'tank',
      'general', 'enemy', 'rifle', 'grenade', 'convoy', 'ambush',
      'sniper', 'patrol', 'mission', 'deploy', 'flank', 'retreat',
      'surrender', 'invasion', 'occupation', 'liberation', 'combat',
      'veteran', 'wounded', 'shrapnel', 'mortar', 'bunker', 'siege'],
  },
  'Western': {
    strong: ['cowboy', 'gunslinger', 'showdown', 'stagecoach', 'posse',
      'bounty hunter', 'desperado', 'gold rush', 'cattle drive',
      'tumbleweeds', 'six-shooter', 'holster', 'spurs', 'lasso',
      'prairie', 'homestead', 'territory', 'the frontier'],
    normal: ['sheriff', 'saloon', 'ranch', 'outlaw', 'duel', 'frontier',
      'wagon', 'horse', 'revolver', 'marshal', 'deputy', 'wanted',
      'hangman', 'noose', 'gallows', 'canyon', 'desert', 'dust',
      'corral', 'stampede', 'bandit', 'rustler', 'prospector'],
  },

  // ── Sub-Genres ────────────────────────────────────────────
  'Crime': {
    strong: ['heist', 'robbery', 'cartel', 'mob boss', 'godfather',
      'drug deal', 'laundering', 'contraband', 'smuggling', 'syndicate',
      'hit man', 'hitman', 'contract killer', 'organized crime',
      'underworld', 'racket', 'witness protection', 'plea deal',
      'indictment', 'arraignment', 'bail', 'parole', 'probation'],
    normal: ['crime', 'criminal', 'murder', 'robbery', 'steal', 'stolen',
      'thief', 'gang', 'mafia', 'cops', 'police', 'detective',
      'arrest', 'handcuffs', 'prison', 'jail', 'inmate', 'convict',
      'getaway', 'heist', 'loot', 'stash', 'fence', 'alibi',
      'corrupt', 'bribe', 'payoff', 'drug', 'cocaine', 'heroin'],
  },
  'Mystery': {
    strong: ['whodunit', 'red herring', 'prime suspect', 'cold case',
      'missing person', 'private investigator', 'magnifying glass',
      'autopsy', 'cause of death', 'fingerprint', 'dna evidence',
      'murder weapon', 'crime of passion', 'locked room'],
    normal: ['mystery', 'clue', 'suspect', 'detective', 'investigate',
      'evidence', 'witness', 'alibi', 'motive', 'puzzle', 'enigma',
      'disappear', 'vanish', 'hidden', 'secret', 'reveal', 'uncover',
      'solve', 'deduce', 'trace', 'follow', 'lead', 'tip'],
  },
  'Noir': {
    strong: ['femme fatale', 'hard-boiled', 'double-cross', 'gumshoe',
      'private eye', 'seedy', 'underbelly', 'dingy', 'dimly lit',
      'rain-soaked', 'cigarette smoke', 'trench coat', 'venetian blinds',
      'voiceover narration', 'world-weary'],
    normal: ['shadow', 'dark', 'corrupt', 'cynical', 'gritty', 'bleak',
      'neon', 'alley', 'dive bar', 'whiskey', 'bourbon', 'smoke',
      'betrayal', 'deception', 'paranoid', 'doomed', 'fatalistic'],
  },
  'Psychological': {
    strong: ['hallucination', 'delusion', 'paranoia', 'dissociative',
      'split personality', 'alter ego', 'unreliable narrator',
      'gaslighting', 'manipulation', 'obsession', 'compulsion',
      'psychosis', 'breakdown', 'asylum', 'padded cell',
      'rorschach', 'therapy session', 'repressed memory'],
    normal: ['mind', 'sanity', 'insane', 'madness', 'disturbed',
      'twisted', 'unhinged', 'unstable', 'fixated', 'tormented',
      'anxiety', 'phobia', 'nightmare', 'sleepless', 'isolation',
      'mirror', 'reflection', 'identity', 'perception', 'reality'],
  },
  'Supernatural': {
    strong: ['exorcism', 'possessed', 'demonic', 'poltergeist', 'séance',
      'ouija', 'spirit medium', 'afterlife', 'reincarnation',
      'purgatory', 'angel', 'demon', 'devil', 'holy water',
      'crucifix', 'sacred ground', 'unholy', 'prophecy'],
    normal: ['ghost', 'spirit', 'haunted', 'paranormal', 'curse',
      'supernatural', 'apparition', 'phantom', 'omen', 'premonition',
      'beyond the grave', 'otherworldly', 'ethereal', 'spectral',
      'undead', 'resurrection', 'immortal', 'soul'],
  },
  'Coming-of-Age': {
    strong: ['puberty', 'first love', 'prom', 'graduation', 'senior year',
      'freshman', 'adolescent', 'growing up', 'coming of age',
      'losing virginity', 'first beer', 'learner permit', 'sweet sixteen',
      'bar mitzvah', 'bat mitzvah', 'quinceañera'],
    normal: ['teenager', 'teen', 'high school', 'college', 'dorm',
      'homework', 'bully', 'popular', 'outcast', 'clique', 'locker',
      'crush', 'diary', 'journal', 'rebel', 'independence',
      'identity', 'self-discovery', 'innocence', 'naive', 'mature'],
  },
  'Musical': {
    strong: ['musical number', 'choreography', 'dance number', 'showstopper',
      'overture', 'finale', 'curtain call', 'ensemble cast',
      'Broadway', 'audition montage', 'rehearsal', 'opening night',
      'standing ovation', 'encore'],
    normal: ['sing', 'sings', 'singing', 'song', 'dance', 'dancing',
      'melody', 'harmony', 'chorus', 'duet', 'solo', 'orchestra',
      'band', 'concert', 'stage', 'perform', 'performer', 'spotlight',
      'microphone', 'piano', 'guitar', 'drums', 'backstage'],
  },
  'Sports': {
    strong: ['championship', 'tournament', 'playoffs', 'final round',
      'title fight', 'underdog', 'training montage', 'locker room speech',
      'buzzer beater', 'knockout', 'penalty kick', 'home run',
      'touchdown', 'slam dunk', 'photo finish', 'world record'],
    normal: ['coach', 'team', 'player', 'athlete', 'stadium', 'arena',
      'field', 'court', 'ring', 'match', 'game', 'score', 'goal',
      'referee', 'foul', 'penalty', 'injury', 'training', 'workout',
      'gym', 'boxing', 'wrestling', 'football', 'basketball', 'baseball',
      'soccer', 'hockey', 'race', 'sprinting', 'marathon', 'medal'],
  },
  'Political': {
    strong: ['senator', 'congressman', 'congresswoman', 'campaign trail',
      'election night', 'inauguration', 'oval office', 'filibuster',
      'impeachment', 'cabinet meeting', 'state of the union',
      'press secretary', 'diplomatic immunity', 'whistleblower'],
    normal: ['president', 'governor', 'mayor', 'politician', 'campaign',
      'vote', 'ballot', 'democrat', 'republican', 'legislation',
      'bill', 'lobby', 'corruption', 'scandal', 'cover-up',
      'diplomacy', 'ambassador', 'negotiation', 'summit', 'treaty',
      'protest', 'rally', 'activist', 'revolution', 'regime'],
  },
  'Biographical': {
    strong: ['based on a true story', 'based on true events', 'true story',
      'inspired by real events', 'the real', 'the true story of',
      'biographical', 'biopic', 'memoir'],
    normal: ['legacy', 'legendary', 'visionary', 'pioneer', 'genius',
      'prodigy', 'rise and fall', 'early life', 'born in',
      'childhood', 'fame', 'notoriety', 'icon', 'hero', 'trailblazer'],
  },
  'Documentary-style': {
    strong: ['talking head', 'interview footage', 'archival footage',
      'found footage', 'handheld camera', 'b-roll', 'voiceover narration',
      'title card', 'on-screen text', 'surveillance footage',
      'confession cam', 'direct to camera', 'mockumentary'],
    normal: ['footage', 'camera', 'interview', 'documentary', 'real',
      'authentic', 'witness', 'testimony', 'record', 'evidence'],
  },
  'Survival': {
    strong: ['stranded', 'shipwreck', 'plane crash survivor', 'ration',
      'dehydration', 'hypothermia', 'frostbite', 'shelter', 'fire starter',
      'signal fire', 'rescue party', 'last resort', 'will to live'],
    normal: ['survive', 'survival', 'wilderness', 'stranded', 'isolated',
      'hunt', 'trap', 'forage', 'predator', 'exposure', 'thirst',
      'starvation', 'desperate', 'endure', 'harsh', 'unforgiving'],
  },
  'Heist': {
    strong: ['the plan', 'the job', 'inside man', 'the vault', 'safe cracker',
      'getaway driver', 'blueprints', 'security system', 'alarm',
      'laser grid', 'disguise', 'con artist', 'the score', 'the take',
      'double cross', 'split the money', 'clean getaway'],
    normal: ['heist', 'robbery', 'steal', 'vault', 'safe', 'diamond',
      'jewel', 'bank', 'museum', 'crew', 'team', 'plan', 'scheme',
      'fence', 'loot', 'score', 'caper', 'mastermind'],
  },
  'Espionage': {
    strong: ['classified', 'top secret', 'covert operation', 'double agent',
      'sleeper agent', 'dead drop', 'safe house', 'extraction point',
      'cipher', 'code name', 'handler', 'asset', 'burned',
      'defection', 'intelligence agency', 'black ops'],
    normal: ['spy', 'espionage', 'agent', 'intelligence', 'cia', 'mi6',
      'fbi', 'kgb', 'mossad', 'operative', 'mission', 'target',
      'surveillance', 'infiltrate', 'undercover', 'encrypted',
      'passport', 'alias', 'tradecraft', 'rendezvous', 'extraction'],
  },
  'Disaster': {
    strong: ['earthquake', 'tsunami', 'volcanic eruption', 'category five',
      'hurricane', 'tornado', 'tidal wave', 'nuclear meltdown',
      'mass evacuation', 'ground zero', 'epicenter', 'aftershock',
      'infrastructure collapse', 'dam burst', 'pandemic'],
    normal: ['disaster', 'catastrophe', 'destruction', 'collapse', 'flood',
      'fire', 'inferno', 'rubble', 'debris', 'evacuate', 'shelter',
      'emergency', 'rescue', 'survivor', 'death toll', 'chaos'],
  },
  'Animated': {
    strong: ['animated', 'animation', 'cartoon', 'pixar', 'disney',
      'voice over', 'voice cast', 'storyboard', 'cel', 'frame by frame',
      'cgi character', 'motion capture', 'mo-cap'],
    normal: ['animate', 'render', 'character design', 'puppet', 'claymation'],
  },
};

// ────────────────────────────────────────────────────────────────
// MAIN EXTRACTOR
// ────────────────────────────────────────────────────────────────

export function extractFeatures(script: ParsedScript): ExtractedFeatures {
  const { elements } = script;

  // ── Scene & Location Analysis ────────────────────────────────
  const sceneHeadings = elements.filter(e => e.type === 'scene_heading');
  const totalScenes = sceneHeadings.length;

  const locationSet = new Set<string>();
  let interiorCount = 0;
  let exteriorCount = 0;
  let intExtCount = 0;
  let nightSceneCount = 0;

  const sceneHeadingTexts: string[] = [];
  const rawLocationStrings: string[] = []; // cleaned heading text for each scene

  sceneHeadings.forEach(scene => {
    const text = scene.text.toUpperCase();
    sceneHeadingTexts.push(text);

    if (/INT\.?\s*\/\s*EXT\.|I\/E/i.test(text)) {
      intExtCount++;
    } else if (/INT\.?\s/i.test(text)) {
      interiorCount++;
    } else if (/EXT\.?\s/i.test(text)) {
      exteriorCount++;
    }

    if (/NIGHT/i.test(text)) {
      nightSceneCount++;
    }

    // Strip INT./EXT. prefix and time-of-day suffix
    const stripped = text
      .replace(/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.?|EST\.)\s*/i, '')
      .replace(/\s*[-–—]\s*(DAY|NIGHT|DAWN|DUSK|MORNING|EVENING|LATER|CONTINUOUS|SAME|MOMENTS LATER|SUNSET|SUNRISE|MAGIC HOUR|PREDAWN).*$/i, '')
      .trim();

    if (stripped) {
      rawLocationStrings.push(stripped);
      const normalized = normalizeLocation(stripped);
      const base = baseLocation(normalized);
      if (base) locationSet.add(base);
    }
  });

  // ── Country Detection (scene-heading-only) ───────────────────
  // We ONLY look at scene headings and SUPER/TITLE/CHYRON lines.
  // Never dialogue, never general action text.

  const structuralText = sceneHeadingTexts.join(' ').toLowerCase()
    + ' ' + elements
      .filter(e => e.type === 'action' && /^(SUPER|TITLE|CHYRON)\s*:/i.test(e.text))
      .map(e => e.text.toLowerCase())
      .join(' ');

  const fullText = elements.map(e => e.text).join(' ').toLowerCase();

  const countrySeen = new Set<string>();
  const detectedCountries: string[] = [];

  // Pass 1: Country names directly in scene headings / SUPERs
  for (const [key, display] of Object.entries(ALL_COUNTRIES)) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(structuralText) && !countrySeen.has(display)) {
      countrySeen.add(display);
      detectedCountries.push(display);
    }
  }

  // Pass 2: City names in scene headings → infer country
  for (const [city, country] of Object.entries(CITY_TO_COUNTRY)) {
    const regex = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(structuralText) && !countrySeen.has(country)) {
      countrySeen.add(country);
      detectedCountries.push(country);
    }
  }

  // Determine if this is a US-only production
  const hasUSLocation = [...rawLocationStrings].some(loc => {
    const lower = loc.toLowerCase();
    for (const usLoc of US_LOCATIONS) {
      if (lower.includes(usLoc)) return true;
    }
    return false;
  });

  // Filter: if it's entirely US-based, don't list US states as "countries"
  // Also remove "Georgia" if US state Georgia is more likely (US indicators present)
  const foreignCountries = detectedCountries.filter(c => {
    if (c === 'United States') return false;
    if (c === 'Georgia' && hasUSLocation) return false; // likely the US state
    return true;
  });
  const finalCountries = foreignCountries;

  // ── Character Analysis ───────────────────────────────────────
  const characterElements = elements.filter(e => e.type === 'character');
  const characterCounts: Record<string, number> = {};

  characterElements.forEach(e => {
    const name = e.text.replace(/\s*\(.*\)/, '').trim().toUpperCase();
    if (name && name.length > 1 && name !== 'CONTINUED' && name !== 'CONT' && name !== 'MORE') {
      characterCounts[name] = (characterCounts[name] || 0) + 1;
    }
  });

  const characterNames = Object.keys(characterCounts);
  const speakingRoles = characterNames.length;
  const topCharacters = Object.entries(characterCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, lineCount]) => ({ name, lineCount }));

  // ── Stunt Analysis ───────────────────────────────────────────
  const actionElements = elements.filter(e => e.type === 'action');
  const LINES_PER_PAGE = 55;
  const actionLines = actionElements.map(e => e.text);

  let stuntPageLines = 0;
  actionLines.forEach(line => {
    const lower = line.toLowerCase();
    if (STUNT_KEYWORDS.some(kw => lower.includes(kw))) {
      stuntPageLines += Math.ceil(line.length / 60);
    }
  });
  const stuntPages = Math.round(stuntPageLines / LINES_PER_PAGE);

  // ── VFX Analysis ─────────────────────────────────────────────
  let vfxPageLines = 0;
  const foundVfxKeywords: Set<string> = new Set();

  actionLines.forEach(line => {
    const lower = line.toLowerCase();
    VFX_KEYWORDS.forEach(kw => {
      if (lower.includes(kw)) {
        foundVfxKeywords.add(kw);
        vfxPageLines += Math.ceil(line.length / 60);
      }
    });
  });
  const vfxPages = Math.round(vfxPageLines / LINES_PER_PAGE);

  // ── Period Detection (multi-strategy) ────────────────────────
  // Search ALL text (scene headings, action, dialogue, SUPERs)
  const allText = fullText;
  const allTextForYears = elements.map(e => e.text).join('\n');

  // Strategy 1: Explicit year references
  let detectedYears: number[] = [];
  for (const pattern of YEAR_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(allTextForYears)) !== null) {
      const raw = match[1].replace(/s$/i, ''); // "1970s" → "1970"
      const year = parseInt(raw, 10);
      if (!isNaN(year) && year >= 100 && year < 2100) {
        detectedYears.push(year);
      }
    }
  }
  // Deduplicate
  detectedYears = [...new Set(detectedYears)];

  // Strategy 2: Era-specific vocabulary
  let bestEraScore = 0;
  let bestEra: typeof ERA_KEYWORDS[number] | null = null;
  const actionTextJoined = actionLines.join(' ').toLowerCase();
  const dialogueTextJoined = elements.filter(e => e.type === 'dialogue').map(e => e.text).join(' ').toLowerCase();
  const combinedText = actionTextJoined + ' ' + dialogueTextJoined;
  const totalWords = combinedText.split(/\s+/).length;

  for (const era of ERA_KEYWORDS) {
    let hits = 0;
    for (const word of era.words) {
      const r = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const m = combinedText.match(r);
      if (m) hits += m.length;
    }
    const density = hits / Math.max(totalWords, 1);
    if (density > bestEraScore && hits >= 2) {
      bestEraScore = density;
      bestEra = era;
    }
  }

  // Strategy 3: Futuristic vocabulary
  let futuristicHits = 0;
  for (const kw of FUTURISTIC_KEYWORDS) {
    const r = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const m = combinedText.match(r);
    if (m) futuristicHits += m.length;
  }
  const futuristicDensity = futuristicHits / Math.max(totalWords, 1);

  // Combine signals
  let periodSetting: 'contemporary' | 'period' | 'futuristic' = 'contemporary';
  let periodConfidence = 0.5;

  // Explicit years take precedence
  if (detectedYears.length > 0) {
    const avgYear = detectedYears.reduce((a, b) => a + b, 0) / detectedYears.length;
    const minYear = Math.min(...detectedYears);

    if (minYear < CONTEMPORARY_YEAR_MIN) {
      periodSetting = 'period';
      periodConfidence = Math.min(0.95, 0.7 + detectedYears.length * 0.05);
    } else if (avgYear > 2100) {
      periodSetting = 'futuristic';
      periodConfidence = Math.min(0.95, 0.7 + detectedYears.length * 0.05);
    } else {
      periodSetting = 'contemporary';
      periodConfidence = 0.75;
    }
  }
  // Fall back to vocabulary signals
  else if (futuristicDensity > 0.004 && futuristicHits >= 3 && futuristicDensity > bestEraScore) {
    periodSetting = 'futuristic';
    periodConfidence = Math.min(0.9, 0.5 + futuristicDensity * 40);
  }
  else if (bestEra && bestEraScore > 0.002 && bestEraScore > futuristicDensity) {
    periodSetting = 'period';
    periodConfidence = Math.min(0.9, 0.5 + bestEraScore * 40);
  }
  else {
    periodSetting = 'contemporary';
    periodConfidence = 0.6;
  }

  // ── Dialogue Ratio ───────────────────────────────────────────
  const dialogueElements = elements.filter(e => e.type === 'dialogue');
  const totalEls = elements.filter(e => e.type === 'action' || e.type === 'dialogue').length;
  const dialogueRatio = totalEls > 0 ? dialogueElements.length / totalEls : 0;
  const actionRatio = 1 - dialogueRatio;

  // ── Page Estimation ──────────────────────────────────────────
  const totalLines = elements.reduce((sum, e) => {
    return sum + Math.ceil(e.text.length / 60) + 1;
  }, 0);
  const estimatedPages = Math.round(totalLines / LINES_PER_PAGE);

  // ── Genre Detection (weighted strong/normal keywords) ────────
  const genreScores: Record<string, number> = {};
  const searchText = allText; // full lowercase text

  Object.entries(GENRE_KEYWORDS).forEach(([genre, entry]) => {
    let score = 0;
    // Strong keywords: ×3 weight
    entry.strong.forEach(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = searchText.match(regex);
      if (matches) score += matches.length * 3;
    });
    // Normal keywords: ×1 weight
    entry.normal.forEach(kw => {
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = searchText.match(regex);
      if (matches) score += matches.length;
    });
    genreScores[genre] = score;
  });

  // Primary genres (the big 10)
  const PRIMARY_GENRES = new Set([
    'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi',
    'Thriller', 'Romance', 'Fantasy', 'War', 'Western',
  ]);

  const sortedGenres = Object.entries(genreScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0);

  // Pick the top primary genre
  const topPrimary = sortedGenres.find(([g]) => PRIMARY_GENRES.has(g));
  const genre = topPrimary?.[0] || 'Drama';
  const maxScore = topPrimary?.[1] || 0;
  const totalGenreScore = Object.values(genreScores).reduce((a, b) => a + b, 0);
  const genreConfidence = totalGenreScore > 0 ? maxScore / totalGenreScore : 0.3;

  // Sub-genres: any genre scoring above a threshold (at least 15% of top score)
  // excluding the primary genre. Include both primary-as-secondary and sub-genre types.
  const subGenreThreshold = Math.max(maxScore * 0.15, 3);
  const subGenres = sortedGenres
    .filter(([g, score]) => g !== genre && score >= subGenreThreshold)
    .slice(0, 4)
    .map(([g]) => g);

  // ── Average Dialogue Length ──────────────────────────────────
  const averageDialogueLength = dialogueElements.length > 0
    ? dialogueElements.reduce((sum, e) => sum + e.text.split(/\s+/).length, 0) / dialogueElements.length
    : 0;

  // ── Night Scene Ratio ────────────────────────────────────────
  const nightSceneRatio = totalScenes > 0 ? nightSceneCount / totalScenes : 0;

  // ── Cast Breakdown (tier classification) ─────────────────────
  const characterScenes: Record<string, Set<number>> = {};
  let currentScene = 0;
  for (const el of elements) {
    if (el.type === 'scene_heading') {
      currentScene = el.sceneNumber || currentScene + 1;
    } else if (el.type === 'character') {
      const cName = el.text.replace(/\s*\(.*\)/, '').trim().toUpperCase();
      if (cName && cName.length > 1 && cName !== 'CONTINUED' && cName !== 'CONT' && cName !== 'MORE') {
        if (!characterScenes[cName]) characterScenes[cName] = new Set();
        characterScenes[cName].add(currentScene);
      }
    }
  }

  const totalDialogueLines = Object.values(characterCounts).reduce((a, b) => a + b, 0);

  function classifyTier(
    lineCount: number,
    sceneCount: number,
    rank: number,
    pctDialogue: number,
  ): CastTier {
    const totalSc = Math.max(totalScenes, 1);
    const scenePresence = sceneCount / totalSc;
    if (rank <= 2 && pctDialogue > 0.12 && scenePresence > 0.2) return 'lead';
    if (rank <= 6 && pctDialogue > 0.04 && scenePresence > 0.08) return 'supporting';
    if (lineCount >= 5 && sceneCount >= 2) return 'featured';
    return 'day_player';
  }

  const sortedChars = Object.entries(characterCounts)
    .sort((a, b) => b[1] - a[1]);

  const castBreakdown = sortedChars.map(([cName, lineCount], i) => {
    const scenes = characterScenes[cName] || new Set();
    const pctDialogue = totalDialogueLines > 0 ? lineCount / totalDialogueLines : 0;
    return {
      name: cName,
      lineCount,
      sceneCount: scenes.size,
      tier: classifyTier(lineCount, scenes.size, i + 1, pctDialogue),
      percentOfDialogue: Math.round(pctDialogue * 1000) / 10,
    };
  });

  return {
    totalScenes: Math.max(totalScenes, 1),
    uniqueLocations: Math.max(locationSet.size, 1),
    interiorCount,
    exteriorCount,
    intExtCount,
    detectedCountries: finalCountries,
    speakingRoles: Math.max(speakingRoles, 1),
    characterNames,
    stuntPages,
    vfxPages,
    vfxKeywords: Array.from(foundVfxKeywords),
    periodSetting,
    periodConfidence,
    dialogueRatio: Math.round(dialogueRatio * 100) / 100,
    actionRatio: Math.round(actionRatio * 100) / 100,
    estimatedPages: Math.max(estimatedPages, 1),
    genre,
    subGenres,
    genreConfidence: Math.round(genreConfidence * 100) / 100,
    nightSceneRatio: Math.round(nightSceneRatio * 100) / 100,
    averageDialogueLength: Math.round(averageDialogueLength * 10) / 10,
    topCharacters,
    castBreakdown,
  };
}
