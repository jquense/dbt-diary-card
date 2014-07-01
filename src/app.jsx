﻿var React = require('react')
  , DiaryStore = require('./stores/ArtistListStore')
  , flow = require('./lib/Application')
  , $ = require('jquery');
 
window.App = flow.create()

var History = require('./components/History.jsx')
  // , Diary = require('./components/Diary.jsx')
  // , Day = require('./components/Day.jsx')

require('./models/client/history-models')(app);

App.ApplicationView = React.createClass({

  childContextTypes: {
    app: React.PropTypes.object
  },

  getInitialState: function(){
    return App.routerStore.get()
  },
  getChildContext: function() {
    return { app: App };
  },

  componentWillMount: function() { 
    App.routerStore.listen(this._onRouteChange); 
  }, 

  componentWillUnmount: function() { 
    App.routerStore.stopListening(this._onRouteChange); 
  },

  render: function(){
    return (
      <div>
        {this.props.activeRoute}
      </div>
    )
  },

  _onRouteChange: function(){
    this.setState(App.routerStore.get())
  }
})

App.routerActions
    .map(function(){

        // this.resource('Diary', Diary, '/diary/:year/:week', function() {
        //     this.route('Day',  Day, '/diary/:year/:week/:day')
        // })
        
        this.route('History', History)
    })


$(function(){
    App.appActions.start({});
})
