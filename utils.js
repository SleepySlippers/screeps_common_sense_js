const { GetRole } = require("./role_manager");

function GetNextCreepName(prefix, force_num = false, map = Game.creeps) {
    num = 1;
    if (!force_num && !map[prefix]) {
        return prefix;
    }
    while (map[prefix + "" + num]) {
        ++num;
    }
    return prefix + "" + num;
}

function SpawnOrRun(spawner, creep_name, role, spawn_info, need_spawn = true) {
    try {
        if (!Game.creeps[creep_name]) {
            if (!need_spawn) {
                return false;
            }
            // spawn creep if we don't have with name `creep_name`
            GetRole(role).Spawn(spawner, creep_name, spawn_info);
            return true;
        } else {
            const creep = Game.creeps[creep_name];
            GetRole(creep.memory.role).Run(creep);
            return false;
        }
    } catch (error) {
        console.log(error);
    }
}

// sequence: [ { role, spawn_info?, name_addition?, count?}, ... ]
function GenerateCreepList(spawner, sequence) {
    creep_list = {};
    for (const elem_ind in sequence) {
        const elem = sequence[elem_ind];
        const cur_role = GetRole(elem.role);
        let name_add = ""
        if (elem.name_addition) {
            name_add = elem.name_addition;
        }
        const prefix = cur_role.GetPrefix(spawner) + name_add;
        let num = 1;
        if (elem.count) {
            num = elem.count;
        }
        let spawn_info = {};
        if (elem.spawn_info) {
            spawn_info = elem.spawn_info;
        }
        for (var i = 0; i < num; ++i) {
            creep_name = GetNextCreepName(prefix, true, creep_list);
            creep_list[creep_name] = { creep_name: creep_name, role: elem.role, spawn_info: spawn_info };
        }
    }
    return creep_list;
}

/// creep_list: [ { creep_name, role, spawn_info }, ... ]
function SpawnOrRunList(spawner, creep_list, can_spawn) {
    let spawned = !can_spawn;
    for (const i in creep_list) {
        const creep_info = creep_list[i];
        spawned |= SpawnOrRun(spawner, creep_info.creep_name, creep_info.role, creep_info.spawn_info, !spawned);
    }
}

function contains(arr, elem) {
    return arr.indexOf(elem) > -1;
}

function GetSourcesIdsByDistance(spawner) {
    if (!Memory.sources) {
        Memory.sources = new Map();
    }
    if (Memory.sources[spawner.id] && Game.time % 128 != 0) {
        return Memory.sources[spawner.id];
    }
    let srcIds = [];
    while (true) {
        const srcc = spawner.pos.findClosestByRange(FIND_SOURCES, {
            filter: (i) => !contains(srcIds, i.id)
        });
        if (srcc) {
            srcIds.push(srcc.id);
        } else {
            break
        }
    }
    return Memory.sources[spawner.id] = srcIds;
}

module.exports = {
    GetNextCreepName: GetNextCreepName,
    SpawnOrRun: SpawnOrRun,
    GenerateCreepList: GenerateCreepList,
    SpawnOrRunList: SpawnOrRunList,
    GetSourcesIdsByDistance: GetSourcesIdsByDistance,
}