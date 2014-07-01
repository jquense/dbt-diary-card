var React = require('react')
  , Moment = require('moment')
  , Link = require('./Link.jsx')
  , _ = require('lodash');

module.exports = HistoryItem = React.createClass({

  render: function() {
    var date = Moment(this.props.date)

    return (
      <li>
        <Link name="diary" query={date.format("MMM-DD-YY")}
              className="btn btn-link btn-lg col-md-2 col-lg-1 text-success">
              {date.format('Do')}
              {this.props.submitted 
                ? <i class="fa fa-check-circle"></i> 
                : ''}
        </Link>
        <div className="col-md-10 col-lg-11 hidden-sm hidden-xs">
          <div className="btn-group btn-group-justified" style ="margin-top:5px;">
            {_.map(this.props.days, function(day, k){
              <Link name="day" query={date.format("MMM-DD-YY")} className="btn btn-default">
                    {date.format('dddd')}
              </Link>
            })}
          </div>
        </div>
      </li>
    );
  }
});






