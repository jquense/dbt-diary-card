var React = require('react')
  , HistoryItem = require('./HistoryItem.jsx')
  , StoreWatch = require('react-flow').StoreWatchMixin
  , _ = require('lodash');


module.exports = Library = React.createClass({

	// mixins: [ 
	// 	StoreWatch(App.historyStore)
	// ],

	getInitialState: () => { return {} },

	render: function() {
		var Weeks = _.map(this.state.weeks || [], (val, key) => {
		  		var Items = _.map(this.state.weeks, val => HistoryItem(null, val))

		  		return (
	    			<li key={key}>
		        		<h2 class="page-header">{key}</h2>
		        		<ul style="list-style:none;" class="list-inline"><Items/></ul>
	        		</li>
	    		)
			})

		return ( 
		  	<div className="container">
		  		<div className="navbar navbar-default">
				      <div className="container">
				        <div className="navbar-header">
				          <span className="navbar-brand">Welcome</span>
				        </div>
				    </div>
			  	</div>
			  	<ul className="diaries list-unstyled container">
				    {Weeks}
			    </ul>
		    </div>
		);
	},

	// getStoreState: function(){
	// 	return {
	// 		weeks: App.historyStore.getWeeks() 
	// 	}
	// },

});
