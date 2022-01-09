const Constants = {
    GAME_STATUS_READY: 0,
    GAME_STATUS_RUNNING: 1,
    GAME_STATUS_FINISHED: 2,
    GAME_STATUS_STOPPED: -1,

    LOCAL_STORAGE_KEY: "bj_storage", // auto saving on page exit

    NETWORK_STATUS_CHECK: 3, // status check (in seconds)
};

export default Constants;
