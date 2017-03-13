import React, { Component } from 'react';
import Slider from 'material-ui/Slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import _ from 'lodash';

export default class Sliders extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentAge: 25,
            retireAge: 65,
            salary: 65000,
            salaryIncrease: 0.02,
            salarySaved: 0.05,
            alreadySaved: 5000,
            marketReturn: 0.03,
            data: [],
            finalAmount: 0,
            RAM: 0,
            curDay: new Date()
        };

        this.handleCurrentAge = _.throttle(this.handleCurrentAge.bind(this),16, {'trailing': true, 'leading': false});
        this.handleRetireAge = _.throttle(this.handleRetireAge.bind(this), 16, {'trailing': true, 'leading': false});
        this.handleSalary = _.throttle(this.handleSalary.bind(this), 16, {'trailing': true, 'leading': false});
        this.handleSalaryIncrease = _.throttle(this.handleSalaryIncrease.bind(this), 16, {'trailing': true, 'leading': false});
        this.handleSalarySaved = _.throttle(this.handleSalarySaved.bind(this), 16, {'trailing': true, 'leading': false});
        this.handleAlreadySaved = _.throttle(this.handleAlreadySaved.bind(this), 16, {'trailing': true, 'leading': false});
        this.handleMarketReturn = _.throttle(this.handleMarketReturn.bind(this), 16, {'trailing': true, 'leading': false});
        this.doTheDataThrottle = _.throttle(this.doTheData.bind(this), 16, { 'trailing': true, 'leading': false });
    }

    componentDidMount(){
        this.doTheData();
    }

    formatMoney(n, c, d, t){
            c = isNaN(c = Math.abs(c)) ? 2 : c
            d = d == undefined ? "." : d
            t = t == undefined ? "," : t
            let s = n < 0 ? "-" : ""
            let i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c)))
            let j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    }

    handleCurrentAge (event, value){
        if (value > this.state.retireAge) {
            this.setState({currentAge: value, retireAge: value + 1});
        }
        else {
            this.setState({currentAge: value});
        }
        if (value > this.state.currentAge) {
            let newMonthGap = (this.state.retireAge - value) * 12;
            let newData = this.state.data.slice(0, newMonthGap);
            this.setState({
                data: newData
            });
        }
        else {
            this.doTheDataThrottle();
        }
    }

    handleRetireAge (event, value){
        if (value < this.state.retireAge){
            let newMonthsGap = (value - this.state.currentAge) * 12;
            let newData = this.state.data.slice(0, newMonthsGap);
            this.setState({
                retireAge: value,
                data: newData
            });
        }
        else {
            this.setState({retireAge: value});
            this.doTheDataThrottle();
        }
    }

    handleSalary (event, value){
        this.setState({salary: value});
        this.doTheDataThrottle();
    }

    handleSalaryIncrease (event, value){
        this.setState({salaryIncrease: value});
        this.doTheDataThrottle();
    }

    handleSalarySaved (event, value){
        this.setState({salarySaved: value});
        this.doTheDataThrottle();
    }

    handleAlreadySaved (event, value){
        this.setState({alreadySaved: value});
        this.doTheDataThrottle();
    }

    handleMarketReturn (event, value){
        this.setState({marketReturn: value});
        this.doTheDataThrottle();
    }

    doTheData(){
        const startingSal = this.state.salary;
        const percentOfSalSavingAYear = this.state.salarySaved;
        const moneySavedAlready = this.state.alreadySaved;
        const expectedMarketReturns = this.state.marketReturn;
        const howLongTillRetire = this.state.retireAge - this.state.currentAge;
        const expectedSalaryIncreaseAYear = this.state.salaryIncrease;
        const today = this.state.curDay;
        const months = howLongTillRetire * 12;
        const rateOfReturnAMonth = Math.pow(expectedMarketReturns + 1,(1 / 12)) - 1;

        let timeMoney = this.state.data;
        let curMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        let monthlyFromSalary, begOfMonthSaved;
        let curSalary = startingSal;
        let endOfMonthSaved = moneySavedAlready;

        let x = 0;
        for (; x < months; x++){

            if (!timeMoney[x]){
                timeMoney[x] = {};
                timeMoney[x].date = this.formatDate(curMonth);
            }
            if (x % 12 === 0){
                curSalary += curSalary * expectedSalaryIncreaseAYear;
            }

            if (x === 0){
                begOfMonthSaved = moneySavedAlready;
            }
            else {
                begOfMonthSaved = timeMoney[x - 1].saved;
            }


            monthlyFromSalary = curSalary * percentOfSalSavingAYear / 12;
            endOfMonthSaved = begOfMonthSaved * (1 + rateOfReturnAMonth);
            timeMoney[x].saved  = endOfMonthSaved + monthlyFromSalary;
            curMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);


            if(x === months-1){
                this.setState({
                    RAM: (endOfMonthSaved + monthlyFromSalary)/curSalary,
                    finalAmount: endOfMonthSaved + monthlyFromSalary
                });
            }
        }
        this.setState({

            data: timeMoney.slice(0,x)
        });
    }

    formatDate (date){

        const monthNames = [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun', 'Jul',
            'Aug', 'Sep', 'Oct',
            'Nov', 'Dec'
        ];

        let day = date.getDate().toString();
        let monthIndex = date.getMonth().toString();
        let year = date.getFullYear().toString();

        let string = day + '-' + monthNames[monthIndex] + '-' + year;

        //console.log(string)

        return string;
    }

    render () {
        return (
            <div>
                <div id="title">
                    <span style={{'paddingRight': '20px'}}><h1>Retirement Calculator</h1></span>
                    <span style={{'fontSize':'medium'}}>by Jacob Cohen</span>
                    {/*<h1>Retirement Calculator</h1>*/}
                </div>
                <div id="line"></div>
                <div className="sliderRow">
                    <div className="col-md-4">
                        <div className="textAboveSlider">
                            <span style={{'fontSize':'medium'}}>Current Age</span>
                            <span style={{'paddingLeft': '20px'}}><h1>{this.state.currentAge}</h1></span>
                        </div>
                        <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={25}
                            value={this.state.currentAge}
                            onChange={this.handleCurrentAge}
                        />
                    </div>
                    <div className="col-md-4">
                        <span style={{'fontSize':'medium'}}>Target Retirement Age</span>
                        <span style={{'paddingLeft': '20px'}}><h1>{this.state.retireAge}</h1></span>
                        <Slider
                            min={this.state.currentAge + 1}
                            max={101}
                            step={1}
                            defaultValue={70}
                            value={this.state.retireAge}
                            onChange={this.handleRetireAge}
                        />
                    </div>
                    <div className="col-md-4">
                        <span style={{'fontSize':'medium'}}>Current Salary (Post-Tax)</span>
                        <span style={{'paddingLeft': '20px'}}><h1>${this.formatMoney(this.state.salary, 0, '.', ',')}</h1></span>
                        <Slider
                            min={0}
                            max={500000}
                            step={500}
                            defaultValue={65000}
                            value={this.state.salary}
                            onChange={this.handleSalary}
                        />
                    </div>

                </div>
                <div className="sliderRow">
                    <div className="col-md-3">
                        <span style={{'fontSize':'medium'}}>Expected Salary Increase/Year</span>
                        <span style={{'paddingLeft': '20px'}}><h1>{(this.state.salaryIncrease * 100).toFixed(0)}%</h1></span>
                        <Slider
                            min={0}
                            max={0.1}
                            step={0.01}
                            defaultValue={0.02}
                            value={this.state.salaryIncrease}
                            onChange={this.handleSalaryIncrease}
                        />
                    </div>
                    <div className="col-md-3">
                        <span style={{'fontSize':'medium'}}>Percent of Salary Saved/Year</span>
                        <span style={{'paddingLeft': '20px'}}><h1>{(this.state.salarySaved * 100).toFixed(0)}%</h1></span>
                        <Slider
                            min={0}
                            max={0.5}
                            step={0.01}
                            defaultValue={0.02}
                            value={this.state.salarySaved}
                            onChange={this.handleSalarySaved}
                        />
                    </div>
                    <div className="col-md-3">
                        <span style={{'fontSize':'medium'}}>Money Already Saved</span>
                        <span style={{'paddingLeft': '20px'}}><h1>${this.formatMoney(this.state.alreadySaved, 0, '.', ',')}</h1></span>
                        <Slider
                            min={0}
                            max={99500}
                            step={500}
                            defaultValue={5000}
                            value={this.state.alreadySaved}
                            onChange={this.handleAlreadySaved}
                        />
                    </div>
                    <div className="col-md-3">
                        <span style={{'fontSize':'medium'}}>Expected Yearly Market Return</span>
                        <span style={{'paddingLeft': '20px'}}><h1>{(this.state.marketReturn * 100).toFixed(0)}%</h1></span>
                        <Slider
                            min={0}
                            max={0.2}
                            step={0.01}
                            defaultValue={0.03}
                            value={this.state.marketReturn}
                            onChange={this.handleMarketReturn}
                        />
                    </div>
                </div>
                <div id="chartContainer">
                    <div id="finalSavings">
                        <h1>Savings By Retirement</h1><br />
                        <h1>${ this.formatMoney(this.state.finalAmount,0,'.',',') }</h1>
                    </div>
                    <ResponsiveContainer >
                        <LineChart
                            data={this.state.data}
                            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                            <XAxis dataKey="date" tickFormatter={(date) => date.slice(2).split('-').join(' ')} />
                            <YAxis tickFormatter={(num) => '$' + this.formatMoney(num, 0, '.', ',')} />
                            <Tooltip labelFormatter={(date) => date.slice(2).split('-').join(' ')} formatter={(num) => '$' + this.formatMoney(num, 0, '.', ',')} />
                            <Line isAnimationActive={false} type="monotone" dataKey="saved" stroke="#8884d8" activeDot={{r: 8}} />
                            {/*<CartesianGrid strokeDasharray="1 1" />  <-- add this back to get a grid system*/}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }
}

