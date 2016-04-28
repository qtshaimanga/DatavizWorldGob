var data = require('./data');
var _= require('lodash');


    exports.list = function list(req, res){
        res.json(
            data
        );
    }



    exports.paysList = function pays(req, res){

            var result = _(data).groupBy(function(row){
                return row.year_2015;
            });

            result = _(result).map(function(name, info) {
                return {
                    pays : info,
                    total: _.size(name)
                }
            });

            res.json(result);
    };


    /*ier par sections et  f(nbre) pour chaque pays*/
    exports.findBySection = function findBySection(req, res) {
        var diplomas = req.params.name.split('-');
        console.log("YOLO", diplomas);
        var resultat =(
            data
                .chain()
                .filter(function(selection){
                    if ('diploma' in selection && diplomas.indexOf(selection.diploma) > -1) {
                        return true;
                    } else {
                        return false;
                    }
                })
                .value());

            resultat = _(resultat).groupBy(function(row){
                return row.year_2015;
            });

            resultat = _(resultat).map(function(name, info) {
                return {
                    pays : info,
                    total: _.size(name)
                }
            });

        res.json(resultat);
    }



    /* trier par promo et f(nbre) pour chaques pays*/


    /* trier par section et promo et le tt f(nbre) pour chaques pays*/
