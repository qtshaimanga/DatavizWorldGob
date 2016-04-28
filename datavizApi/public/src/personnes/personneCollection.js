export default Backbone.Collection.extend({
    url: 'http://localhost:3000/pays',


    useDiplomaUrl(name) {
    	this.url = 'http://localhost:3000/pays/' + name;
    }

})

//-------- FIN -------

// Ecrire Model qui retourne un json unique
// trier differmnt pour renvoyer les pays plus eventulmnt les pays selon des parametres de selection

// Finir les differentes couronnes

// attention au bug de render si action trop rapide

// Deploymnt in LAB
