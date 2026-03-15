import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../apis/api";
import { Box, Typography, Grid, Paper } from "@mui/material";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
];

const StatisticBooks = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/books/statistics/").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <Typography>Loading statistics...</Typography>;

  return (
    <Box p={3} width="100%">
      <Typography variant="h4" gutterBottom>
        Book Statistics
      </Typography>
      <Grid container spacing={3} width="100%">
        {/* General Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Number of Books</Typography>
            <Typography variant="h4">{stats.total_books}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Quantity in Stock</Typography>
            <Typography variant="h4">{stats.total_quantity}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Value in Stock</Typography>
            <Typography variant="h4">
              ${stats.total_value.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>

        {/* Books by Genre (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books by Genre</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.books_by_genre}
                  dataKey="count"
                  nameKey="genres"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={( props: any ) => {
                    const label = props.genres || props.name;
                    return label && label.length > 15
                      ? label.slice(0, 12) + "…"
                      : label;
                  }}
                >
                  {stats.books_by_genre.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Books by Format (Pie Chart) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books by Format</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={stats.books_by_format}
                  dataKey="count"
                  nameKey="bookFormat"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(props: any) => {
                    // Show label as 'name' or 'bookFormat', truncate if too long
                    const label = props.bookFormat || props.name;
                    return label && label.length > 15
                      ? label.slice(0, 12) + "…"
                      : label;
                  }}
                >
                  {stats.books_by_format.map((entry, idx) => (
                    <Cell
                      key={`cell-format-${idx}`}
                      fill={COLORS[idx % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Books by Language (Bar Chart) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books by Language</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.books_by_language}>
                <XAxis
                  dataKey="language"
                  tickFormatter={(lang) =>
                    lang && lang.length > 15 ? lang.slice(0, 12) + "…" : lang
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Books by Publisher (Bar Chart) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books by Publisher</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.books_by_publisher}>
                <XAxis
                  dataKey="publisher"
                  tickFormatter={(pub) =>
                    pub && pub.length > 15 ? pub.slice(0, 12) + "…" : pub
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Books by Author (Bar Chart) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Books by Author</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.books_by_author.slice(0, 10)}>
                <XAxis
                  dataKey="author"
                  tickFormatter={(auth) =>
                    auth && auth.length > 15 ? auth.slice(0, 12) + "…" : auth
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
            <Typography variant="caption">
              Top 10 authors by number of books
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticBooks;
