import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Link
} from "react-router-dom";
import { Signer } from '@waves/signer';
import { ProviderWeb } from '@waves.exchange/provider-web';
import { ProviderKeeper } from '@waves/provider-keeper';
import { ProviderMetamask } from '@waves/provider-metamask';
import { ProviderCloud } from '@waves.exchange/provider-cloud';
import { 
  Navbar,
  Container,
  Button, 
  Nav,
  Modal,
  NavDropdown,
  Image,
} from 'react-bootstrap';
import { 
  ToastContainer, 
  toast 
} from 'react-toastify';
import logo from './images/diamond.png';
import 'react-toastify/dist/ReactToastify.css';

const node_address = "https://nodes.wavesnodes.com";

const signer = new Signer({
  NODE_URL: node_address
});

class Home extends Component {
  render() {
    return (
      <div className="homeWelcome">
        <Container>
          <h1><span>Decentralized</span> Price Prediction <span>Market</span></h1>
          <p className="homeDesc">Make your predictions and earn rewards</p>
        </Container>
      </div>
    )
  }
}

class HowToPlay extends Component {
  render() {
    return (
      <div className="homeWelcome">
        <Container>
          <h1><span>How To</span> Play</h1>
          <p className="homeDesc">Here are some desc</p>
        </Container>
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      signType: '',
      signer: signer,
      signedIn: false,
      address: '',
      balances: [],
      showModal: false,
      isBalancesLoaded: false,
      usdn: 0.00,
      waves: 0.00,
    }
  }  

  login = async() => {
    signer.setProvider(new ProviderWeb());
    try {
      const userData = await signer.login();
      const balances = await signer.getBalance();
      if (userData) {
        this.setState({signer: signer,signedIn: true, address:userData.address,showModal:false,signType:'seed',balances:balances,isBalancesLoaded:true});
        toast.success("Login Successful!", {
          theme: "colored"
        });
      }
    } catch(err) {
      toast.error(err.message, {
        theme: "colored"
      });
    }
  }  

  loginCloud = async() => {
    signer.setProvider(new ProviderCloud())
    try {
      const userData = await signer.login();
      const balances = await signer.getBalance();
      if (userData) {
        this.setState({signer: signer,signedIn: true, address:userData.address,showModal:false,signType: 'email',balances:balances,isBalancesLoaded:true});
        toast.success("Login Successful!", {
          theme: "colored"
        });
      }
    } catch(err) {
      toast.error(err.message, {
        theme: "colored"
      });
    }
  }

  loginKeeper = async() => {
    const keeper = new ProviderKeeper();
    signer.setProvider(keeper);
    try {
      const userData = await signer.login();
      const balances = await signer.getBalance();
      if (userData) {
        this.setState({signer: signer,signedIn: true, address:userData.address,showModal:false,signType: 'keeper',balances:balances,isBalancesLoaded:true});
        toast.success("Login Successful!", {
          theme: "colored"
        });
      }
    } catch(err) {
      toast.error(err.message, {
        theme: "colored"
      });
    }
  }

  loginMetamask = async() => {
    const metamask = new ProviderMetamask();
    signer.setProvider(metamask);
    try {
      const userData = await signer.login();
      const balances = await signer.getBalance();
      if (userData) {
        this.setState({signer: signer,signedIn: true, address:userData.address,showModal:false,signType: 'metamask',balances:balances,isBalancesLoaded:true});
        toast.success("Login Successful!", {
          theme: "colored"
        });
      }
    } catch(err) {
      toast.error(err.message, {
        theme: "colored"
      });
    }
  }  

  logout = async() => {
    if (this.state.signedIn) {
      await this.state.signer.logout();
      this.setState({signer: '',signedIn: false, address: '', balances: [], showModal: false, isBalancesLoaded: false});
      toast.success("Logged out Successfully!")
    }
  }  

  loginModalOpen = () => {
    this.setState({showModal: true})
  }

  handleCloseModal = () => {
    this.setState({showModal: false})
  }

