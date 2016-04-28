var Converter=require("csvtojson").Converter;
var fs = require("fs");		//modl internet node gestion fichiers
var csvConverter = new Converter({
	constructResult:true,
	delimiter:";",
	headers: ["promotion", "diploma", "year_2015"]
}); // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event. 
 
var readStream = fs.createReadStream("./server/data/diplomas.csv", {encoding: 'utf8'});
//var writeStream = require("fs").createWriteStream("./server/data/diplomas.json", {encoding: 'utf8'});
 
//readStream.pipe(csvConverter).pipe(writeStream);

csvConverter.on("end_parsed", function (jsonObj) {
   fs.writeFile('./server/data/diplomas.json', JSON.stringify(jsonObj, null, 4), function(err) {
       if(err) {
           console.error(err);
       } else {
           console.log("JSON saved to movieList.json");
       }
   });
});


readStream .pipe(csvConverter);