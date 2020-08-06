pragma solidity  >=0.4.21 <0.6.0;

contract Blockin{
    string public name;
    mapping(uint => MovieList) public movielists;
    uint public movieCount=0;
    struct MovieList{
        uint id;
        string movie;
        uint upvotes;
        address payable proposer;
    }
    event MovieAdded(
        uint id,
        string movie,
        uint upvotes,
        address payable proposer
    );
    event UpvoteCost(
        uint id,
        string movie,
        uint upvotes,
        address payable proposer
    );
    constructor() public{
        name="Blockin";    
    }
    function addMovies(string memory _movies) public{
        //Require valid content
        require(bytes(_movies).length>0);
       movieCount++;//Increments Movie Count
        movielists[movieCount]=MovieList(movieCount,_movies,0,msg.sender);//Adds a movie
        emit MovieAdded(movieCount,_movies,0,msg.sender);
    }
    function upvotecost(uint _id) public payable{
        require (_id >0 && _id<=movieCount); //  
                    
        //Fetch the Movie
        MovieList memory _addmovie=movielists[_id];
        //Fetch the Proposer
        address  payable _proposer= _addmovie.proposer;
        //Pay the Proposer
        address(_proposer).transfer(msg.value);
        //Increment the upvote
        _addmovie.upvotes = _addmovie.upvotes + msg.value;
        //Update the post
        movielists[_id] = _addmovie;
        //Triggger an event
        emit UpvoteCost(movieCount,_addmovie.movie,_addmovie.upvotes,_proposer);


    }
}

