import React, { Component } from 'react';
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import QrScanner from '../components/qr-scanner/qr-scanner.min';
import ScanForm from './ScanForm';

function extractParameters(codeUrl) {
  // convert parameterized url into object:
  //  techId=1&jobId=1  ==>>  { techId: "1", jobId: "1" }
  const codes = {};
  const codeArray = codeUrl.split('&');
  codeArray.forEach(arr => {
    const code = arr.split('=');
    codes[code[0]] = code[1];
  });
  return codes;
}

export default class Scan extends Component {
  videoElem = {};  // create class variable

  constructor() {
    super(); // always have to do this if you use "constructor()" -- React gospel, sets up secret sauce
    this.state = {
      scanStatus: false
    };
    this.videoElem = React.createRef(); // set class variable to a React reference object - doing this here ahead of time so it doesn't run on every render()
  }

  componentDidMount() { // the standard "run after this renders" React function - like $(document).ready()
    const qrScanner = new QrScanner(this.videoElem.current, qrCode => this.sendCodeScan(qrCode)); // attach scanner to our video element reference - when using refs, you need to use ".current" to indicate the actual DOM element
    qrScanner.start();
  }

  sendCodeScan(qrCode) {
    const codes = extractParameters(qrCode); // convert URL into IDs object
    // POST the ids to '/api/tasks'
    // as JSON, like this: { idc: "1", techId: "1", jobId: "1" }
    fetch(`${API}/scan`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(codes)
    }) // do the fetch now
      .then(response => { // "then", when the response comes back, do this with it
        // console.log('post response: ', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(result => { // "then", when the then() function above returns, do this (continue the chain of success)
        this.setState({ isLoading: false });
        this.processScan(result, codes);
        // this.getCustomers();
      })
      .catch(error => { // if we get an Error from above
        this.setState({ isLoading: false });
        alert('error ', error);
      });
  }

  processScan(result, codes) {
    const scanStatus = result ? result : false;
    const stateResult = { scanStatus };
    if (scanStatus) {
      stateResult.scanResult = Object.assign(result, codes);
    }
    this.setState(stateResult);
  }

  render() {
    const { scanStatus, scanResult } = this.state;
    // render Scan - define video element & attach reference object
    const title = scanStatus ? scanStatus === 'scanIn' ? 'Scanned In' : 'Scan Out' : 'Scan';
    return (
      <div>
        <SectionHeader title={title} />
        {!scanStatus &&
          <video muted autoPlay playsInline ref={this.videoElem} className="scanCamera"></video>
        }
        {scanStatus && scanResult &&
          <ScanForm scanStatus={scanStatus} scanResult={scanResult} doneFunc={() => this.processScan(false)} />
        }
        <button className="btn btn-link" onClick={() => this.sendCodeScan('techId=1&jobId=1')} style={{ position: 'absolute', bottom: '40px', left: 0 }}>test</button>
      </div>
    );
  }

}
