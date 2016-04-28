export default Backbone.Collection.extend({
    url: 'http://172.18.33.116:3000/pays',

    
    useDiplomaUrl(name) {
    	this.url = 'http://172.18.33.116:3000/pays/' + name;
    }

})