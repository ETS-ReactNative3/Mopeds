import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import QrScanner from '../components/qr-scanner/qr-scanner.min';
import ScanForm from './ScanForm';
import { mopedPUT } from '../Utils';

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
    this.setState({ isLoading: true });
    const codes = extractParameters(qrCode); // convert URL into IDs object
    mopedPUT('/scan', codes)
      .then(result => { // "then" do this (continue the chain of success)
        this.setState({ isLoading: false });
        this.processScan(result, codes);
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
    const { isLoading, scanStatus, scanResult } = this.state;
    // render Scan - define video element & attach reference object
    const title = scanStatus ? scanStatus === 'scanIn' ? 'Scanned In' : 'Scan Out' : 'Scan';
    return (
      <div className={isLoading ? 'loading' : ''}>
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
