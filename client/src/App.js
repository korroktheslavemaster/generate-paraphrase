import logo from './logo.svg';
import './App.css';
import React, {Component} from 'react';

class App extends Component {
  state = {
    id: undefined,
    text: "",
    paraphrases: [],
    required_words: [],
    value: "",
    count: 0,
    error: ""
  }
  fetchNewOriginal = () => {
    fetch('/api/randomOriginal').then(res => res.json()).then(
      ({id, text, paraphrases, required_words}) => this.setState({id, text, paraphrases, required_words})
      )
  }
  checkParaphrase (pp, req_words) {
    var pp_split = new Set(pp.split(' '))
    var flag = 0
    for (let index = 0; index < req_words.length; index++) {
      var word = req_words[index];
      if (pp_split.has(word) == false) {
        flag = 1;
        break;
      }
    }
    if (flag == 1) {
      return false
    } else {
      return true
    }
  }
  formatText (question, req_words) {
    var q_split = question.split(' ');
    req_words = new Set(req_words)
    var out_words = [];
    var prefix = "<font color='red'>";
    var postfix = "</font>";
    q_split.forEach(word => {
      if (req_words.has(word) == true) {
        out_words.push(prefix + word + postfix);
      } else {
        out_words.push(word);
      }
    });
    return out_words.join(" ");
  }
  componentDidMount() {
    this.fetchNewOriginal();
  }
  onChange = (e) => {
    this.setState({value: e.target.value});
  }
  onSubmit = (e) => {
    e.preventDefault();
    var req_words = this.state.required_words
    var user_pp = this.state.value
    var is_pp_good = this.checkParaphrase(user_pp, req_words)
    if (is_pp_good == true) {
      this.state.count += 1
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: this.state.text, paraphrase: this.state.value})
      };
      fetch('/api/paraphrase', requestOptions)
        .then(response => response.json())
        .then(response => console.log(response))
      this.setState({value: "", error: ""})
      this.fetchNewOriginal()
      
    } else {

      var error_msg = "All required words need to be there in question!"

      this.setState({error: error_msg})
      console.log('Incorrect pp')
    }
    
  }
  render() {
    return (
      <div className="App">
        <p>
          <font size='4'>
          <b>Instructions</b><br></br>
          We need to generate paraphrases of questions such that the paraphrased question <br></br>
          contains the same entities as the original and the same meaning as the original. Words <br></br>
          highlighted in <font color='red'>red</font> need to be present in the paraphrase.
          <br></br>
          <b>Example</b>: <br></br>
          Original: Who was the <font color='red'>POTUS</font> before <font color='red'>Obama</font> <br></br>
          Paraphrase: Which person was the POTUS before Obama
          </font>
        </p>
        <h2>Paraphrases done this session: {this.state.count}. Thanks!</h2>
        <h1 dangerouslySetInnerHTML={{ __html: this.formatText(this.state.text, this.state.required_words)|| "..."}}></h1>
        <form onSubmit={this.onSubmit}>
          <input size="65" type="text" value={this.state.value} onChange={this.onChange}></input>
          <input type="submit" value="Submit" />
          <button onClick={e => {e.preventDefault(); this.setState({value: "", error: ""}); this.fetchNewOriginal()}}>New Prompt</button>
        </form>
      <br></br>
      {this.state.error}
      <br></br>
        Other paraphrases
        <ul>
          {this.state.paraphrases.map(phrase => (<li>{phrase}</li>))}
        </ul>
        Required words
        <ul>
          {this.state.required_words.map(phrase => (<li>{phrase}</li>))}
        </ul>
      </div>
    );
  }
}

export default App;
