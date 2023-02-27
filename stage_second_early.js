const { ROLES } = require("./role_manager");
const { TARGET_MODS, SOURCE_MODS } = require("./role_naive_harvester");
const { GenerateCreepList, SpawnOrRunList } = require("./utils");

const STAGE_NAME = "stage_second_early";

const LOCAL_NAME_PREFIX = STAGE_NAME + "#";

const CREEP_SEQUENCE = [
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "c#ctrl#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_CONTROLLER, double_worker: true },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "c#s#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_SPAWNER, double_worker: true },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "c#b#",
        spawn_info: { source: SOURCE_MODS.MODE_MAIN, target: TARGET_MODS.MODE_BUILD, double_worker: true },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "d#s#c#ctrl#",
        spawn_info: { source: SOURCE_MODS.MODE_SECONDARY, target: TARGET_MODS.MODE_CONTROLLER, double_worker: true, double_carry: true },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "d#s#c#s#",
        spawn_info: { source: SOURCE_MODS.MODE_SECONDARY, target: TARGET_MODS.MODE_SPAWNER, double_worker: true, double_carry: true },
    },
    {
        role: ROLES.ROLE_NAIVE_HARVESTER,
        count: 1,
        name_addition: LOCAL_NAME_PREFIX + "d#s#c#b#",
        spawn_info: { source: SOURCE_MODS.MODE_SECONDARY, target: TARGET_MODS.MODE_BUILD, double_worker: true, double_carry: true },
    },
];

function IsActive(spawner) {
    const extensions = spawner.room.find(FIND_STRUCTURES, {
        filter: (i) => i.structureType == STRUCTURE_EXTENSION
    })
    if (extensions.length < 2) {
        return false;
    }
    const nonempty_container = spawner.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
            i.store[RESOURCE_ENERGY] >= 200
    })
    if (!nonempty_container) {
        return false;
    }
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