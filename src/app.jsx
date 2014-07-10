var React = require('react')
  , Flow = require('react-flow')
  , FlowObject = require('react-flow/lib/core/Object')
  , Trait = require('react-flow/lib/core/Trait')
  //, DiaryStore = require('./stores/ArtistListStore')
  , $ = require('jquery');

var t1,t2,t3, t4;

t3 = new Trait

t1 = new Trait({ 
    another: Trait.resolutions.chain
  },
  {
    hi: function(){ 
      console.log('heelo') 
    },
    another: function(){ 
      console.log('333333') 
    }
  })

t2 = new Trait({

  hi: function(){ 
    console.log('hihihihi') 
  },

  another: function(){ 
    console.log('another') 
  }
})

t4 = FlowObject
  .extend({

      traits: [
          t1
        , t2.resolve({ hi: Trait.resolutions.chain })
        , t3
      ],

      another: function(){ console.log('hi!') }
  })

var obj = new t4
obj.hi()

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
    mixins: [ Flow.StoreWatchMixin(App.container.resolve('store:History')) ],
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
