const { assert } = require('chai')

const Blockin = artifacts.require('./Blockin.sol')

require('chai')
.use(require('chai-as-promised'))
.should()
contract ('Blockin',(accounts) => {
    let blockin
    
    describe ('deployment',async() =>{
        it('deploys successfully',async()=>{
            blockin= await Blockin.deployed()
            const address = await blockin.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
            
        })
        
    })
})

contract('Accounts',([deployer,proposer,upvoter])=>{
    let blockin
            before (async ()=>{
            blockin= await Blockin.deployed()
            })
    
            describe('deployment',async ()=>{
                it('deploys successfully',async () => {
                    const address = await blockin.address
                    assert.notEqual(address,0x0)
                    assert.notEqual(address,undefined)
                    assert.notEqual(address, '')
                    assert.notEqual(address, null)
                })
                it('has a name',async () => {
                    const name = await blockin.name()
                    assert.equal(name,"Blockin")
                })
            })
       
                describe('movielists',async () => {
                    let result,movieCount
                    before (async ()=>{
                        result= await blockin.addMovies('3 Idiots',{from:proposer})
                        movieCount=await blockin.movieCount () 
                    })
                  
                    it('add movies',async () => {
                              //SUCCESS
                        assert.equal(movieCount,1)
                        const event= result.logs[0].args
                        assert.equal(event.id.toNumber(),movieCount.toNumber(),'id ->Checked')
                        assert.equal(event.movie,'3 Idiots','Movies->Checked')
                        assert.equal(event.upvotes,'0','Upvotes->Verified')
                        assert.equal(event.proposer,proposer,'Proposer ->Checked')
                        console.log(event)
                            //Failure
                        await blockin.addMovies('',{from:proposer}).should.be.rejected;
                        })
                    it('list movies',async () => {
                        const _movie = await blockin.movielists(movieCount)
                           assert.equal(_movie.id.toNumber(),movieCount.toNumber(),'id ->Checked')
                           assert.equal(_movie.movie,'3 Idiots','Movies->Checked')
                            assert.equal(_movie.upvotes,'0','Upvotes->Verified')
                           assert.equal(_movie.proposer,proposer,'Proposer ->Checked')
                           console.log(event)
                          
                           
                    })
                   it('allow user to upvote the movie',async () => {
                    let oldProposerBalance
                       oldProposerBalance= await web3.eth.getBalance(proposer)
                       oldProposerBalance=new web3.utils.BN(oldProposerBalance)
                       result=await  blockin.upvotecost(movieCount,{from : upvoter,value: web3.utils.toWei('1', 'Ether')})
                       const event= result.logs[0].args
                        assert.equal(event.id.toNumber(),movieCount.toNumber(),'id ->Checked')
                        assert.equal(event.movie,'3 Idiots','Movies->Checked')
                        assert.equal(event.upvotes,'1000000000000000000','Upvote Cost->Verified')
                        assert.equal(event.proposer,proposer,'Proposer ->Checked')
                       let newProposerBalance
                       newProposerBalance= await web3.eth.getBalance(proposer)
                       newProposerBalance=new web3.utils.BN(newProposerBalance)

                       let upvoteCost
                       upvoteCost= await web3.utils.toWei('1','Ether')
                       upvoteCost=new web3.utils.BN(upvoteCost)

                       const expectedBalance=oldProposerBalance.add(upvoteCost)
                      //Should Fail
                       await blockin.upvotecost(99, { from: upvoter, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;//Cannot vote a movie that does not exist
                    console.log(event)
                    })
                })
            })
        