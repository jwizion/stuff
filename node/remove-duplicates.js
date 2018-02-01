var fs = require('fs');
var ofx = require('./ofx');

/* Removes dupplicates in ofx files (bug in my bank website)
 * node-ofx is required: https://github.com/chilts/node-ofx
 * 
 * Usage : node remove-duplicates.js > output.ofx
 */
fs.readFile('input.ofx', 'utf8', function(err, ofxData) {
    if (err) throw err;

    var data = ofx.parse(ofxData);
    var transactions = data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN;

    // this couple of data should be unique, remove the duplicates
    //"TRNAMT": "432.50", "MEMO": "RBT CPTE JOINT 0,415"
    var uniqueTransactions = [];
    transactions.forEach(function(transaction) {
        var found = false;
        uniqueTransactions.forEach(function(uniqueTransaction){
            if(transaction.TRNAMT === uniqueTransaction.TRNAMT && transaction.MEMO === uniqueTransaction.MEMO) {
                found = true;
            }
        });
        if(!found) {
            uniqueTransactions.push(transaction);
        }
    });
    data.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS.BANKTRANLIST.STMTTRN = uniqueTransactions;
    console.log(ofx.serialize(data.header, data.OFX));
});
