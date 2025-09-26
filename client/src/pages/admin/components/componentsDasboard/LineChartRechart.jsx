import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LineChartRecharts = ({ data, categories }) => {
    const formattedData = categories.map(category => {
        const categoryData = { name: category };
        data.forEach(platform => {
            const categoryValue = platform.data.find(item => item.x === category)?.y || 0;
            categoryData[platform.id] = categoryValue;
        });
        return categoryData;
    });

    const colorPalette = [
        "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c", "#8dd1e1", "#d0ed57", "#ffc658"
    ];

    const renderLegend = (value, entry) => {
        const { color } = entry;
        return (
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, backgroundColor: color, marginRight: 5 }}></div>
                {value}
            </span>
        );
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={formattedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#ccc' }}
                    tickLine={{ stroke: '#ccc' }}
                />
                <YAxis
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#ccc' }}
                    tickLine={{ stroke: '#ccc' }}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: 10 }}
                    itemStyle={{ color: '#fff' }} 
                    cursor={{ stroke: '#8884d8', strokeWidth: 2 }}
                />
                <Legend
                    verticalAlign="top"
                    //wrapperStyle={{ paddingTop: 10, color: '#333', fontSize: 14 }}
                    //formatter={renderLegend}
                />
                {data.map((platform, index) => (
                    <Line
                        key={index}
                        type="monotone"
                        dataKey={platform.id}
                        stroke={colorPalette[index % colorPalette.length]}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2, fill: '#333' }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LineChartRecharts;
