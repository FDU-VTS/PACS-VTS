import React, {Component} from 'react';
import StudiesService from "../services/DicomService";
import SeriesViewerTable from '../components/SeriesViewerTable';

class SeriesViewerPage extends Component {
    render() {
        return (
            <div>
                <SeriesViewerTable />
            </div>
        )
    }
}


export default SeriesViewerPage;