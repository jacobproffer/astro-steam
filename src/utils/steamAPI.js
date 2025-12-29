/**
 * @typedef {import('../types/steam').SteamPlayer} SteamPlayer
 * @typedef {import('../types/steam').Game} Game
 */

// Steam API constants
export const STEAM_API_BASE_URL = "https://api.steampowered.com";

export const PERSONA_STATE = {
    OFFLINE: 0,
    ONLINE: 1,
    BUSY: 2,
    AWAY: 3,
    SNOOZE: 4,
    LOOKING_TO_TRADE: 5,
    LOOKING_TO_PLAY: 6,
};

/**
 * Fetches data from Steam API with error handling
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} The API response data
 * @throws {Error} If the fetch fails or returns an error
 */
export async function fetchSteamAPI(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Steam API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch from Steam API:", error);
        throw error;
    }
}

/**
 * Fetches Steam user profile data
 * @param {string} key - Steam API key
 * @param {string} steamID - Steam user ID
 * @returns {Promise<SteamPlayer|null>} Player data or null if not found
 */
export async function fetchPlayerProfile(key, steamID) {
    const url = `${STEAM_API_BASE_URL}/ISteamUser/GetPlayerSummaries/v0002/?key=${key}&steamids=${steamID}`;
    const data = await fetchSteamAPI(url);
    return data?.response?.players?.[0] || null;
}

/**
 * Fetches recently played games for a Steam user
 * @param {string} key - Steam API key
 * @param {string} steamID - Steam user ID
 * @returns {Promise<Game[]|null>} Array of games or null if none found
 */
export async function fetchRecentlyPlayedGames(key, steamID) {
    const url = `${STEAM_API_BASE_URL}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${key}&steamid=${steamID}`;
    const data = await fetchSteamAPI(url);
    return data?.response?.games || null;
}
