import React, { Component } from 'react';
import NProgress from 'nprogress';
import Voice from './voice';
import logo from './logo.svg';
import 'nprogress/nprogress.css';
import './App.css';

const cloudUrl = 'https://us-central1-translateapp-bdcce.cloudfunctions.net/api/sound';
const lambdaUrl = 'https://uvxc5y0b2m.execute-api.us-east-1.amazonaws.com/dev/';
//
const postIt = (url, data) => fetch(url, {
  method: 'post',
  Accept: 'application/json',
  'Content-Type': 'application/json',
  body: JSON.stringify(data),
}).then(res => res.json());

class App extends Component {
  state = {
    start: false,
    stop: false,
    result: null,
    original: null,
    lang: 'es',
    soundLoading: false,
  };

  onEnd = () => {
    this.setState({ start: false, stop: false });
  };

  onResult = ({ finalTranscript }) => {
    postIt(cloudUrl, {
      text: finalTranscript,
      lang: this.state.lang,
    }).then(async res => {
      this.setState({
        start: false,
        original: finalTranscript,
        result: res.translation,
        soundLoading: false,
      });
      await this.lambda(res.translation);
      NProgress.done();
    });
  };
  lambda = text => {
    const { Howler, Howl } = window;
    postIt(lambdaUrl, { text }).then(res => {
      Howler.codecs = function() {
        return true;
      };
      new Howl({ src: [res.presignedUrl], autoplay: true });
    });
  };
  start = () => {
    NProgress.start();
    this.setState({ start: true, soundLoading: true });
  };
  stop = () => {
    this.setState({ stop: true });
  };

  handleLanguageChange = event => {
    this.setState({ lang: event.target.value || 'es' });
  };

  render() {
    console.log(this.state.soundLoading);
    return (
      <div className="App">
        <h5>Translation</h5>
        <button onClick={this.start}>start</button>
        <button onClick={this.stop}>stop</button>
        <select onChange={this.handleLanguageChange}>
          <option value="es">es</option>
          <option value="de">de</option>
          <option value="fr">fr</option>
        </select>
        <br />
        {this.state.soundLoading && <small>Loading Sound & Text</small>}
        {this.state.original &&
          <pre>
            Original: {this.state.original} <br />
            Translate: {this.state.result}
          </pre>}
        {this.state.start &&
          <Voice onResult={this.onResult} continuous={true} />}
      </div>
    );
  }
}

export default App;
