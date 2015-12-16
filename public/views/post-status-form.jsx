var $ = require('jquery');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var PostStatusFormView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired,
    statusPoster: React.PropTypes.object.isRequired,
    statusRecipient: React.PropTypes.object.isRequired,
    appStore: React.PropTypes.object
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      status: ''
    };
  },

  postStatus: function(e) {
    if (!this.state.status) return;
    $.ajax({
      type: 'post',
      url: '/api/statuses',
      data: {
        content: this.state.status,
        posterId: this.props.statusPoster._id,
        recipientId: this.props.statusRecipient._id
      },
      success: (status) => {
        // Cache the status in the app store and re-render
        this.props.appStore.fetch([status._id], 'Statuses', () => {
          this.setState({ status: '' }, () => {
            this.props.app.render();
          });
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  render() {
    var Panel = ReactBootstrap.Panel;
    var Input = ReactBootstrap.Input;
    var Button = ReactBootstrap.Button;

    var poster = this.props.statusPoster;
    var recipient = this.props.statusRecipient;

    var header = 'Update Status';
    var placeholder = "What's on your mind?";

    if (poster._id !== recipient._id) {
      header = 'Post';
      placeholder = 'Write something...';
    }
    return (
      <Panel header={header}>
        <Input type='textarea'
          value={this.state.status}
          placeholder={placeholder}
          onChange={(e) => {
            this.setState({ status: e.target.value });
        }}/>
        <Button onClick={this.postStatus}>Post</Button>
      </Panel>
    );
  }
});

module.exports = PostStatusFormView;
