var React = require('react')
  , Flow = require('react-flow')
  , FlowObject = require('react-flow/lib/core/Object')
  , $ = require('jquery');

JS.require('JS.Class', function(Class2) {

    require('react-flow/lib/trait-tests')(Class2)
});

window.App = Flow.create()

var History = require('./components/History.jsx')
  // , Diary = require('./components/Diary.jsx')
  // , Day = require('./components/Day.jsx')

require('./models/client/history-models')(App);

App.HistoryStore = require('./stores/HistoryStore')

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
    var ActiveRoute = this.props.activeRoute

    return (
        <ActiveRoute />
    )
  },

  _onRouteChange: function(){
    this.setState(App.routerStore.get())
  }
})

App.HistoryControllerView = React.createClass({
    mixins: [ Flow.Stores.StoreWatchMixin(App.container.resolve('store:History')) ],
    render: function(){
      return <History weeks={this.state.weeks}/>
    }
})

App.routerActions
    .map(function(){

        // this.resource('Diary', Diary, '/diary/:year/:week', function() {
        //     this.route('Day',  Day, '/diary/:year/:week/:day')
        // })
        
        this.route('History', App.HistoryControllerView)
    })


$(function(){
    App.appActions.start({});
})
