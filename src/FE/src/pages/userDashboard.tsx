import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Header from "../components/header";

const Root = styled("div")(({ theme }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(3),
}));

const CardStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const TabPanel: React.FC<{ value: number; index: number }> = ({
  value,
  index,
  children,
}) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const UserDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Header />
      <Box sx={{ px: 30, py: 10 }}>
        <Typography variant="h4" gutterBottom>
          User Profile Management
        </Typography>
        <CardStyled>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Personal Info" />
            <Tab label="Settings" />
          </Tabs>

          {/* Personal Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  defaultValue="John Doe"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  variant="outlined"
                  defaultValue="johndoe123"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  defaultValue="johndoe@example.com"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  defaultValue="123-456-7890"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  defaultValue="123 Main Street"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary">
                  <SaveOutlinedIcon style={{ marginRight: "8px" }} />
                  Save
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  flexDirection: "row",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button variant="contained" color="primary">
                  <SaveOutlinedIcon style={{ marginRight: "8px" }} />
                  Save
                </Button>
                <Button variant="contained" color="error">
                  <DeleteOutlinedIcon style={{ marginRight: "8px" }} />
                  Delete Account
                </Button>
              </Grid>
            </Grid>
          </TabPanel>
        </CardStyled>
      </Box>
    </Box>
  );
};

export default UserDashboard;
