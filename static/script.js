
var ThrottleProject = React.createClass({
  getInitialState: function() {
    return {
      socketId: null,
      buffer: []
    };
  },
  componentDidMount: function() {
    var socket = io.connect();
    var self = this;

    socket.on('connect', function() {
      self.setState({
        socketId: socket.id,
        buffer: self.state.buffer
      });
    });

    socket.on('data', function(data) {
      var updatedBuffer = self.state.buffer;
      updatedBuffer.push(data);
      // Clear buffer to save memory, we need max 100 items
      if (updatedBuffer.length > 100) {
        updatedBuffer = updatedBuffer.slice(-100);
      }
      var updatedState = {
        socketId: self.state.socketId,
        data: updatedBuffer
      }
      self.setState(updatedState);
    });
  },
  render: function() {
    return (
      <div>
        <FrequencyForm url="/startEmitter" socketId={this.state.socketId} />
        <div className="pure-g">
          <div className="pure-u-1-2">
            <TickerList buffer={this.state.buffer} />
          </div>
          <div className="pure-u-1-2">
            <ChartWrapper buffer={this.state.buffer} />
          </div>
        </div>
      </div>
    )
  }
});

var FrequencyForm = React.createClass({
  sendFrequencyToServer: function(frequency) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: {
        emit_frequency: frequency,
        socket_id: this.props.socketId
      },
      success: function(data) {
        console.log(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var frequency = parseInt(React.findDOMNode(this.refs.frequency).value);
    if (!frequency) {
      return;
    }
    this.sendFrequencyToServer(frequency);
  },
  render: function() {
    return (
      <div className="FrequencyForm"> 
        <h3>Frequency Form</h3>
        <form onSubmit={this.handleSubmit} className="pure-form">
          <fieldset>
            <label htmlFor="frequencyInput">Number of emits per second: </label>
            <input type="number" id="frequencyInput" ref="frequency" min="1" step="1"/>
            <button type="submit" className="pure-button pure-button-primary">Start</button>
          </fieldset>
        </form>
      </div>
    );
  }
});

var TickerList = React.createClass({
  getInitialState: function() {
    return {
      items: []
    };
  },
  putLastItemsToState: function(count) {
    var count = count | 20;
    var items = this.props.buffer.slice(-count);
    this.setState({
      items: items
    });
  },
  componentWillMount: function() {
    setInterval(this.putLastItemsToState, 500);
  },
  render: function() {
    var rows = [];
    this.state.items.map(function(item, i) {
      rows.push(<TickerItem key={i} timestamp={item.timestamp} number={item.number} encodedNumber={item.encoded_number} />);
    })
    return (
      <div className="TickerList">
        <h3>Ticker Box</h3>
        <table className="pure-table pure-table-horizontal">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Number</th>
              <th>Encoded number</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
});

var TickerItem = React.createClass({
  render: function() {
    return (
      <tr>
        <td>{this.props.timestamp}</td>
        <td>{this.props.number}</td>
        <td>{this.props.encodedNumber}</td>
      </tr>
    );
  }
});

var ChartWrapper = React.createClass({
  getDefaultProps: function() {
    return {
      width: 450,
      height: 500,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 75
      },
      series: {
        x: {
          'scale': 'time',
          'legend': 'TIME'
        },
        y: {
          'scale': 'linear',
          'legend': 'NUMBER'
        }
      }
    };
  },
  getInitialState: function() {
    return {
      data: []
    };
  },
  putLastItemsToState: function(count) {
    var count = count | 100;
    var items = this.props.buffer.slice(-count);
    var chartData = [];
    items.forEach(function(item) {
      var unit = {
        x: new Date(item.timestamp),
        y: item.number
      }
      chartData.push(unit);
    })
    this.setState({
      data: chartData 
    })
  },
  componentWillMount: function() {
    setInterval(this.putLastItemsToState, 500);
  },
  render: function() {
    var chartBody;
    if (this.state.data.length < 2) {
      chartBody = <p>Chart work with minimum two units</p>;
    } else {
      chartBody = <ReactLineChart margin={this.props.margin} width={this.props.width} height={this.props.height} data={this.state.data} series={this.props.series}/>;
    }
    return (
      <div className="ChartWrapper">
        <h3>Chart</h3>
        {chartBody}
      </div>
    );
  }
});

React.render(<ThrottleProject />, $('#ThrottleProject')[0])


