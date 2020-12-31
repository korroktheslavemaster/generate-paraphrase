import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

class App extends Component {
  state = {
    id: undefined,
    text: "",
    paraphrases: [],
    value: ""
  }
  fetchNewOriginal = () => {
    fetch('/api/randomOriginal').then(res => res.json()).then(({id, text, paraphrases}) => this.setState({id, text, paraphrases}))
  }
  componentDidMount() {
    this.fetchNewOriginal();
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
  }
  render() {
    return (
      <div className="App">
        <h1>{this.state.text || "..."}</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" value={this.state.value} onChange={this.onChange}></input>
          <input type="submit" value="Submit" />
          <button onClick={e => {e.preventDefault(); this.fetchNewOriginal()}}>New Prompt</button>
        </form>
        <ul>
          {this.state.paraphrases.map(phrase => (<li>{phrase}</li>))}
        </ul>
      </div>
    );
  }
}

export default App;
