const stages = [
    {
        id: 1,
        name: 'COVENANTS BIKESHED',
        x: 430,
        y: 640,
        type: 'single', // Single toss to proceed or lose a life
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 2, // Next stage if success
            fail: 1 // Replay next turn if fail
        }
    },
    {
        id: 2,
        name: 'SHADOWY SUPERCODER LAIR',
        x: 920,
        y: 290,
        type: 'item', // Single toss to determine if item is picked up
        requiredTosses: 1,
        successCondition: 'tails', // Tails to collect item
        progressCondition: 'proceed',
        itemPickedOnSuccess: 'bug',
        nextStage: {
            success: 3, // Proceed to next stage either way
            fail: 3 // Proceed to next stage either way
        }
    },
    {
        id: 3,
        name: 'THE COUNT',
        x: 1340,
        y: 210,
        type: 'single', // Single toss to proceed or lose a life
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 4, // Next stage if success
            fail: 3 // Replay next turn if fail
        }
    },
    {
        id: 4,
        name: 'TESTNET GRAVEYARD',
        x: 1710,
        y: 430,
        type: 'collect', // Multiple tosses to collect items
        requiredTosses: 3,
        successCondition: 'heads', // Collect an item for each heads
        itemPickedOnSuccess: 'unused app',
        progressCondition: 'proceed',
        nextStage: {
            success: 5, // Proceed to next stage
            fail: 5 // Proceed to next stage either way
        }
    },
    {
        id: 5,
        name: 'BLOCKSTREAM ECONOMICS INSTITUTE',
        x: 1270,
        y: 700,
        type: 'conditional', // Conditional tosses based on items
        requiredTosses: 0, // Tosses based on the number of 'unused app' items
        successCondition: 'tails', // Lose a life on tails
        itemRequired: 'unused app', // Requires 'unused app' items to visit
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 6, // Proceed to next stage either way
            fail: 6 // Proceed to next stage either way
        }
    },
    {
        id: 6,
        name: 'ACK-NACK MINESWEEPER',
        x: 1240,
        y: 1110,
        type: 'multi-conditional', // Multiple tosses with condition based on item
        requiredTosses: 5, // Base number of tosses
        successCondition: '3_heads', // At least 3 heads to succeed
        itemRequired: 'bug', // Reduce tosses if 'bug' is held
        reduceTossesBy: 1, // Reduce tosses by 1 if 'bug' is held
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 7, // Next stage if success
            fail: 6 // Replay next turn if fail
        }
    },
    {
        id: 7,
        name: 'SEGWIT BAGGAGE CLAIM',
        x: 360,
        y: 1390,
        type: 'item', // Single toss to determine if item is picked up
        requiredTosses: 1,
        successCondition: 'heads', // Heads to collect item
        progressCondition: 'conditional', // Progress conditionally based on item collection
        itemPickedOnSuccess: 'segwit baggage',
        nextStage: {
            success: 8, // Proceed to stage 8 if baggage is collected
            fail: 9 // Proceed to stage 9 if baggage is not collected
        }
    },
    {
        id: 8,
        name: 'PARKING LOT = TRUE',
        x: 1470,
        y: 1840,
        type: 'item', // Single toss to determine if item is picked up
        requiredTosses: 1,
        successCondition: 'heads', // Heads to collect item
        progressCondition: 'proceed', // Proceed to next stage either way
        itemPickedOnSuccess: 'Taproot Tour Legends',
        nextStage: {
            success: 10, // Proceed to stage 10 either way
            fail: 10 // Proceed to stage 10 either way
        }
    },
    {
        id: 9,
        name: 'THE MINES',
        x: 1230,
        y: 1970,
        type: 'single', // Single toss to proceed or lose a life
        requiredTosses: 1,
        successCondition: 'heads',
        progressCondition: 'proceed',
        loseLifeOnFail: true,
        nextStage: {
            success: 10, // Next stage if success
            fail: 9 // Replay next turn if fail
        }
    },
    {
        id: 10,
        name: 'MINER SIGNALING MILLIPEDE',
        x: 950,
        y: 2790,
        type: 'multi-conditional-track', // Multiple tosses with tracking condition based on items and previous stages
        requiredTosses: 5, // Base number of tosses
        successCondition: '4_heads', // At least 4 heads to win
        itemRequired: 'Taproot Tour Legends', // Add one to heads count if this item is held
        progressCondition: 'track', // Progress based on tracking conditions
        loseLifeOnFail: false, // No life loss on fail
        nextStage: {
            success: null, // Win the game
            fail_parkingLotTrue: 11, // Go to stage 11 if previously visited PARKING LOT = TRUE
            fail_theMines: null // Lose the game if previously visited THE MINES
        }
    },
    {
        id: 11,
        name: 'UASF BLACK HOLE',
        x: 960,
        y: 2240,
        type: 'multi', // Multiple tosses to determine win or lose
        requiredTosses: 3,
        successCondition: '2_heads', // At least 2 heads to win
        progressCondition: 'conditional', // Progress conditionally based on result
        nextStage: {
            success: null, // Win the game
            fail: null // Lose the game
        }
    }
];

module.exports = stages;

// const stages = [
//     { id: 1, x: 150, y: 160 }, // Start
//     { id: 2, x: 415, y: 625 }, // Shadow Supercoder Lab
//     { id: 3, x: 905, y: 270 },
//     { id: 4, x: 35, y: 40 },
//     // Continue defining all stages...
// ];

// module.exports = stages;