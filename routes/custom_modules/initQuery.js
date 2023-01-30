var request = require('request');
var fetch = require('node-fetch');

module.exports = 
// function(store, storecred){
//     request(store, function(err, response) {
//         console.log("initial query:" + response.headers.link);
//         let link = response.headers.link;
//         nextLink = storecred + 'products.json' + link.substring(link.indexOf("?"), link.indexOf(">"));
//     }); 
//     callback(null, nextLink);
// }

function initQuery(store, storecred) {
    return new Promise((resolve, reject)=>{
        request(store, (error, response)=>{
            let link = response.headers.link;
            nextLink = storecred + 'products.json' + link.substring(link.indexOf("?"), link.indexOf(">"));
            if (error) reject(error);
            else resolve(nextLink);
        });
    });
}

// async function initQuery(store, storecred){
//     const res = await fetch(store);
//     // nextLink = storecred + 'products.json' + res.headers.link.substring(link.indexOf("?"), link.indexOf(">"));
//     // console.log(nextLink);
//     console.log(res.headers.link);
// }