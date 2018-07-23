import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import {BookShelf, Book} from './BooksList'
import './App.css'


class BooksApp extends React.Component {
  state = {
    currentlyReading: [],
    read: [],
    wantToRead: [],
    search_results: [],
    query: '',
    query_finished: false
  }
  timeout = null;

  componentDidMount(){
    //API call using arrow function inside then
    //BooksAPI.getAll().then((res) => {
    //  console.log(res)
    //  this.setState({
    //    books_reading: res.filter(b => b.shelf === 'currentlyReading'),
    //    books_read: res.filter(b => b.shelf === 'read'),
    //    books_wantToRead: res.filter(b => b.shelf === 'wantToRead'),
    //  })
    //});
    //to do the same using a normal function instead of an arrow function
    //you need to bind 'this' otherwise this.setState won't work:
    BooksAPI.getAll()
      .then(function(res){
        this.setState({
          currentlyReading: res.filter(b => b.shelf === 'currentlyReading'),
          read: res.filter(b => b.shelf === 'read'),
          wantToRead: res.filter(b => b.shelf === 'wantToRead'),
        })
      }.bind(this) );
  }

  /* Function to limit API calls.
  *  Make the real API call only when has stopped typing for at least 500 ms
  */
  updateQuery(query){
    this.setState({
      query: query,
      query_finished: false,
      search_results: []
    })
    //based on:
    //https://schier.co/blog/2014/12/08/wait-for-user-to-stop-typing-using-javascript.html
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(this.timeout);
    // Make a new timeout
    this.timeout = setTimeout(function () {
        this.realApiCall(query)
    }.bind(this), 500);
  }

  //this is the real api call function
  realApiCall(e){
    //console.log(e, this.timeout)
    //search the API only if the query term is at least one char
    if(e.length > 0){
      //console.log(e)
      BooksAPI.search(e)
        .then(
          res => { this.setState(
            function(prevState){
              //save book shelf id in 3 different arrays
              let cr = prevState.currentlyReading.map(f => f.id)
              let r = prevState.read.map(f => f.id)
              let w = prevState.wantToRead.map(f => f.id)
              //if search returned at least one result:
              //check each search result
              //if already present in one shelf add shelf info to that object
              //else add shelf info = 'none'
              if(res.length > 0){
                return {
                  query_finished: true,
                  search_results: res.map(
                    function(book){
                      if(cr.includes(book.id)){
                        book.shelf = 'currentlyReading'
                      }else if(r.includes(book.id)){
                        book.shelf = 'read'
                      }else if(w.includes(book.id)){
                        book.shelf = 'wantToRead'
                      }else{
                        book.shelf = 'none'
                      }
                      return book
                    }
                  )}
              }
              //if search returned no results add empty array
              else{
                //console.log(res);
                return {query_finished: true, search_results: []}
              }
            }
          )}
        )
        .catch(
          err => this.setState({query_finished: true, search_results: []})
        )
    }else{
      this.setState({query_finished: true, search_results: []})
    }
  }

  resetSearch(e){
    this.setState({query:'', search_results: []})
  }

  /*  Move a book between shelves
  *   and save it to database
  */
  changeShelf(book,value){
    //if new shelf is none remove book from old shelf
    if(value==='none'){
      if(book.shelf){
        this.setState(function(prevState){
          prevState[book.shelf] = prevState[book.shelf].filter(p => p.id !== book.id)
          return prevState
        })
      }
    }
    //if book is new and is not inside a shelf already
    else if(book.shelf === 'none'){
      this.setState(prevState => {
        //save new shelf info to book (so we can then save it to db)
        book.shelf = value;
        //save new shelf info to book object inside search results
        //in order to have the book with updated book shelf info in search results array
        prevState['search_results'] = prevState['search_results'].map(function(b){
          if(b.id === book.id){
            b.shelf = value
          }
          return b
        })
        //add the book to the book shelf array
        prevState[value].push(book);
        return prevState
      })
    }
    //if new shelf is different from old shelf remove from one array and add to
    //the other
    else if(value!==book.shelf){
        //remove form old shelf
        this.setState(function(prevState){
          prevState[book.shelf] = prevState[book.shelf].filter(p => p.id !== book.id)
          return prevState
        })
        //add to new shelf but before edit book object with new shelf info
        this.setState(prevState => {
          book.shelf = value
          prevState[book.shelf].push( book )
        })
    }
    //save changes to db
    BooksAPI.update(book, value)
      .catch(
        function(err){
          console.log(err)
        }
      )
  }
  render() {
    return (
      <div className="app">

        <Route exact path="/search" render = {() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search">Close</Link>
              <div className="search-books-input-wrapper">
                <input id="search_input" type="text" onChange={event => this.updateQuery(event.target.value)} placeholder="Search by title or author"/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.search_results.length > 0 && this.state.search_results.map(book => (
                <li key={book.id}>
                  <Book book={book} change={(book,value) => this.changeShelf(book,value)}/>
                </li>
                ))}
                {/* Show "no results" when results array is empty there is a query term and API call has finished */}
                {this.state.search_results.length === 0 && this.state.query !== '' && this.state.query_finished && <li>No results</li>}
                {/* Show "searching" when results array is empty there is a query term and API call has not finished */}
                {this.state.search_results.length === 0 && this.state.query !== '' && !this.state.query_finished && <li>Searching</li>}
              </ol>
            </div>
          </div>
        )}
        />

        <Route exact path='/' render = {() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf title={ "Currently Reading" } books={this.state.currentlyReading}  change={(book,value) => this.changeShelf(book,value)}/>
                  <BookShelf title={ "Want to Read" } books={this.state.wantToRead}   change={(book,value) => this.changeShelf(book,value)}/>
                  <BookShelf title={ "Read" } books={this.state.read}  change={(book,value) => this.changeShelf(book,value)}/>
                </div>
              </div>
              <div className="open-search">
                <Link to="/search" onClick={e => this.resetSearch(e) }>Search</Link>
              </div>
            </div>
        )} />

      </div>
    )
  }
}

export default BooksApp
