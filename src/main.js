const stage_loader = require("stage_loader");

module.exports.loop = function () {
    if (Game.cpu.bucket == 10000) {
        Game.cpu.generatePixel();
    }
    // TODO: building planning
    for (const spawn_key in Game.spawns) {
        const spawner = Game.spawns[spawn_key]
        for (const stage of stage_loader.stages) {
            stage.Run(spawner);
        }
    }
    return;
}