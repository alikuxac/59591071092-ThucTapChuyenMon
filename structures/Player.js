const { Manager } = require("erela.js");
const { MusicUtils } = require("./Util");

module.exports = class ExtendedPlayer extends Manager {

    /**
     * @param {ManagerOptions} options - Options  
     * @param {ExtendedClient} client
     */
    constructor(options, client) {
        super(options);

        Object.defineProperty(this, "client", { value: client })
        this.util = new MusicUtils();
        // EQ Settings
        this.defaultEQ = [
            { band: 0, gain: 0.15 },
            { band: 1, gain: 0.05 },
            { band: 2, gain: 0.025 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.025 },
            { band: 6, gain: -0.05 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.025 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.15 },
            { band: 13, gain: 0.25 },
            { band: 14, gain: 0.25 }
        ]
        this.bassboost = {
            none: this.defaultEQ,
            low: [
                { band: 0, gain: 0.125 },
                { band: 1, gain: 0.25 },
                { band: 2, gain: -0.25 },
                { band: 3, gain: -0.125 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            medium: [
                { band: 0, gain: 0.25 },
                { band: 1, gain: 0.5 },
                { band: 2, gain: -0.5 },
                { band: 3, gain: -0.25 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            high: [
                { band: 0, gain: 0.375 },
                { band: 1, gain: 0.75 },
                { band: 2, gain: -0.75 },
                { band: 3, gain: -0.375 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            earrape: [
                { band: 0, gain: 0.5 },
                { band: 1, gain: 1 },
                { band: 2, gain: -1 },
                { band: 3, gain: -0.5 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ]
        }
    }
    
}