const ROLES = {
    ROLE_NAIVE_HARVESTER: "role_naive_harvester",
}

let _roles = new Map();

module.exports = {
    ROLES: ROLES,
    GetRole: function (role_name) {
        if (!_roles[role_name]) {
            _roles[role_name] = require(role_name);
        }
        return _roles[role_name];
    }
}