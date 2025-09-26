import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSpring, animated } from 'react-spring';
import { tokens } from "./theme";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Datos para el círculo de progreso
  const data = [
    { name: 'Progress', value: progress },
    { name: 'Remainder', value: 1 - progress },
  ];

  // Colores para el círculo de progreso
  const progressColors = [colors.greenAccent[500], colors.grey[700]];

  // Animación para el título numérico
  const { number } = useSpring({
    from: { number: 0 },
    number: title,
    delay: 200,
    config: { duration: 1500 }
  });

  return (
    <Box
      width="100%"
      m="20px"
      p="20px"
      borderRadius="8px"
      bgcolor={colors.primary[400]}
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.2)"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            <animated.div>
              {number.to(n => Math.floor(n))}
            </animated.div>
          </Typography>
        </Box>
        <Box width={100} height={100}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={40}
                outerRadius={50}
                startAngle={90}
                endAngle={450}
                paddingAngle={5}
                dataKey="value"
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={progressColors[index % progressColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="10px" width="100%">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
