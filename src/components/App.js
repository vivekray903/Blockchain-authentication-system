import React, { Component } from 'react';
import Web3 from 'web3';
import './css/App.css';
import Blockin from '../abis/Blockin.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

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

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Blockin.networks[networkId]
    if(networkData) {
      const blockin = web3.eth.Contract(Blockin.abi, networkData.address)
      this.setState({ blockin })
      const movieCount = await blockin.methods.movieCount().call()
      this.setState({ movieCount })
      // Load Movies
      for (var i = 1; i <= movieCount; i++) {
        const mname = await blockin.methods.movielists(i).call()
        this.setState({
          movielists: [...this.state.movielists, mname]
        })
      }
      // Sort movies with highest ethereum votes first
      this.setState({
        movielists: this.state.movielists.sort((a,b) => b.upvotes - a.upvotes )
      })
      this.setState({
         loading: false
        })
    } else {
      window.alert('Blockin contract not deployed to detected network.')
    }
  }

  addMovies(movie) {
    this.setState({ loading: true })
    this.state.blockin.methods.addMovies(movie).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  upvotecost(id, upvotes) {
    this.setState({ loading: true })
    this.state.blockin.methods.upvotecost(id).send({ from: this.state.account, value: upvotes })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      blockin: null,
      movieCount: 0,
      movielists: [],
      loading: true
    }

    this.addMovies = this.addMovies.bind(this)
    this.upvotecost = this.upvotecost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5 " color="red"><p>Loading...</p></div>
          : <Main
              movielists={this.state.movielists}
              addMovies={this.addMovies}
              upvotecost={this.upvoteCost}
            />
        }
      </div>
    );
  }
}

export default App;
