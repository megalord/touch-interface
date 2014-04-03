var input,
    length = 640*480;

console.log('creation');

input = [];
console.time('push');
for(var i = 0; i < length; i++)
    input.push(Math.round(Math.random()));
console.timeEnd('push');

input = new Array(length);
console.time('assign');
for(var i = 0; i < input.length; i++)
    input[i] = Math.round(Math.random());
console.timeEnd('assign');


console.log('looping');

console.time('for');
for(var i = 0; i < input.length; i++)
    input[i] = input[i] * 5 - 2;
console.timeEnd('for');

console.time('while');
var i = length;
while(i--)
    input[i] = input[i] * 5 - 2;
console.timeEnd('while');

input = new Array(length*4);
for(var i = 0; i < input.length; i++)
    input[i] = Math.round(Math.random());

console.time('for4');
for(var i = 0; i < input.length; i+=4)
    input[i] = input[i] * 5 - 2;
console.timeEnd('for4');
