import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Anft from '../abis/Anft.json';

class App extends Component {

  // mount component
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // Metamask wallet connection
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  // Load blockchain Data
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    console.log("Wallet ID " + accounts)


    const networkId = await web3.eth.net.getId()
    const networkData = Anft.networks[networkId]


    if(networkData) {
      const abi = Anft.abi
      const address = networkData.address
      console.log("Network Add: " + address)

      const contract = new web3.eth.Contract(abi, address)

      // Print contract no
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()

      // Print totalSupply
      this.setState({ totalSupply })

      // How to convert hex to dec
      console.log("Total Supply: " + totalSupply)

      // Read calculatePrice
      this.setState({ contract })
      const currentPrice = await contract.methods.calculatePrice().call()

      // Print totalSupply
      this.setState({ currentPrice })

      // How to convert hex to dec
      console.log("currentPrice: " + currentPrice)


      // Load ownerOf NFTs
      for (var i = 1; i <= totalSupply; i++) {
      const ownerOf = await contract.methods.ownerOf(i).call()
        this.setState({ ownerOf })

          // Print address of owner
          console.log(i + "-" + ownerOf)
      }
      
      console.log(totalSupply)
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  adoptANFT = (qtyvalue, ethtoSend) => {
    this.state.contract.methods.adoptANFT(qtyvalue).send({ from: this.state.account , value: ethtoSend})
    .once('receipt', (receipt) => {
      this.setState({
        anfts: [...this.state.anfts, qtyvalue]
      })
    })
  }

  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      anfts: []
    }
  }

  
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crypto Amulets
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account} (acc code here) </span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const qtyvalue = this.qtyvalue.value 
                  const ethtoSend = qtyvalue * this.state.currentPrice
                  this.adoptANFT(qtyvalue, ethtoSend)
                  console.log(ethtoSend)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. 1-20'
                    ref={(input) => { this.qtyvalue = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </div>
            </main>
          </div>
          <hr/>
        
        </div>
      </div>
    );
  }
}

export default App;
