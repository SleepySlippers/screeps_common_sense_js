const { ROLES } = require("./role_manager");
const { TARGET_MODS, SOURCE_MODS } = require("./role_naive_harvester");
const { IsActive: EarlyStartIsActive } = require("./stage_second_early");
const { GenerateCreepList, SpawnOrRunList } = require("./utils");

const STAGE_NAME = "stage_early_start";

const LOCAL_NAME_PREFIX = STAGE_NAME + "#";

const CREEP_SEQUENCE = [
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: "c#ctrl#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_CONTROLLER },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: "c#s#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_SPAWNER },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: "c#b#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_BUILD },
    },
];

function IsActive(spawner) {
    return !EarlyStartIsActive(spawner);
    return true;
}

module.exports = {
    STAGE_NAME: STAGE_NAME,
    IsActive: IsActive,
    Run: function (spawner) {
        const is_active = IsActive(spawner);
        creep_list = GenerateCreepList(spawner, CREEP_SEQUENCE);
        SpawnOrRunList(spawner, creep_list, is_active);
        // console.log(STAGE_NAME + " finished");
    },
}