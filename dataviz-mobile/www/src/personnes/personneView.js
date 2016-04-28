import personneCollection from './personneCollection';


var personnView = Backbone.View.extend({

    //tagName: 'main',
    el:$('main'),

    initialize: function(){
        this.collection = new personneCollection();
        this.collection.on('reset', this.render.bind(this));     
        this.collection.fetch({reset: true});  
        //this.listenTo(this.collection, 'sync', this.render);
    },


    render: function(){
        var that = this;
        //console.debug(this.collection.toJSON());
        $.get("./src/personnes/templates/personneTemplate.html", function(res){
            //var html = $(res);

            var template = Handlebars.compile(res);

            var html = template( {personnes: that.collection.toJSON()} );   // +/- donne un nom a mon obj

            that.$el.html(html);
            //console.log(html);
            //console.log(that.collection.toJSON());

            $.get("./src/vendor/assets/couronne-ext.svg", function(svg){

                var svgElement = $(svg).find('svg');
                $('#nav-center').append( svgElement );

                d3.selectAll('.arc').on('click', function(e){
                    //console.log(this.id);
               
                    this.classList.toggle('selected');
                    that.renderDiploma();

                });
                var svg = d3.select("#circles").append("svg");

            });

            $.get("./src/vendor/assets/logo-gob-white.svg", function(svg){

                var svgElement = $(svg).find('svg');
                $('#logo').append( svgElement );

            });

            that.renderSVG();
            that.renderAnimation();

            setTimeout(that.afterRender.bind(that), 1);
        });

        return this;
    },

    renderDiploma() {

        var diplomas = [];
        d3.selectAll('.selected').each(function(){
            diplomas.push($(this).attr('data-diploma'));
        });
        this.collection.useDiplomaUrl(diplomas.join('-'));
        this.collection.fetch({reset: false}).done(this.renderSVG.bind(this));

    },
    
     afterRender(){
        this.renderSVG();

    },

    renderSVG() {
        var svg = d3.select("#circles").select("svg");
        var shapes = svg.selectAll(".shapes")
            .data(this.collection.toJSON(), function(d){
                return d.pays;
            });
        //console.table(this.collection.toJSON());

        var angle = 0;
        const radius = 250;
        var nbr = this.collection.toJSON().length;
        var width = window.innerWidth;
        var height = window.innerHeight;
        var arc = $(".selected").attr('id');

        var group = shapes.enter().append('g').classed('shapes', true);
        shapes.exit().remove();
        //console.log(group);

        var color = '#1B6DAD';
        var stroke;
        group.append("circle")
            .attr("cx", function(d, i){ return Math.sin(i+1*480 * Math.PI /180 ) * radius + width/2.05; })         //return (i+1) * 55;
            .attr("cy", function(d, i){ return Math.cos(i+1*480 * Math.PI /180) * radius + height/2; })
            .attr("r", function(d, i){ return Math.log(d.total)*5+3 })
            .style("fill", function(d){
                if( Math.log(d.total)*5+3 < 4){     // 3 = valeur minimum = 1 sur l'echelle de log
                    stroke = "#1B6DAD"
                }else{
                    stroke = '#1B6DAD'
                }
                return stroke
            })
            .style("stroke",'#1B6DAD')
            .on("click",function(d){ 
                
               //alert("view linkedin profile")
                    $("#bulles").fadeIn(); 
                setTimeout(function(){ 
                    $("#bulles").fadeOut(); 
                }, 5000);

            });

        group.append("text")
            .attr("dx", function(d, i){ return Math.sin(i+1*480  * Math.PI /180 ) * radius*1.3 + width/2.15 ; })
            .attr("dy", function(d, i){ return Math.cos(i+1*480  * Math.PI /180) * radius*1.25 + height/2 ; })
            .text(function(d){
                return d.pays
            })
            .style("fill", '#1B6DAD');


        shapes
            .select('circle')
            .transition()
            .duration(800)
            .ease('bounce')
            .attr("r", function(d, i){ return Math.log(d.total)*6+3 })
            .style("fill", function(d){
                if( Math.log(d.total)*5+3 < 1){     // 3 = valeur minimum = 1 sur l'echelle de log
                    console.log(Math.log(d.total)*5+3)
                    stroke= "#00"
                }else{
                if( arc == 1){ stroke = "#00FFC1" }
                if( arc == 2){ stroke = "#00C4BB" }
                if( arc == 3){ stroke = "#00A2B8" }
                if( arc == 4){ stroke = "#0082B5" }
                if( arc == 5){ stroke = "#0063B2" }
                if( arc == 6){ stroke = "#0040c1" }
                }
                return stroke
            });
           

        shapes
            .selectAll('circle, text')
            .style("fill", function(d){ 
              
                if( arc == 1){ color = "#00FFC1" }
                if( arc == 2){ color = "#00C4BB" }
                if( arc == 3){ color = "#00A2B8" }
                if( arc == 4){ color = "#0082B5" }
                if( arc == 5){ color = "#0063B2" }
                if( arc == 6){ color = "#0040c1" }

                return color
            });


            
            var element = $(".selected");
            //console.log($(".selected").attr('id')) 
            if(element.length){
                $("#circles").css( "opacity", "1" );
            }
            if(!element.length){
                $( "#circles" ).animate({ "opacity": "0.6" }, 200);
            }

           
            if(element[0] === undefined ){
                 $('#info').text("La repartition international de l'ensemble des Gobelins").css( "color", "#104168" );
            }
            
            var diplomas = [];
                d3.selectAll('.selected').each(function(){
                 diplomas.push($(this).attr('data-diploma'));
             });
            //console.log(diplomas)
            
            //$('#info').text('La répartition internationalle des ');
            //$('#info').append( diplomas +" en 2015");

            if( element[0] !== undefined ){ 
                $('#info').text('La répartition internationalle des ');
                $('#info').append( diplomas +" en 2015");
            }
            
           



    },  renderAnimation() {
           /*
            var flag = 0;
            var flag2 = 0;

            $('#pictoadd').click(function(){
                flag = 1;

                $('body').css( "background-image", "none" );
                
                if(flag2 ==0){
                    $('#login').fadeIn();
                    flag2 = 1;
                }else{
                    $('#login').fadeOut();
                    $('body').css( "background-image", "url('../src/vendor/assets/background.png')" );
                    $('#pictoadd').fadeOut();
                    $('main').fadeIn(2000);
                }
                
                console.log("picto");

            });


            
            if(flag == 0){
                $(document).click(function(){

                    if (!event.preventDefault() && flag == 1) return; 

                    flag = 1;
                    $('body').css( "background-image", "url('../src/vendor/assets/background.png')" );
                    $('#pictoadd').fadeOut();
                    $('main').fadeIn(2000);
                    //console.log(flag);
                })
            }
            */

           




    }




});

export default personnView;

