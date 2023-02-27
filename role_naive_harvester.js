const { ROLES } = require("./role_manager");
const { GetSourcesIdsByDistance } = require("./utils");

const TARGET_MODS = {
    MODE_SPAWNER: "spawner",
    MODE_EXTENSION: "extension",
    MODE_CONTAINER: "container",
    MODE_STORAGE: "storage",
    MODE_CONTROLLER: "controller",
    MODE_BUILD: "build",
};

const SOURCE_MODS = {
    MODE_MAIN: "closest",
    MODE_SECONDARY: "secondary",
};

function GetSpawner(creep) {
    return creep.pos.findClosestByRange(FIND_MY_SPAWNS);
}

function GetSource(spawner, mode) {
    const srcIds = GetSourcesIdsByDistance(spawner);
    if (!mode) {
        mode = SOURCE_MODS.MODE_MAIN;
    }

    if (mode == SOURCE_MODS.MODE_MAIN) {
        if (srcIds.length < 1) return;
        return Game.getObjectById(srcIds[0]);
    }
    if (mode == SOURCE_MODS.MODE_SECONDARY) {
        if (srcIds.length < 2) return;
        return Game.getObjectById(srcIds[1]);
    }
    return;
}

function GetClosestFreeStructure(creep, type) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (i) => i.structureType == type &&
            i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    })
}

function GetTransferTarget(creep, mode) {
    let check_list = [];
    if (!mode) {
        mode = TARGET_MODS.MODE_SPAWNER;
    }
    if (mode == TARGET_MODS.MODE_CONTROLLER) {
        return;
    }
    if (mode == TARGET_MODS.MODE_SPAWNER) {
        check_list.push(GetClosestFreeStructure(creep, STRUCTURE_SPAWN));
    } else if (mode == TARGET_MODS.MODE_EXTENSION) {
        check_list.push(GetClosestFreeStructure(creep, STRUCTURE_EXTENSION));
    } else if (mode == TARGET_MODS.MODE_CONTAINER) {
        check_list.push(GetClosestFreeStructure(creep, STRUCTURE_CONTAINER));
    } else if (mode == TARGET_MODS.MODE_STORAGE) {
        check_list.push(GetClosestFreeStructure(creep, STRUCTURE_STORAGE));
    }
    check_list.push(GetClosestFreeStructure(creep, STRUCTURE_SPAWN));
    check_list.push(GetClosestFreeStructure(creep, STRUCTURE_EXTENSION));
    check_list.push(GetClosestFreeStructure(creep, STRUCTURE_CONTAINER));
    check_list.push(GetClosestFreeStructure(creep, STRUCTURE_STORAGE));
    for (const i in check_list) {
        const elem = check_list[i];
        if (elem) {
            return elem;
        }
    }
    return;
}

function GoBuild(creep) {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (target) {
        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        return true;
    }
    return false;
}

function GoUpgrade(creep) {
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
        return true;
    }
    return false;
}

module.exports = {
    ROLE_NAME: ROLES.ROLE_NAIVE_HARVESTER,
    TARGET_MODS: TARGET_MODS,
    SOURCE_MODS: SOURCE_MODS,
    Run: function (creep) {
        const spawner = GetSpawner(creep);
        if (creep.memory.harvest == true && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.harvest = false;
            creep.say('🚗 carry');
        }
        if (creep.memory.harvest == false && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvest = true;
            creep.say('🔄 harvest');
        }
        if (creep.memory.harvest) {
            const src = GetSource(spawner, creep.memory.spawn_info.source);
            if (src) {
                if (creep.harvest(src) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(src, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
            }
            return;
        } else {
            if (creep.memory.spawn_info.target == TARGET_MODS.MODE_BUILD) {
                if (GoBuild(creep)) {
                    return;
                }
            }
            if (creep.memory.spawn_info.target == TARGET_MODS.MODE_CONTROLLER) {
                if (GoUpgrade(creep)) {
                    return;
                }
            }
            const target = GetTransferTarget(creep, creep.memory.spawn_info.target);
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                return;
            }
            if (GoBuild(creep)) {
                return;
            }
            if (GoUpgrade(creep)) {
                return;
            }
        }
    },
    GetPrefix: function (spawner) {
        return spawner.name + "#" + this.ROLE_NAME + "#";
    },
    Spawn: function (spawner, creep_name, spawn_info) {
        let body = [WORK, CARRY, MOVE];
        if (spawn_info.double_worker) {
            body = [WORK, WORK, CARRY, MOVE];
            if (spawn_info.double_carry){
                body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE ];
            }
        }
        return spawner.spawnCreep(body,
            creep_name,
            {
                memory: {
                    role: this.ROLE_NAME,
                    spawn_info: spawn_info,
                    harvest: true,
                }
            });
    },
}