const { ROLES } = require("./role_manager");

module.exports = {
    ROLE_NAME: ROLES/*.REAL_ROLE */,
    Run: function (creep) {

    },
    GetPrefix: function (spawner) {
        return spawner.name + "#" + this.ROLE_NAME + "#";
    },
    Spawn: function (spawner, creep_name, spawn_info) {
        return spawner.spawnCreep(
            [WORK, CARRY, MOVE], // body
            this.GetPrefix(spawner) + creep_name,
            {
                memory: {
                    role: this.ROLE_NAME,
                    spawn_info: spawn_info,
                    // other staff
                }
            });
    },
}