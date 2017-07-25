module.exports = function (data, callback) {
    callback(null, 'Node.js welcomes ' + data.ns + ' ' + process.env.MYVARIABLE);
};