import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../components/componentsDasboard/theme";
import IosShareIcon from '@mui/icons-material/IosShare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import Header from "../components/componentsDasboard/Header";
import StatBox from "../components/componentsDasboard/StatBox";
import PieChartResponsive from "../components/componentsDasboard/PieChart";
import BarChart from "../components/componentsDasboard/BarChart";
import { getDashboardData } from '../../../services/index/dashboards';
import { getAllPosts } from '../../../services/index/posts';
import { getAllCategories } from '../../../services/index/postCategories';
import Skeleton from '@mui/material/Skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import LineChartRecharts from "../components/componentsDasboard/LineChartRechart";
import { keyframes } from '@emotion/react';

// Define keyframes for animation
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [dashboardData, setDashboardData] = useState(null);
  const [postsData, setPostsData] = useState(null);
  const [categoriesData, setCategoriesData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };

    const fetchPostsData = async () => {
      try {
        const { data } = await getAllPosts();
        setPostsData(data);
      } catch (error) {
        console.error("Error fetching posts data:", error.message);
      }
    };

    const fetchCategoriesData = async () => {
      try {
        const { data } = await getAllCategories();
        setCategoriesData(data);
      } catch (error) {
        console.error("Error fetching categories data:", error.message);
      }
    };

    fetchDashboardData();
    fetchPostsData();
    fetchCategoriesData();
  }, []);

  const renderSkeleton = () => (
    <Box m="20px" sx={{ animation: `${fadeIn} 1s ease-in-out` }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={isSmallScreen ? 'column' : 'row'}>
        <Skeleton variant="text" width={200} height={40} animation="wave" />
        <Skeleton variant="text" width={150} height={30} animation="wave" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        sx={{
          gridTemplateColumns: isSmallScreen ? 'repeat(1, 1fr)' : 'repeat(12, 1fr)',
          gridAutoRows: isSmallScreen ? 'auto' : '140px',
        }}
      >
        {Array.from(new Array(6)).map((_, index) => (
          <Box key={index} gridColumn={isSmallScreen ? "span 12" : "span 4"} backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <Skeleton variant="rectangular" width={isSmallScreen ? "100%" : "80%"} height={100} animation="wave" />
          </Box>
        ))}
        <Box gridColumn={isSmallScreen ? "span 12" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Skeleton variant="rectangular" width="100%" height={250} animation="wave" />
        </Box>
        <Box gridColumn={isSmallScreen ? "span 12" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Skeleton variant="rectangular" width="100%" height={250} animation="wave" />
        </Box>
        <Box gridColumn={isSmallScreen ? "span 12" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Skeleton variant="rectangular" width="100%" height={250} animation="wave" />
        </Box>
        <Box gridColumn={isSmallScreen ? "span 12" : "span 6"} gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Skeleton variant="rectangular" width="100%" height={250} animation="wave" />
        </Box>
      </Box>
    </Box>
  );

  if (!dashboardData || !postsData || !categoriesData) {
    return renderSkeleton();
  }

  const totalLikes = postsData.reduce((acc, post) => acc + post.likes, 0);

  const estudiantesPorSexoData = dashboardData.estudiantesPorSexo.map(item => ({
    name: item.sexo,
    value: item.valor
  }));

  const lineData = dashboardData.compartidosPorPlataforma.map(item => ({
    id: item.plataforma,
    color: "hsl(229, 70%, 50%)",
    data: item.categorias.map(cat => ({
      x: cat.nombre,
      y: cat.valor,
    }))
  }));

  const barData = dashboardData.compartidosPorPlataforma.map(item => {
    const barItem = { country: item.plataforma };
    item.categorias.forEach(cat => {
      barItem[cat.nombre] = cat.valor;
    });
    return barItem;
  });

  const categories = dashboardData.compartidosPorPlataforma.length > 0
    ? dashboardData.compartidosPorPlataforma[0].categorias.map(cat => cat.nombre)
    : [];

  const sortedCompartidos = [...dashboardData.compartidos].sort((a, b) => new Date(b.date) - new Date(a.date));

  const likesData = postsData.map(post => ({
    name: post.title,
    likes: post.likes,
  }));

  // Filtrar los posts que son eventos y contar las respuestas de los estudiantes
  const eventCategoryId = categoriesData.find(category => category.title === 'Eventos')?._id;
  const eventosAsistidosData = postsData
    .filter(post => post.categories.some(category => category._id === eventCategoryId))
    .map(post => ({
      name: post.title,
      value: Object.keys(post.eventResponses).length,
    }));

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection={isSmallScreen ? 'column' : 'row'}>
        <Header title="DASHBOARD" subtitle="Bienvenido a tu Dashboard" />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        sx={{
          gridTemplateColumns: isSmallScreen ? 'repeat(1, 1fr)' : 'repeat(12, 1fr)',
          gridAutoRows: isSmallScreen ? 'auto' : '140px',
        }}
      >
        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.totalCompartidos}
            subtitle="Publicaciones compartidas"
            progress={dashboardData.totalCompartidos / 100}
            icon={<IosShareIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.totalVisualizaciones}
            subtitle="Visualizaciones totales"
            progress={dashboardData.totalVisualizaciones / 500}
            icon={<VisibilityIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardData.nuevosUsuarios}
            subtitle="Nuevos Usuarios"
            progress={dashboardData.nuevosUsuarios / 100}
            icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalLikes}
            subtitle="Total Likes"
            progress={totalLikes / 1000}
            icon={<ThumbUpAltIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box mt="25px" p="0 30px" display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Publicaciones compartidas por categoría y plataforma
              </Typography>
            </Box>
          </Box>
          <Box height="100%" m="-20px 0 0 0">
            <LineChartRecharts data={lineData} categories={categories} />
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Likes por Publicación
          </Typography>
          <Box height="250px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={likesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="likes" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Eventos Asistidos por los Estudiantes
          </Typography>
          <Box height="250px">
            <PieChartResponsive data={eventosAsistidosData} />
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Estudiantes por sexo
          </Typography>
          <Box>
            <PieChartResponsive data={estudiantesPorSexoData} />
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>
            Publicaciones compartidas por plataforma y categoria
          </Typography>
          <Box height="300px" mt="-20px">
            <BarChart data={barData} categories={categories} isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn={isSmallScreen ? "span 12" : "span 6"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} colors={colors.grey[100]} p="15px">
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recientemente compartido
            </Typography>
          </Box>
          {sortedCompartidos.map((compartido, i) => (
            <Box key={`${compartido.txId}-${i}`} display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Box>
                <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                  {compartido.title}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {compartido.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{compartido.date}</Box>
              <Box backgroundColor={colors.greenAccent[500]} p="5px 10px" borderRadius="4px">
                {compartido.category}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
