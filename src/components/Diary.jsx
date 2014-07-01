var React = require('react')
  , Link = require('./Link.jsx')
  , StoreWatch = require('react-flow').StoreWatchMixin
  , _ = require('lodash');


module.exports = Diary = React.createClass({

	mixins: [ 
		StoreWatch(App.libraryStore)
	],

	render: function() {
		return ( 
		  	<div className="container">
		  		<Link href="/Home/5">Hi!</Link>
			    <ArtistList
			      indexes={ this.state.indexes }
			    />
	    		<MediaContent/>
		  	</div>
		);
	},

	getStoreState: function(){
		return {
			indexes: App.libraryStore.getIndexes() || null,
		}
	},

});
