import React from "react";
import axios from "axios";
import TotalPlot from './TotalPlot';
import TimePlot from './TimePlot';
import DatePicker from "./DatePicker";

class Page extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          counts: [],
          days: [],
          ticks: [],
          week: 1,
          weekName: "",
          timekey: 1,
          showIndividuals: false,
          hideTotal: false,
      }
    }

    loadData(week) {
        try {
            axios
                .get('/load/' + week +'/')
                .then((res) => {
                    const counts = res.data.counts;
                    const days = res.data.days;
                    const ticks = res.data.seconds_ticks;
                    if (res.data.empties) {
                        for (let i = 0; i < counts.length; i++) {
                            Object.keys(counts[i]).forEach((key, index) => {
                                if (counts[i][key] === 0) {
                                    counts[i][key] = null;
                                }
                            })
                        }
                    }
                    this.setState({
                        counts: counts,
                        days: days,
                        ticks: ticks,
                        weekName: `${days[0]} to ${days[6]}`,
                        timekey: this.state.timekey + 1,
                        });

                    });
        } catch {
            console.log();
        }
    }
    
    componentDidMount() {
        this.loadData(this.state.week);
    }

    nav(week) {
        this.loadData(week);
    }

    loadDateRange(start, end) {
        try {
            axios
                .get(`/load/${start.split('/').join('')}/${end.split('/').join('')}/`)
                .then((res) => {
                    const counts = res.data.counts;
                    const days = res.data.days;
                    var ticks = res.data.seconds_ticks;

                    if (res.data.empties) {
                        for (let i = 0; i < counts.length; i++) {
                            Object.keys(counts[i]).forEach((key, index) => {
                                if (counts[i][key] === 0) {
                                    counts[i][key] = null;
                                }
                            })
                        }
                    }
                    this.setState({
                        counts: counts,
                        days: days,
                        weekName: `${days[0]} to ${days[days.length-1]}`,
                        timekey: this.state.timekey + 1,
                        ticks: ticks,
                        });

                    });
        } catch {
            console.log();
        }
    }

    toggleIndividuals() {
        this.setState({ showIndividuals: !this.state.showIndividuals });
    }

    toggleTotal() {
        this.setState({ hideTotal: !this.state.hideTotal });
    }

    render() {
        const thresholds = {
            "Akashiwo": null,
            "Alexandrium_singlet": 0,
            "Ceratium": null,
            "Dinophysis": 0.5,
            "Cochlodinium": null,
            "Lingulodinium": null,
            "Prorocentrum": null,
            "Pseudo_nitzschia": 10,
            "Pennate": 10,
        };

        const average = array => array.reduce((a, b) => a + b) / array.length;
        
        if (this.state.counts.length > 0) {
            var averages = 
                Object.keys(thresholds).map( 
                    name => Object.fromEntries(
                        [
                            ['name', name=='Alexandrium_singlet' ? 'Alexandrium' : name],
                            ['none', (thresholds[name] !== null) ? 0 : average(this.state.counts.map(c => c[name]))],
                            ['below', (thresholds[name] !== null) ? ( (average(this.state.counts.map(c => c[name])) < thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                            ['above', (thresholds[name] !== null) ? ( (average(this.state.counts.map(c => c[name])) > thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                        ]
                        )
                    );
        } else {
            var averages = [];
        }

        return(
            <div>
                <div className="page">
                    <h4 className="page-title">HAB Cell Concentration</h4>
                    <DatePicker 
                        days={this.state.days} 
                        loadDateRange={(start, end) => this.loadDateRange(start, end)}
                        nav={(week) => this.nav(week)}
                        startDate={this.state.days[0]}
                        endDate={this.state.days[this.state.days.length-1]}
                    />
                <div className="daily-plot">
                    {(this.state.counts) ?
                    <TimePlot 
                        counts={this.state.counts}
                        days={this.state.days}
                        thresholds={thresholds}
                        ticks={this.state.ticks}
                        key={this.state.timekey}
                        showIndividuals={this.state.showIndividuals}
                        hideTotal={this.state.hideTotal}
                        toggleIndividuals={() => this.toggleIndividuals()}
                        toggleTotal={() => this.toggleTotal()}
                    /> : <div/> }
                    </div>
                    <div className="daily-plot">
                        <h4 className="plot-title">Weekly Average by Genus</h4>
                        <DatePicker 
                            days={this.state.days} 
                            loadDateRange={(start, end) => this.loadDateRange(start, end)}
                            nav={(week) => this.nav(week)}
                            startDate={this.state.days[0]}
                            endDate={this.state.days[this.state.days.length-1]}
                        />
                        <TotalPlot
                            averages={averages}
                        />
                    </div>
                </div>
                <div className='footer'>
                    <h2 className="subheading footer-heading">Kudela Lab</h2>
                    <div className="footer-links">
                        <a className="footer-link" href="http://oceandatacenter.ucsc.edu/">Lab Website</a>
                        <p className="link-divider">|</p>
                        <a className="footer-link" href="http://akashiwo.oceandatacenter.ucsc.edu:8000/">IFCB Dashboard</a>
                    </div>
                    <p className='disclaimer'><b>Disclaimer:</b> We are providing these data as a service to interested parties. Our goal is to deliver a near-real time summary of potentially harmful algal species in the water.  Cell identification data are from an automated classifier.  The IDs and concentrations are not necessarily manually confirmed and there may be errors.</p>
                </div>
            </div>
        );
    }
}

export default (Page);