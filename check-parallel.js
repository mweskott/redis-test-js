var redis = require('redis');
var crypto = require('crypto');
var process = require('process');

var redisClient = redis.createClient ({
    host : 'localhost',
    port : 6379
}); 

var timeStart = process.hrtime();
for (let index = 0; index < 1000000; index++) {
    const key = `redis-test:${index}`;
    redisClient.get(key, (err, value) => {
        const expectedValue = crypto.createHash('sha256').update(key).digest('base64');
        if (index % 100000 == 0) {
            console.log(key, value, expectedValue);
        }
        if (value != expectedValue) {
            console.error('fail', key, value, expectedValue);
        }
    });
}

redisClient.quit(() => {
    var time2 = process.hrtime(timeStart);
    console.info('Execution time (hr): %ds %dms', time2[0], time2[1] / 1000000)
});

