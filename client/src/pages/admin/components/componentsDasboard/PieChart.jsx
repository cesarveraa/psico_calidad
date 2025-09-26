import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useMediaQuery, useTheme } from '@mui/material';

const PieChartResponsive = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx={isSmallScreen ? '50%' : '45%'}
          cy={isSmallScreen ? '50%' : '42%'}
          innerRadius={isSmallScreen ? 50 : 70}
          outerRadius={isSmallScreen ? 70 : 90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout={isSmallScreen ? 'horizontal' : 'vertical'}
          align="right"
          verticalAlign={isSmallScreen ? 'bottom' : 'right'}
        />
        {/* <Legend layout="vertical" align="right" verticalAlign="middle" /> */}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartResponsive;
