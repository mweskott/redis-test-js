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
    const value = crypto.createHash('sha256').update(key).digest('base64');
    redisClient.set(key, value);
}
var time1 = process.hrtime(timeStart);
console.info('Execution time (hr): %ds %dms', time1[0], time1[1] / 1000000)

redisClient.quit(() => {
    var time2 = process.hrtime(timeStart);
    console.info('Execution time (hr): %ds %dms', time2[0], time2[1] / 1000000)
});

