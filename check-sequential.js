var redis = require('redis');
var crypto = require('crypto');
var process = require('process');

var redisClient = redis.createClient ({
    host : 'localhost',
    port : 6379
}); 

var timeStart = process.hrtime();

function checkKeysInSequence(keyIndex) {
    if (keyIndex > 1000000) {
        var timeSequential = process.hrtime(timeStart);
        console.info('Execution time (hr): %ds %dms', timeSequential[0], timeSequential[1] / 1000000)
        return;
    }
    const key = `redis-test:${keyIndex}`;
    redisClient.get(key, (err, value) => {
        if (err) {
            console.error(err);
        }
        const expectedValue = crypto.createHash('sha256').update(key).digest('base64');
        if ((keyIndex % 10000) == 0) {
            console.log(key, value, expectedValue);
        }
        if (value != expectedValue) {
            console.error('fail', key, value, expectedValue);
        }
        checkKeysInSequence(keyIndex + 1);
    });
}

checkKeysInSequence(0);

// redisClient.quit(() => {
//     var time2 = process.hrtime(timeStart);
//     console.info('Execution time (hr): %ds %dms', time2[0], time2[1] / 1000000)
// });