  truncate = (text, startChars, endChars, maxLength) => {
    if (text.length > maxLength) {
        var start = text.substring(0, startChars);
        var end = text.substring(text.length - endChars, text.length);
        while ((start.length + end.length) < maxLength)
        {
            start = start + '.';
        }
        return start + end;
    }
    return text;
  }

  getBalance = () => {
    if (this.state.signedIn && this.state.isBalancesLoaded) {
        const assetBalance = this.state.balances.find((balance) => balance.assetName === "USD-N");
        const usdn =  assetBalance ? assetBalance.amount / Math.pow(10,assetBalance.decimals) : 0.00;
        const wavesBalance = this.state.balances.find((balance) => balance.assetId === "WAVES");
        const waves =  wavesBalance ? wavesBalance.amount / Math.pow(10,wavesBalance.decimals) : 0.00;
        this.setState({usdn: usdn, waves: waves});
    }
  }
  
  copyToClipBoard = () => {
    const el = document.createElement('textarea');
    el.value = this.state.address;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    toast.info("Copied to clipboard!");
  }

  render() {
    const connectButton = () => {
      if (!this.state.signedIn) {
        return (
          <Nav.Link onClick={() => this.loginModalOpen()} className="connectButton">Connect Wallet</Nav.Link>
        )
      } else {
        return(
          <>
          <Nav.Link><i className="fa fa-history"></i> History</Nav.Link>
          <NavDropdown title={this.truncate(this.state.address,3,4,12)} id="basic-nav-dropdown" onClick={() => this.getBalance()}>
            <NavDropdown.Item onClick={() => this.copyToClipBoard()}><i className="fa fa-clipboard"></i> Copy Address</NavDropdown.Item>
            <NavDropdown.Item href={"https://wavesexplorer.com/addresses/"+this.state.address }> Show In Explorer</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item>
              <b>USDN Balance:</b> <br/>
                <small>{this.state.usdn}</small>
            </NavDropdown.Item>
            <NavDropdown.Item><b>WAVES Balance:</b> <br/>
            <small>{this.state.waves}</small>
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={() => this.logout()}><i className="fa fa-power-off"></i> Disconnect</NavDropdown.Item>
          </NavDropdown>
          </>
        )
      }
    }
    return(
      <Router>
      <div>
      <ToastContainer />
      <Navbar expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <Image src={logo} alt="logo" width="40" height="40" className="d-inline-block align-top" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link>About</Nav.Link>
            <Nav.Link as={Link} to="/howtoplay">How to Play</Nav.Link>
            <Nav.Link>FAQ</Nav.Link>
          </Nav>
          {connectButton()}
        </Navbar.Collapse>
      </Container>
      </Navbar>
      <Switch>
        <Route exact path='/' component={withRouter(Home)}></Route>
        <Route exact path='/howtoplay' component={withRouter(HowToPlay)}></Route>
      </Switch>
      <Modal
        show={this.state.showModal}
        aria-labelledby="contained-modal-title-vcenter"
        onHide={() => this.handleCloseModal()}
        >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
           Connect Wallet
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="d-grid gap-2">
            <Button style={{width: '100%', marginBottom:'10px'}} variant="dark" onClick={() => this.loginCloud()}>Login with E-Mail</Button>
            <Button style={{width: '100%', marginBottom:'10px'}} variant="dark" onClick={() => this.loginKeeper()}>Login with Keeper Wallet</Button>
            
            <div style={{textAlign: 'center',color: '#969696'}} className="mb-2 mt-2">- or -</div>
            <Button style={{width: '100%'}} variant="dark" onClick={() => this.loginMetamask()}>Login with Metamask</Button>
            <div style={{textAlign: 'center',color: '#969696'}} className="mb-2 mt-2">- or -</div>
            <Button style={{width: '100%'}} variant="light" onClick={() => this.login()}><i className="fa fa-key"></i> Login with Seed</Button>
          </div>
        </Modal.Body>
      </Modal>
      </div>
      </Router>
    )
  }
}

export default App;
