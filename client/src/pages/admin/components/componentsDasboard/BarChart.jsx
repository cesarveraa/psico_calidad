import React from 'react';
import { useTheme } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { tokens } from "./theme";

const BarChartRecharts = ({ data, categories, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Array de colores personalizados
  const customColors = [
    "#8884d8", // Azul
    "#82ca9d", // Verde
    "#ffc658", // Amarillo
    "#ff8042", // Naranja
    "#8dd1e1", // Turquesa
    "#a4de6c", // Verde claro
    "#d0ed57", // Verde lima
    "#ffc0cb", // Rosa
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 50, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          {customColors.map((color, index) => (
            <linearGradient id={`colorGradient${index}`} key={index} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.7} />
              <stop offset="100%" stopColor={color} stopOpacity={0.3} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[100]} />
        <XAxis dataKey="country" tick={{ fill: colors.grey[100] }} />
        <YAxis tick={{ fill: colors.grey[100] }} />
        <Tooltip
          contentStyle={{
            backgroundColor: colors.primary[400],
            border: 'none',
            borderRadius: '10px',
            color: colors.grey[100],
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          }}
          itemStyle={{ color: colors.grey[100] }}
          cursor={{ fill: 'rgba(255, 255, 255, 0.2)' }}
        />
        <Legend 
          wrapperStyle={{ color: colors.grey[100] }}
          iconType="circle"
        />
        {categories.map((category, index) => (
          <Bar
            key={index}
            dataKey={category}
            fill={`url(#colorGradient${index % customColors.length})`} // Aplicar gradientes personalizados
            radius={[10, 10, 0, 0]} // Esquinas redondeadas en la parte superior
            barSize={20}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
            stroke={colors.primary[300]}
            strokeWidth={1}
            shadow={{
              color: '#000000',
              offsetX: 0,
              offsetY: 2,
              blur: 6,
            }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartRecharts;
