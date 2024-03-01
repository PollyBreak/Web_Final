require("dotenv").config();

const axios = require('axios');
const fmp_key = process.env.FMP_KEY



class apiController {

    getAsiaPopulation(req, res) {
        axios.get(`https://restcountries.com/v3.1/region/asia`)
            .then(response => {
                let countries = []
                for (let country of response.data) {
                    countries.push({name:country.name.official, population:country.population})
                }
                // console.log(countries);
                res.status(200).send(countries)
            })
            .catch(error => {
                // console.log(error);
                res.status(500).json({message: 'Internal server error'})
            });
    }

    countHolidaysByMonths(req, res) {
        const countryCode = req.query.country;
        axios.get(`https://date.nager.at/api/v3/publicholidays/2024/${countryCode}`) //sm
            .then(response => {
                const holidaysByMonth = {};
                for (let holiday of response.data) {
                    const holidayDate = new Date(holiday.date);
                    const month = holidayDate.toLocaleString('en-US', { month: 'long' });
                    if (!holidaysByMonth[month]) {
                        holidaysByMonth[month] = { count: 1, holidays: [holiday.localName] };
                    } else {
                        holidaysByMonth[month].count++;
                        holidaysByMonth[month].holidays.push(holiday.localName);
                    }
                }
                // console.log(holidaysByMonth);
                res.status(200).send(holidaysByMonth)
            })
            .catch(error => {
                console.log(error);
                res.status(500).json({message: 'Internal server error'})
            });
    }

    getHistoricalMarketCapApple(req, res) {
        axios.get(`https://financialmodelingprep.com/api/v3/historical-market-capitalization/AAPL?limit=100&from=2024-01-01&to=2024-25-02&apikey=${fmp_key}`) //sm
            .then(response => {
                // console.log(response.data);
                res.status(200).send(response.data)
            })
            .catch(error => {
                // console.log(error);
                res.status(500).json({message: 'Internal server error'})
            });
    }
}

module.exports = new apiController()





