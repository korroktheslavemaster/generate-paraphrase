import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

class App extends Component {
  state = {
    id: undefined,
    q: "",
    value: ""
  }
  componentDidMount() {
    fetch('/api/randomOriginal').then(res => res.json()).then(({id, text: q}) => this.setState({id, q}))
  }
  onChange = (e) => {
    this.setState({value: e.target.value});
  }
  onSubmit = (e) => {
    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ original_id: this.state.id, text: this.state.value})
    };
    fetch('/api/paraphrase', requestOptions)
      .then(response => response.json())
      .then(response => console.log(response))
      // .then(data => this.setState({ postId: data.id }));
  }
  render() {
    return (
      <div className="App">
        <h1>{this.state.q || "..."}</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onChange={this.onChange}></input>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
