import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { API } from './MomsBuickApp';
import SectionHeader from './components/SectionHeader';
import QrScanner from './components/qr-scanner';

export default class Scan extends Component {
    videoElem = {};  // create class variable

    constructor() {
        super(); // always have to do this if you use "constructor()" -- React gospel, sets up secret sauce
        this.videoElem = React.createRef(); // set class variable to a React reference object - doing this here ahead of time so it doesn't run on every render()
    }

    componentDidMount() { // the standard "run after this renders" React function - like $(document).ready()
        const qrScanner = new QrScanner(this.videoElem.current, qrCode => this.sendCodeScan(qrCode)); // attach scanner to our video element reference - when using refs, you need to use ".current" to indicate the actual DOM element
        qrScanner.start();
    }

    sendCodeScan(qrCode) {
        const codes = this.extractIds(qrCode); // convert URL into IDs object

        // POST the ids to '/api/tasks'
        // as JSON, like this: { idc: "1", techId: "1", jobId: "1" }
        fetch(`${API}/tasks`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(codes)
          }) // do the fetch now
            .then(response => { // "then", when the response comes back, do this with it
              console.log('post response: ', response);
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Something went wrong ...');
              }
            })
            .then(() => { // "then", when the then() function above returns, do this (continue the chain of success)
                this.setState({ isLoading: false });
                alert('saved');
                this.getCustomers();
              })
              .catch(error => { // if we get an Error from above
                this.setState({ isLoading: false });
                alert('error ', error);
              });
            }

    // TODO: refactor - this is just a URL param-ati-jobber-dealie - is probably standard function somewhere...
    extractIds(codeUrl) {
        const codes = {};
        const codeArray = codeUrl.split('&');
        codeArray.forEach(arr => {
            const code = arr.split('=');
            codes[code[0]] = code[1];
        });
        return codes; // { idc: "1", techId: "1", jobId: "1" }
    }

    render() {
        // render Scan - define video element & attach reference object
        return (
            <div>
                <video ref={this.videoElem}></video>
                <button onClick={() => this.sendCodeScan('idc=2&techId=3&jobId=4')}>Send Test</button>
            </div>
        );
    }

}
