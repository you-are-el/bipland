const alphaStages = [
    {
        id: 0,
        name: 'GAME START',
        x: 50,
        y: 50,
        type: 'single', // Starting stage
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 1,
            fail: 0
        }
    },
    {
        id: 1,
        name: 'COVENANTS BIKESHED',
        x: 430,
        y: 640,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 2,
            fail: 1
        }
    },
    {
        id: 2,
        name: 'SHADOWY SUPERCODER LAIR',
        x: 920,
        y: 290,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 3,
            fail: 2
        }
    },
    {
        id: 3,
        name: 'THE COUNT',
        x: 1340,
        y: 210,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 4,
            fail: 3
        }
    },
    {
        id: 4,
        name: 'TESTNET GRAVEYARD',
        x: 1710,
        y: 430,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 5,
            fail: 4
        }
    },
    {
        id: 5,
        name: 'BLOCKSTREAM ECONOMICS INSTITUTE',
        x: 1270,
        y: 700,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 6,
            fail: 5
        }
    },
    {
        id: 6,
        name: 'ACK-NACK MINESWEEPER',
        x: 1240,
        y: 1110,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 7,
            fail: 6
        }
    },
    {
        id: 7,
        name: 'SEGWIT BAGGAGE CLAIM',
        x: 360,
        y: 1390,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: false,
        nextStage: {
            success: 8,
            fail: 7
        }
    },
    {
        id: 8,
        name: 'PARKING LOT = TRUE',
        x: 1470,
        y: 1840,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: false,
        nextStage: {
            success: 9,
            fail: 8
        }
    },
    {
        id: 9,
        name: 'THE MINES',
        x: 1230,
        y: 1970,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 10,
            fail: 9
        }
    },
    {
        id: 10,
        name: 'MINER SIGNALING MILLIPEDE',
        x: 950,
        y: 2790,
        type: 'single',
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: false, // No life loss on fail
        nextStage: {
            success: 11, // Win the game
            fail: 12 // Lose the game
        }
    },
    {
        id: 11,
        name: 'OP_CAT IS ACTIVE!!!!',
        x: 960,
        y: 2240,
        type: 'single',
        requiredTosses: 0, // No tosses required here
        successCondition: 'heads',
        progressCondition: 'win', // Win the game
        loseLifeOnFail: false,
        nextStage: {
            success: null,
            fail: null
        }
    },
    {
        id: 12,
        name: 'OP_CAT IS INACTIVE',
        x: 960,
        y: 2240,
        type: 'single',
        requiredTosses: 0, // No tosses required here
        successCondition: 'heads',
        progressCondition: 'lose', // Lose the game
        loseLifeOnFail: true, // Lose all lives
        nextStage: {
            success: null,
            fail: null
        }
    }
];

module.exports = alphaStages;