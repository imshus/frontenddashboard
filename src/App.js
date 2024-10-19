import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

// Register chart components
Chart.register(...registerables);

const App = () => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState({
        endYear: '',
        topic: '',
        sector: '',
        region: '',
        pest: '',
        source: '',
        swot: '',
        country: '',
        city: ''
    });

    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://apiflask-14.onrender.com/data');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredData = data.filter(item => {
        return (
            (filters.endYear ? item.end_year === filters.endYear : true) &&
            (filters.topic ? item.topic === filters.topic : true) &&
            (filters.sector ? item.sector === filters.sector : true) &&
            (filters.region ? item.region === filters.region : true) &&
            (filters.pest ? item.pestle === filters.pest : true) &&
            (filters.source ? item.source === filters.source : true) &&
            (filters.swot ? item.swot === filters.swot : true) &&
            (filters.country ? item.country === filters.country : true) &&
            (filters.city ? item.city === filters.city : true)
        );
    });

    // Data for Bar Chart
    const generateBarChartData = () => {
        const countries = filteredData.map(item => item.country);
        const intensity = filteredData.map(item => item.intensity);
        const likelihood = filteredData.map(item => item.likelihood);
        const relevance = filteredData.map(item => item.relevance);

        return {
            labels: countries,
            datasets: [
                {
                    label: 'Intensity',
                    data: intensity,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Likelihood',
                    data: likelihood,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
                {
                    label: 'Relevance',
                    data: relevance,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
            ],
        };
    };

    const generatePieChartData = () => {
        const topics = [...new Set(filteredData.map(item => item.topic))];
        const topicCount = topics.map(topic => {
            return filteredData.filter(item => item.topic === topic).length;
        });

        return {
            labels: topics,
            datasets: [
                {
                    label: 'Distribution of Topics',
                    data: topicCount,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ]
                }
            ]
        };
    };

    return (
        <div>
            <h1>Data Visualization Dashboard</h1>

            {/* Filter Section */}
            <div>
                <select name="endYear" onChange={handleFilterChange}>
                    <option value="">Select End Year</option>
                    {[...new Set(data.map(item => item.end_year))].map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select name="topic" onChange={handleFilterChange}>
                    <option value="">Select Topic</option>
                    {[...new Set(data.map(item => item.topic))].map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                    ))}
                </select>

                <select name="sector" onChange={handleFilterChange}>
                    <option value="">Select Sector</option>
                    {[...new Set(data.map(item => item.sector))].map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                    ))}
                </select>

                <select name="region" onChange={handleFilterChange}>
                    <option value="">Select Region</option>
                    {[...new Set(data.map(item => item.region))].map(region => (
                        <option key={region} value={region}>{region}</option>
                    ))}
                </select>

                <select name="pest" onChange={handleFilterChange}>
                    <option value="">Select PEST</option>
                    {[...new Set(data.map(item => item.pestle))].map(pest => (
                        <option key={pest} value={pest}>{pest}</option>
                    ))}
                </select>

                <select name="source" onChange={handleFilterChange}>
                    <option value="">Select Source</option>
                    {[...new Set(data.map(item => item.source))].map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>

                <select name="swot" onChange={handleFilterChange}>
                    <option value="">Select SWOT</option>
                    {[...new Set(data.map(item => item.swot))].map(swot => (
                        <option key={swot} value={swot}>{swot}</option>
                    ))}
                </select>

                <select name="country" onChange={handleFilterChange}>
                    <option value="">Select Country</option>
                    {[...new Set(data.map(item => item.country))].map(country => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>

                <select name="city" onChange={handleFilterChange}>
                    <option value="">Select City</option>
                    {[...new Set(data.map(item => item.city))].map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            {/* Bar Chart */}
            <h2>Intensity, Likelihood, and Relevance by Country</h2>
            <Bar
                ref={barChartRef}
                data={generateBarChartData()}
                options={{ responsive: true }}
            />

    
            {/* Pie Chart */}
            <h2>Distribution of Topics</h2>
            <Pie
                ref={pieChartRef}
                data={generatePieChartData()}
                options={{ responsive: true }}
            />
        </div>
    );
};

export default App;
