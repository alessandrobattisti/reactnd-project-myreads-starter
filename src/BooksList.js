import React from 'react'

class Book extends React.Component{
  constructor(props){
    super(props)
    this.book = props.book
    if( !this.book.hasOwnProperty('imageLinks') ){
      this.book.imageLinks = { thumbnail: ''}
    }
    if( !this.book.hasOwnProperty('authors') ){
      this.book.authors = []
    }
  }

  change = (event) => {
    console.log(event.target.value)
    this.props.change(this.book, event.target.value)
  }

  render(){
    return(
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: 'url('+ this.book.imageLinks.thumbnail +')' }}></div>
          <div className="book-shelf-changer">
            <select value={this.book.shelf || 'none'} onChange={this.change}>
              <option value="move" disabled>Move to...</option>
              <option
                value="currentlyReading">Currently Reading
              </option>
              <option
                value="wantToRead">Want to Read
              </option>
              <option
                value="read">Read
              </option>
              <option
                value="none">None
              </option>
            </select>
          </div>
        </div>
        <div className="book-title">{this.book.title}</div>
        <div className="book-authors">{this.book.authors.join(', ')}</div>
      </div>
    )
  }
}

class BookShelf extends React.Component{
  render(){
    //console.log(this.props.books)
    return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{this.props.title}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {this.props.books.map(book => (
            <li key={book.id}>
              <Book book={book} change={(book,value) => this.props.change(book,value)}/>
            </li>
          ))}
        </ol>
      </div>
    </div>
    )
  }
}

export {BookShelf, Book}
