import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="movie mr-auto ml-auto">
              <p>&nbsp;</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const movie = this.addMovie.value
                  this.props.addMovies(movie)
                }}>
                <div className="form-group mr-sm-2">
                  <input
                    id="addMovie"
                    type="text"
                    ref={(input) => { this.addMovie = input }}
                    className="form-control"
                    placeholder="Which movie is on your mind?"
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
              <p>&nbsp;</p>
              { this.props.movielists.map((mname, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        alt="#"
                        src={`data:image/png;base64,${new Identicon(mname.proposer, 30).toString()}`}
                      />
                      <small className="text-muted">{mname.proposer}</small>
                    </div>
                    <ul id="movieList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{mname.movie}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                          Upvotes: {window.web3.utils.fromWei(mname.upvotes.toString(), 'Ether')} ETH
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={mname.id}
                          onClick={(event) => {
                            let upvotes = window.web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, upvotes)
                           this.props.upvotecost(event.target.name, upvotes)
                          }}
                        >
                          Upvote
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
