/**
 * @typedef {import('../types/steam').SteamPlayer} SteamPlayer
 * @typedef {import('../types/steam').UserStatus} UserStatus
 */

import { PERSONA_STATE } from "./steamAPI.js";
import { formatLastOnline } from "./formatDate.js";

/**
 * Determines the user's current status based on Steam player data
 * @param {SteamPlayer|null} player - Steam player data object
 * @returns {UserStatus} Status object with class, headline, and status message
 */
export function determineUserStatus(player) {
    if (!player) {
        return {
            statusClass: "not-playing",
            headline: "Offline",
            status: "Unable to load user data.",
        };
    }

    const userName = player.realname;
    const userIsPlaying = player.gameextrainfo;
    const userIsPlayingId = player.gameid;
    const userStatus = player.personastate;
    const userLastOnline = player.lastlogoff;

    // User is currently in a game
    if (userIsPlaying) {
        return {
            statusClass: "text-green",
            headline: `${userName} is online`,
            status: `Currently playing <a href="https://store.steampowered.com/app/${userIsPlayingId}" target="_blank" rel="noopener noreferrer">${userIsPlaying}</a>.`,
        };
    }

    // User is online but not playing
    if (userStatus > PERSONA_STATE.OFFLINE) {
        return {
            statusClass: "text-yellow",
            headline: `${userName} is online`,
            status: "Currently on the Steam dashboard.",
        };
    }

    // User is offline
    const lastOnline = formatLastOnline(userLastOnline);
    const lastSeenText = lastOnline
        ? ` Last seen <time datetime="${lastOnline.iso}">${lastOnline.formatted}</time>.`
        : "";

    return {
        statusClass: "text-red",
        headline: "Offline",
        status: lastSeenText,
    };
}
