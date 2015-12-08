var $ = require('jquery');
var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FormGenerator = require('form-generator-react');

var LoginView = React.createClass({
  propTypes: {
    app: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      app: null
    };
  },

  getInitialState() {
    return {
      email: '',
      password: ''
    };
  },

  months: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],

  login() {
    console.log('logging it');
    $.ajax({
      type: 'post',
      url: '/login',
      data: _.pick(this.state, 'email', 'password'),
      success: (user) => {
        this.props.app.user = user;
        this.props.app.render();
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  signup(user) {
    user.birthdate = new Date(
      user.birthday.year,
      this.months.indexOf(user.birthday.month),
      user.birthday.day
    );

    $.ajax({
      type: 'post',
      url: '/signup',
      data: user,
      success: (newUser) => {
        this.props.app.user = newUser;
        this.props.app.render();
      },
      error: (err) => {
        console.log(err);
      }
    });
  },

  render() {
    var Nav = ReactBootstrap.Nav;
    var Navbar = ReactBootstrap.Navbar;
    var NavItem = ReactBootstrap.NavItem;
    var NavBrand = ReactBootstrap.NavBrand;
    var Button = ReactBootstrap.Button;
    var Input = ReactBootstrap.Input;
    var Col = ReactBootstrap.Col;

    var emailRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

    var signupForm = FormGenerator.create({
      firstName: {
        type: String,
        label: 'First Name',
        isRequired: true
      },
      lastName: {
        type: String,
        label: 'Last Name',
        isRequired: true
      },
      'email': {
        type: String,
        label: 'Email',
        isRequired: true,
        validate: FormGenerator.validators.regex(emailRegex)
      },
      'password': {
        type: String,
        label: 'Password',
        isRequired: true,
        validate: FormGenerator.validators.minLength(8)
      },
      'gender': {
        type: String,
        enum: ['', 'male', 'female', 'other'],
        label: 'Gender',
        isRequired: true
      },
      'birthday': {
        type: {
          month: {
            type: String,
            enum: this.months,
            label: 'Month'
          },
          day: {
            type: Number,
            enum: _.map(Array(31), function(value, index) {
              return index + 1;
            }),
            label: 'Day'
          },
          year: {
            type: Number,
            enum: _.map(Array(100), function(value, index) {
              return index + 1916;
            }),
            label: 'Year'
          }
        },
        label: 'Birthday'
      }
    }, 'signupForm', this.signup);

    return (
      <span>
        <Navbar inverse toggleNavKey={0}>
          <NavBrand>PennBook</NavBrand>
          <Nav right eventKey={0}>
            <form className='navbar-form' action='#'>
              <Input type='text' placeholder='email' name='email'
                onChange={(e) => {
                  this.setState({ email: e.target.value });
              }}/>
              <Input type='password' placeholder='password' name='password'
                onChange={(e) => {
                  this.setState({ password: e.target.value });
              }}/>
              <Button onClick={this.login} bsStyle='success'>Log In</Button>
            </form>
          </Nav>
        </Navbar>
        <div className='container'>
          <Col xs={6} sm={6} md={6} lg={6}>
            <img src='/signup.png' width='327' height='267'/>
              <h2>Thanks for stopping by!</h2>
              <h4>We hope to see you again soon.</h4>
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <h2>Sign Up</h2>
            <h4>It's free and always will be.</h4>
            {signupForm}
          </Col>
        </div>
      </span>
    );
  }
});

module.exports = LoginView;
