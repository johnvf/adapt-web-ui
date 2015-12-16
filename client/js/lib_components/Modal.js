var React = require('react');

var Button = require('react-bootstrap/lib/Button');
var Modal = require('react-bootstrap/lib/Modal');

var ModalWrapper = React.createClass({

  getInitialState: function() {
    // return { showModal: false };
    return { showModal: this.props.show };
  },

  componentWillReceiveProps: function(nextProps){
    this.setState({ showModal: nextProps.show });
  },

  close: function() {
    this.setState({ showModal: false });
  },

  open: function() {
    this.setState({ showModal: true });
  },

  render: function() {

    return (
      <Modal bsSize={"large"} show={this.state.showModal} onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title || ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.props.content || "" }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

});

module.exports = ModalWrapper;