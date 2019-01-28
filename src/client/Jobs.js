import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { API } from './MomsBuickApp';
import SectionHeader from './components/SectionHeader';

export default class Jobs extends Component {

    constructor(props) {
        console.log('initi');
        super(props);
        this.state = {
            data: [{ wow: 'test' }],
            showForm: false
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.getJobs();
    }

    getJobs() {
        this.setState({ isLoading: true });
        fetch(`${API}/jobs`)
            .then(response => {
                console.log('fetched: ', response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ data, isLoading: false }))
            .catch(error => this.setState({ error, isLoading: false }));
    }


    render() {
    const { data, isLoading, name, showForm } = this.state;
    console.log('render ', data, isLoading);
    return (
        <div className={isLoading ? 'loading' : ''}>
            <SectionHeader title="Jobs" />

      </div>
    );
  }

}
