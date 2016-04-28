(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Backbone.Collection.extend({
    url: 'http://localhost:3000/pays',

    useDiplomaUrl: function useDiplomaUrl(name) {
        this.url = 'http://localhost:3000/pays/' + name;
    }
});

//-------- FIN -------

// Ecrire Model qui retourne un json unique
// trier differmnt pour renvoyer les pays plus eventulmnt les pays selon des parametres de selection

// Finir les differentes couronnes

// attention au bug de render si action trop rapide

// Deploymnt in LAB

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _personneCollection = require('./personneCollection');

var _personneCollection2 = _interopRequireDefault(_personneCollection);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var personnView = Backbone.View.extend({

    //tagName: 'main',
    el: $('main'),

    initialize: function initialize() {
        this.collection = new _personneCollection2.default();
        this.collection.on('reset', this.render.bind(this));
        this.collection.fetch({ reset: true });
        //this.listenTo(this.collection, 'sync', this.render);
    },

    render: function render() {
        var that = this;
        //console.debug(this.collection.toJSON());
        $.get("./src/personnes/templates/personneTemplate.html", function (res) {
            //var html = $(res);

            var template = Handlebars.compile(res);

            var html = template({ personnes: that.collection.toJSON() }); // +/- donne un nom a mon obj

            console.log(that.collection.toJSON());

            that.$el.html(html);
            //console.log(html);
            //console.log(that.collection.toJSON());

            $.get("./src/vendor/assets/couronne-ext.svg", function (svg) {

                var svgElement = $(svg).find('svg');
                $('#nav-center').append(svgElement);

                d3.selectAll('.arc').on('click', function (e) {
                    //console.log(this.id);

                    this.classList.toggle('selected');
                    that.renderDiploma();
                });
                var svg = d3.select("#circles").append("svg");
            });

            $.get("./src/vendor/assets/logo-gob-white.svg", function (svg) {
                var svgElement = $(svg).find('svg');
                $('#logo').append(svgElement);
            });

            /*ADD*/
            $.get("./src/vendor/assets/couronne-date.svg", function (svg) {
                var svgElement = $(svg).find('svg');
                $('#date').append(svgElement);
            });

            that.renderSVG();
            that.renderAnimation();

            setTimeout(that.afterRender.bind(that), 1);
        });

        return this;
    },

    renderDiploma: function renderDiploma() {

        var diplomas = [];
        d3.selectAll('.selected').each(function () {
            diplomas.push($(this).attr('data-diploma'));
        });
        this.collection.useDiplomaUrl(diplomas.join('-'));
        this.collection.fetch({ reset: false }).done(this.renderSVG.bind(this));
    },
    afterRender: function afterRender() {
        this.renderSVG();
    },
    renderSVG: function renderSVG() {
        var svg = d3.select("#circles").select("svg");
        var shapes = svg.selectAll(".shapes").data(this.collection.toJSON(), function (d) {
            return d.pays;
        });
        //console.table(this.collection.toJSON());

        var angle = 0;
        var radius = 275;
        var nbr = this.collection.toJSON().length;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var arc = $(".selected").attr('id');

        var group = shapes.enter().append('g').classed('shapes', true);
        shapes.exit().remove();
        //console.log(group);

        var color = '#1B6DAD';
        var stroke;
        group.append("circle").attr("cx", function (d, i) {
            return Math.sin(i + 1 * 480 * Math.PI / 180) * radius + width / 2.05;
        }) //return (i+1) * 55;
        .attr("cy", function (d, i) {
            return Math.cos(i + 1 * 480 * Math.PI / 180) * radius + height / 2;
        }).attr("r", function (d, i) {
            return Math.log(d.total) * 5 + 3;
        }).style("fill", function (d) {
            if (Math.log(d.total) * 5 + 3 < 4) {
                // 3 = valeur minimum = 1 sur l'echelle de log
                stroke = "#FFF";
            } else {
                stroke = '#FFF';
            }
            return stroke;
        }).style("stroke", '#000').on("click", function (d) {

            //alert("view linkedin profile")
            $("#bulles").fadeIn();
            setTimeout(function () {
                $("#bulles").fadeOut();
            }, 5000);
        });

        group.append("text").attr("dx", function (d, i) {
            return Math.sin(i + 1 * 480 * Math.PI / 180) * radius * 1.3 + width / 2.15;
        }).attr("dy", function (d, i) {
            return Math.cos(i + 1 * 480 * Math.PI / 180) * radius * 1.25 + height / 2;
        }).text(function (d) {
            return d.pays;
        }).style("fill", '#FFF');

        shapes.select('circle').transition().duration(800).ease('bounce').attr("r", function (d, i) {
            return Math.log(d.total) * 6 + 3;
        }).style("fill", function (d) {
            if (Math.log(d.total) * 5 + 3 < 1) {
                // 3 = valeur minimum = 1 sur l'echelle de log
                console.log(Math.log(d.total) * 5 + 3);
                stroke = "#00";
            } else {
                if (arc == 1) {
                    stroke = "#00FFC1";
                }
                if (arc == 2) {
                    stroke = "#00C4BB";
                }
                if (arc == 3) {
                    stroke = "#00A2B8";
                }
                if (arc == 4) {
                    stroke = "#0082B5";
                }
                if (arc == 5) {
                    stroke = "#0063B2";
                }
                if (arc == 6) {
                    stroke = "#0040c1";
                }
            }
            return stroke;
        });

        shapes.selectAll('circle, text').style("fill", function (d) {

            if (arc === undefined) {
                color = "#FFF";
            }
            if (arc == 1) {
                color = "#00FFC1";
            }
            if (arc == 2) {
                color = "#00C4BB";
            }
            if (arc == 3) {
                color = "#00A2B8";
            }
            if (arc == 4) {
                color = "#0082B5";
            }
            if (arc == 5) {
                color = "#0063B2";
            }
            if (arc == 6) {
                color = "#0040c1";
            }

            return color;
        });

        var element = $(".selected");
        //console.log($(".selected").attr('id'))
        if (element.length) {
            $("#circles").css("opacity", "1");
        }
        if (!element.length) {
            $("#circles").animate({ "opacity": "0.6" }, 200);
        }

        if (element[0] === undefined) {
            $('#info').text("La repartition international de l'ensemble des Gobelins").css("color", "#104168");
        }

        var diplomas = [];
        d3.selectAll('.selected').each(function () {
            diplomas.push($(this).attr('data-diploma'));
        });
        //console.log(diplomas)

        //$('#info').text('La répartition internationalle des ');
        //$('#info').append( diplomas +" en 2015");

        if (element[0] !== undefined) {
            $('#info').text('La répartition international des ');
            $('#info').append(diplomas + " en 2015");
        }
    },
    renderAnimation: function renderAnimation() {

        var flag = 0;
        var flag2 = 0;

        $('#pictoadd').click(function () {
            flag = 1;

            $('body').css("background-image", "none");

            if (flag2 == 0) {
                $('#login').fadeIn();
                flag2 = 1;
            } else {
                $('#login').fadeOut();
                $('body').css("background-image", "url('../src/vendor/assets/background.png')");
                $('#pictoadd').fadeOut();
                $('main').fadeIn(2000);
            }

            console.log("picto");
        });

        if (flag == 0) {
            $(document).click(function () {

                if (!event.preventDefault() && flag == 1) return;

                flag = 1;
                $('body').css("background-image", "url('../src/vendor/assets/background.png')");
                $('#pictoadd').fadeOut();
                $('main').fadeIn(2000);
                //console.log(flag);
            });
        }
    }
});

exports.default = personnView;

},{"./personneCollection":1}],3:[function(require,module,exports){
'use strict';

var _personneView = require('./personnes/personneView');

var _personneView2 = _interopRequireDefault(_personneView);

function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
}

$(function () {
        var view = new _personneView2.default();
});

},{"./personnes/personneView":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL3BlcnNvbm5lcy9wZXJzb25uZUNvbGxlY3Rpb24uanMiLCJwdWJsaWMvc3JjL3BlcnNvbm5lcy9wZXJzb25uZVZpZXcuanMiLCJwdWJsaWMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OzsyQkNBZSxBQUFTLFdBQVQsQUFBb0IsT0FBTyxBQUN0QztTQUFBLEFBQUssQUFHTDs7MENBQWMsTUFBTSxBQUNuQjthQUFBLEFBQUssTUFBTSxnQ0FMRCxBQUEyQixBQUlsQixBQUNSLEFBQWdDOztDQUxqQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0dmLDJCQUFrQixBQUFTLEtBQVQsQUFBYyxPQUFPLEFBR25DOzs7UUFBRyxFQUFILEFBQUcsQUFBRSxBQUVMOzs7YUFDSSxBQUFLLGFBQWEseUJBREEsQUFDbEIsQUFDQTthQUFBLEFBQUssV0FBTCxBQUFnQixHQUFoQixBQUFtQixTQUFTLEtBQUEsQUFBSyxPQUFMLEFBQVksS0FGdEIsQUFFbEIsQUFBNEIsQUFBaUIsQUFDN0M7YUFBQSxBQUFLLFdBQUwsQUFBZ0IsTUFBTSxFQUFDLE9BSGYsQUFBVSxBQUdsQixBQUF1QixBQUFPLEFBS2xDOztBQVJzQixBQUNsQixLQURROzs7WUFTSixPQURVLEFBQ1YsQUFBTzs7QUFERyxBQUNkLFNBRUEsQ0FBQSxBQUFFLElBQUYsQUFBTSw2REFBbUQsQUFBUzs7O2dCQUcxRCxXQUFXLFdBQUEsQUFBVyxRQUh3QyxBQUc5RCxBQUFXLEFBQW1CLEFBRWxDOztnQkFBSSxPQUFPLFNBQVUsRUFBQyxXQUFXLEtBQUEsQUFBSyxXQUw0QixBQUs5RCxBQUFPLEFBQVcsQUFBVyxBQUFnQjs7QUFMaUIsQUFHbEUsbUJBSU4sQ0FBQSxBQUFRLElBQUksS0FB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bkIsQUFBRSxBQUFXLEFBQ0Q7Q0FEViIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdCBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZCh7XG4gICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDozMDAwL3BheXMnLFxuXG5cbiAgICB1c2VEaXBsb21hVXJsKG5hbWUpIHtcbiAgICBcdHRoaXMudXJsID0gJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9wYXlzLycgKyBuYW1lO1xuICAgIH1cblxufSlcblxuLy8tLS0tLS0tLSBGSU4gLS0tLS0tLVxuXG4vLyBFY3JpcmUgTW9kZWwgcXVpIHJldG91cm5lIHVuIGpzb24gdW5pcXVlXG4vLyB0cmllciBkaWZmZXJtbnQgcG91ciByZW52b3llciBsZXMgcGF5cyBwbHVzIGV2ZW50dWxtbnQgbGVzIHBheXMgc2Vsb24gZGVzIHBhcmFtZXRyZXMgZGUgc2VsZWN0aW9uXG5cbi8vIEZpbmlyIGxlcyBkaWZmZXJlbnRlcyBjb3Vyb25uZXNcblxuLy8gYXR0ZW50aW9uIGF1IGJ1ZyBkZSByZW5kZXIgc2kgYWN0aW9uIHRyb3AgcmFwaWRlXG5cbi8vIERlcGxveW1udCBpbiBMQUJcbiIsImltcG9ydCBwZXJzb25uZUNvbGxlY3Rpb24gZnJvbSAnLi9wZXJzb25uZUNvbGxlY3Rpb24nO1xuXG5cbnZhciBwZXJzb25uVmlldyA9IEJhY2tib25lLlZpZXcuZXh0ZW5kKHtcblxuICAgIC8vdGFnTmFtZTogJ21haW4nLFxuICAgIGVsOiQoJ21haW4nKSxcblxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IG5ldyBwZXJzb25uZUNvbGxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLm9uKCdyZXNldCcsIHRoaXMucmVuZGVyLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24uZmV0Y2goe3Jlc2V0OiB0cnVlfSk7XG4gICAgICAgIC8vdGhpcy5saXN0ZW5Ubyh0aGlzLmNvbGxlY3Rpb24sICdzeW5jJywgdGhpcy5yZW5kZXIpO1xuICAgIH0sXG5cblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAvL2NvbnNvbGUuZGVidWcodGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpKTtcbiAgICAgICAgJC5nZXQoXCIuL3NyYy9wZXJzb25uZXMvdGVtcGxhdGVzL3BlcnNvbm5lVGVtcGxhdGUuaHRtbFwiLCBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgLy92YXIgaHRtbCA9ICQocmVzKTtcblxuICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gSGFuZGxlYmFycy5jb21waWxlKHJlcyk7XG5cbiAgICAgICAgICAgIHZhciBodG1sID0gdGVtcGxhdGUoIHtwZXJzb25uZXM6IHRoYXQuY29sbGVjdGlvbi50b0pTT04oKX0gKTsgICAvLyArLy0gZG9ubmUgdW4gbm9tIGEgbW9uIG9ialxuXG4gICAgICBjb25zb2xlLmxvZyh0aGF0LmNvbGxlY3Rpb24udG9KU09OKCkpXG5cbiAgICAgICAgICAgIHRoYXQuJGVsLmh0bWwoaHRtbCk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGh0bWwpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh0aGF0LmNvbGxlY3Rpb24udG9KU09OKCkpO1xuXG4gICAgICAgICAgICAkLmdldChcIi4vc3JjL3ZlbmRvci9hc3NldHMvY291cm9ubmUtZXh0LnN2Z1wiLCBmdW5jdGlvbihzdmcpe1xuXG4gICAgICAgICAgICAgICAgdmFyIHN2Z0VsZW1lbnQgPSAkKHN2ZykuZmluZCgnc3ZnJyk7XG4gICAgICAgICAgICAgICAgJCgnI25hdi1jZW50ZXInKS5hcHBlbmQoIHN2Z0VsZW1lbnQgKTtcblxuICAgICAgICAgICAgICAgIGQzLnNlbGVjdEFsbCgnLmFyYycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuaWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5yZW5kZXJEaXBsb21hKCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2NpcmNsZXNcIikuYXBwZW5kKFwic3ZnXCIpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICQuZ2V0KFwiLi9zcmMvdmVuZG9yL2Fzc2V0cy9sb2dvLWdvYi13aGl0ZS5zdmdcIiwgZnVuY3Rpb24oc3ZnKXtcbiAgICAgICAgICAgICAgICB2YXIgc3ZnRWxlbWVudCA9ICQoc3ZnKS5maW5kKCdzdmcnKTtcbiAgICAgICAgICAgICAgICAkKCcjbG9nbycpLmFwcGVuZCggc3ZnRWxlbWVudCApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKkFERCovXG4gICAgICAgICAgICAgICAgJC5nZXQoXCIuL3NyYy92ZW5kb3IvYXNzZXRzL2NvdXJvbm5lLWRhdGUuc3ZnXCIsIGZ1bmN0aW9uKHN2Zyl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdmdFbGVtZW50ID0gJChzdmcpLmZpbmQoJ3N2ZycpO1xuICAgICAgICAgICAgICAgICAgICAkKCcjZGF0ZScpLmFwcGVuZCggc3ZnRWxlbWVudCApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGF0LnJlbmRlclNWRygpO1xuICAgICAgICAgICAgdGhhdC5yZW5kZXJBbmltYXRpb24oKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCh0aGF0LmFmdGVyUmVuZGVyLmJpbmQodGhhdCksIDEpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgcmVuZGVyRGlwbG9tYSgpIHtcblxuICAgICAgICB2YXIgZGlwbG9tYXMgPSBbXTtcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcuc2VsZWN0ZWQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBkaXBsb21hcy5wdXNoKCQodGhpcykuYXR0cignZGF0YS1kaXBsb21hJykpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLnVzZURpcGxvbWFVcmwoZGlwbG9tYXMuam9pbignLScpKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uLmZldGNoKHtyZXNldDogZmFsc2V9KS5kb25lKHRoaXMucmVuZGVyU1ZHLmJpbmQodGhpcykpO1xuXG4gICAgfSxcblxuICAgICBhZnRlclJlbmRlcigpe1xuICAgICAgICB0aGlzLnJlbmRlclNWRygpO1xuXG4gICAgfSxcblxuICAgIHJlbmRlclNWRygpIHtcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNjaXJjbGVzXCIpLnNlbGVjdChcInN2Z1wiKTtcbiAgICAgICAgdmFyIHNoYXBlcyA9IHN2Zy5zZWxlY3RBbGwoXCIuc2hhcGVzXCIpXG4gICAgICAgICAgICAuZGF0YSh0aGlzLmNvbGxlY3Rpb24udG9KU09OKCksIGZ1bmN0aW9uKGQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBkLnBheXM7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgLy9jb25zb2xlLnRhYmxlKHRoaXMuY29sbGVjdGlvbi50b0pTT04oKSk7XG5cbiAgICAgICAgdmFyIGFuZ2xlID0gMDtcbiAgICAgICAgY29uc3QgcmFkaXVzID0gMjc1O1xuICAgICAgICB2YXIgbmJyID0gdGhpcy5jb2xsZWN0aW9uLnRvSlNPTigpLmxlbmd0aDtcbiAgICAgICAgdmFyIHdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIHZhciBhcmMgPSAkKFwiLnNlbGVjdGVkXCIpLmF0dHIoJ2lkJyk7XG5cbiAgICAgICAgdmFyIGdyb3VwID0gc2hhcGVzLmVudGVyKCkuYXBwZW5kKCdnJykuY2xhc3NlZCgnc2hhcGVzJywgdHJ1ZSk7XG4gICAgICAgIHNoYXBlcy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZ3JvdXApO1xuXG4gICAgICAgIHZhciBjb2xvciA9ICcjMUI2REFEJztcbiAgICAgICAgdmFyIHN0cm9rZTtcbiAgICAgICAgZ3JvdXAuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIGZ1bmN0aW9uKGQsIGkpeyByZXR1cm4gTWF0aC5zaW4oaSsxKjQ4MCAqIE1hdGguUEkgLzE4MCApICogcmFkaXVzICsgd2lkdGgvMi4wNTsgfSkgICAgICAgICAvL3JldHVybiAoaSsxKSAqIDU1O1xuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCBmdW5jdGlvbihkLCBpKXsgcmV0dXJuIE1hdGguY29zKGkrMSo0ODAgKiBNYXRoLlBJIC8xODApICogcmFkaXVzICsgaGVpZ2h0LzI7IH0pXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgZnVuY3Rpb24oZCwgaSl7IHJldHVybiBNYXRoLmxvZyhkLnRvdGFsKSo1KzMgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgaWYoIE1hdGgubG9nKGQudG90YWwpKjUrMyA8IDQpeyAgICAgLy8gMyA9IHZhbGV1ciBtaW5pbXVtID0gMSBzdXIgbCdlY2hlbGxlIGRlIGxvZ1xuICAgICAgICAgICAgICAgICAgICBzdHJva2UgPSBcIiNGRkZcIlxuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBzdHJva2UgPSAnI0ZGRidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cm9rZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcInN0cm9rZVwiLCcjMDAwJylcbiAgICAgICAgICAgIC5vbihcImNsaWNrXCIsZnVuY3Rpb24oZCl7XG5cbiAgICAgICAgICAgICAgIC8vYWxlcnQoXCJ2aWV3IGxpbmtlZGluIHByb2ZpbGVcIilcbiAgICAgICAgICAgICAgICAgICAgJChcIiNidWxsZXNcIikuZmFkZUluKCk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKFwiI2J1bGxlc1wiKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgfSwgNTAwMCk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGdyb3VwLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAgIC5hdHRyKFwiZHhcIiwgZnVuY3Rpb24oZCwgaSl7IHJldHVybiBNYXRoLnNpbihpKzEqNDgwICAqIE1hdGguUEkgLzE4MCApICogcmFkaXVzKjEuMyArIHdpZHRoLzIuMTUgOyB9KVxuICAgICAgICAgICAgLmF0dHIoXCJkeVwiLCBmdW5jdGlvbihkLCBpKXsgcmV0dXJuIE1hdGguY29zKGkrMSo0ODAgICogTWF0aC5QSSAvMTgwKSAqIHJhZGl1cyoxLjI1ICsgaGVpZ2h0LzIgOyB9KVxuICAgICAgICAgICAgLnRleHQoZnVuY3Rpb24oZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGQucGF5c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgJyNGRkYnKTtcblxuXG4gICAgICAgIHNoYXBlc1xuICAgICAgICAgICAgLnNlbGVjdCgnY2lyY2xlJylcbiAgICAgICAgICAgIC50cmFuc2l0aW9uKClcbiAgICAgICAgICAgIC5kdXJhdGlvbig4MDApXG4gICAgICAgICAgICAuZWFzZSgnYm91bmNlJylcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCBmdW5jdGlvbihkLCBpKXsgcmV0dXJuIE1hdGgubG9nKGQudG90YWwpKjYrMyB9KVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcbiAgICAgICAgICAgICAgICBpZiggTWF0aC5sb2coZC50b3RhbCkqNSszIDwgMSl7ICAgICAvLyAzID0gdmFsZXVyIG1pbmltdW0gPSAxIHN1ciBsJ2VjaGVsbGUgZGUgbG9nXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKE1hdGgubG9nKGQudG90YWwpKjUrMylcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlPSBcIiMwMFwiXG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgaWYoIGFyYyA9PSAxKXsgc3Ryb2tlID0gXCIjMDBGRkMxXCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gMil7IHN0cm9rZSA9IFwiIzAwQzRCQlwiIH1cbiAgICAgICAgICAgICAgICBpZiggYXJjID09IDMpeyBzdHJva2UgPSBcIiMwMEEyQjhcIiB9XG4gICAgICAgICAgICAgICAgaWYoIGFyYyA9PSA0KXsgc3Ryb2tlID0gXCIjMDA4MkI1XCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gNSl7IHN0cm9rZSA9IFwiIzAwNjNCMlwiIH1cbiAgICAgICAgICAgICAgICBpZiggYXJjID09IDYpeyBzdHJva2UgPSBcIiMwMDQwYzFcIiB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBzdHJva2VcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgc2hhcGVzXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCdjaXJjbGUsIHRleHQnKVxuICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbihkKXtcblxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT09IHVuZGVmaW5lZCl7IGNvbG9yID0gXCIjRkZGXCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gMSl7IGNvbG9yID0gXCIjMDBGRkMxXCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gMil7IGNvbG9yID0gXCIjMDBDNEJCXCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gMyl7IGNvbG9yID0gXCIjMDBBMkI4XCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gNCl7IGNvbG9yID0gXCIjMDA4MkI1XCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gNSl7IGNvbG9yID0gXCIjMDA2M0IyXCIgfVxuICAgICAgICAgICAgICAgIGlmKCBhcmMgPT0gNil7IGNvbG9yID0gXCIjMDA0MGMxXCIgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbG9yXG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJChcIi5zZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coJChcIi5zZWxlY3RlZFwiKS5hdHRyKCdpZCcpKVxuICAgICAgICAgICAgaWYoZWxlbWVudC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICQoXCIjY2lyY2xlc1wiKS5jc3MoIFwib3BhY2l0eVwiLCBcIjFcIiApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIWVsZW1lbnQubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAkKCBcIiNjaXJjbGVzXCIgKS5hbmltYXRlKHsgXCJvcGFjaXR5XCI6IFwiMC42XCIgfSwgMjAwKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBpZihlbGVtZW50WzBdID09PSB1bmRlZmluZWQgKXtcbiAgICAgICAgICAgICAgICAgJCgnI2luZm8nKS50ZXh0KFwiTGEgcmVwYXJ0aXRpb24gaW50ZXJuYXRpb25hbCBkZSBsJ2Vuc2VtYmxlIGRlcyBHb2JlbGluc1wiKS5jc3MoIFwiY29sb3JcIiwgXCIjMTA0MTY4XCIgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRpcGxvbWFzID0gW107XG4gICAgICAgICAgICBkMy5zZWxlY3RBbGwoJy5zZWxlY3RlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgZGlwbG9tYXMucHVzaCgkKHRoaXMpLmF0dHIoJ2RhdGEtZGlwbG9tYScpKTtcbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGlwbG9tYXMpXG5cbiAgICAgICAgICAgIC8vJCgnI2luZm8nKS50ZXh0KCdMYSByw6lwYXJ0aXRpb24gaW50ZXJuYXRpb25hbGxlIGRlcyAnKTtcbiAgICAgICAgICAgIC8vJCgnI2luZm8nKS5hcHBlbmQoIGRpcGxvbWFzICtcIiBlbiAyMDE1XCIpO1xuXG4gICAgICAgICAgICBpZiggZWxlbWVudFswXSAhPT0gdW5kZWZpbmVkICl7XG4gICAgICAgICAgICAgICAgJCgnI2luZm8nKS50ZXh0KCdMYSByw6lwYXJ0aXRpb24gaW50ZXJuYXRpb25hbCBkZXMgJyk7XG4gICAgICAgICAgICAgICAgJCgnI2luZm8nKS5hcHBlbmQoIGRpcGxvbWFzICtcIiBlbiAyMDE1XCIpO1xuICAgICAgICAgICAgfVxuXG5cblxuXG5cbiAgICB9LCAgcmVuZGVyQW5pbWF0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgZmxhZyA9IDA7XG4gICAgICAgICAgICB2YXIgZmxhZzIgPSAwO1xuXG4gICAgICAgICAgICAkKCcjcGljdG9hZGQnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGZsYWcgPSAxO1xuXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLmNzcyggXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwibm9uZVwiICk7XG5cbiAgICAgICAgICAgICAgICBpZihmbGFnMiA9PTApe1xuICAgICAgICAgICAgICAgICAgICAkKCcjbG9naW4nKS5mYWRlSW4oKTtcbiAgICAgICAgICAgICAgICAgICAgZmxhZzIgPSAxO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAkKCcjbG9naW4nKS5mYWRlT3V0KCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoIFwiYmFja2dyb3VuZC1pbWFnZVwiLCBcInVybCgnLi4vc3JjL3ZlbmRvci9hc3NldHMvYmFja2dyb3VuZC5wbmcnKVwiICk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwaWN0b2FkZCcpLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnbWFpbicpLmZhZGVJbigyMDAwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBpY3RvXCIpO1xuXG4gICAgICAgICAgICB9KTtcblxuXG5cbiAgICAgICAgICAgIGlmKGZsYWcgPT0gMCl7XG4gICAgICAgICAgICAgICAgJChkb2N1bWVudCkuY2xpY2soZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50LnByZXZlbnREZWZhdWx0KCkgJiYgZmxhZyA9PSAxKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgZmxhZyA9IDE7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5jc3MoIFwiYmFja2dyb3VuZC1pbWFnZVwiLCBcInVybCgnLi4vc3JjL3ZlbmRvci9hc3NldHMvYmFja2dyb3VuZC5wbmcnKVwiICk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwaWN0b2FkZCcpLmZhZGVPdXQoKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnbWFpbicpLmZhZGVJbigyMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhmbGFnKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgfVxuXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcGVyc29ublZpZXc7XG4iLCJpbXBvcnQgcGVyc29ubmVWaWV3IGZyb20gJy4vcGVyc29ubmVzL3BlcnNvbm5lVmlldyc7XG5cbiQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2aWV3ID0gbmV3IHBlcnNvbm5lVmlldygpO1xuIH0pO1xuIl19
