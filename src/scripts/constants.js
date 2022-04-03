const Constants = {
    GAME_STATUS_READY: 0,
    GAME_STATUS_RUNNING: 1,
    GAME_STATUS_FINISHED: 2,
    GAME_STATUS_STOPPED: -1,

    LOCAL_STORAGE_KEY: "bj_storage", // Auto saving on page exit

    NETWORK_STATUS_CHECK: 3, // Status check (in seconds)

    MODAL_DISPLAY_DELAY: 1, // Modal display delay (in seconds)
    WINNING_CARDS_DELAY: 5, // Winning animation interval (in seconds)
    LOOSING_CARDS_DELAY: 3, // Loosing animation interval (in seconds)

    ABORT_KEY_DRAW: "draw",
    ABORT_KEY_SHUFFLE: "shuffle",
};

export default Constants;
