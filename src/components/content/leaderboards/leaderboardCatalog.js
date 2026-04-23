import { PROFESSION_LEADERBOARD_IDS } from "./professionLeaderboards";

export const LEADERBOARD_CATEGORIES = [
    {
        id: "guild",
        title: "Guild Rankings",
        description: "Guild progression, territory control, and wars.",
        leaderboards: ["guildLevel", "guildTerritories", "guildWars"]
    },
    {
        id: "global",
        title: "Global Rankings",
        description: "Overall account-level rankings across all players.",
        leaderboards: [
            "combatGlobalLevel",
            "professionsGlobalLevel",
            "totalGlobalLevel",
            "playerContent",
            "globalPlayerContent"
        ]
    },
    {
        id: "solo",
        title: "Solo Rankings",
        description: "Character progression for solo combat and professions.",
        leaderboards: ["combatSoloLevel", "professionsSoloLevel", "totalSoloLevel"]
    },
    {
        id: "profession",
        title: "Profession Levels",
        description: "Skill-specific level rankings for gathering and crafting.",
        leaderboards: PROFESSION_LEADERBOARD_IDS
    },
    {
        id: "completion",
        title: "Boss & War Completions",
        description: "Completion counts for raids, bosses, and war content.",
        leaderboards: [
            "grootslangCompletion",
            "colossusCompletion",
            "orphionCompletion",
            "namelessCompletion",
            "warsCompletion"
        ]
    },
    {
        id: "content",
        title: "Special Content Modes",
        description: "Mode and challenge-specific progression leaderboards.",
        leaderboards: [
            "huntedContent",
            "craftsmanContent",
            "huicContent",
            "ironmanContent",
            "ultimateIronmanContent",
            "hardcoreLegacyLevel",
            "hardcoreContent",
            "huichContent",
            "hicContent",
            "hichContent"
        ]
    },
    {
        id: "sr-players",
        title: "Speedrun Players",
        description: "Player speedrun placements across major encounters.",
        leaderboards: [
            "grootslangSrPlayers",
            "colossusSrPlayers",
            "orphionSrPlayers",
            "namelessSrPlayers",
            "NASrPlayers"
        ]
    },
    {
        id: "sr-guilds",
        title: "Speedrun Guilds",
        description: "Guild speedrun placements across major encounters.",
        leaderboards: [
            "grootslangSrGuilds",
            "colossusSrGuilds",
            "orphionSrGuilds",
            "namelessSrGuilds",
            "NASrGuilds"
        ]
    }
];

const SPECIAL_LABELS = {
    NASrPlayers: "NA Speedrun Players",
    NASrGuilds: "NA Speedrun Guilds",
    huicContent: "HUIC Content",
    huichContent: "HUICH Content",
    hicContent: "HIC Content",
    hichContent: "HICH Content"
};

export function formatLeaderboardId(type) {
    if (SPECIAL_LABELS[type]) return SPECIAL_LABELS[type];

    return type
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\bSr\b/g, "SR")
        .replace(/^./, (letter) => letter.toUpperCase());
}

export const ALL_LEADERBOARD_IDS = LEADERBOARD_CATEGORIES.flatMap((category) => category.leaderboards);
