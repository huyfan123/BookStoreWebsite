import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const BookFilters = ({ onApplyFilters }) => {
  const theme = useTheme();
  const mediumUp = useMediaQuery(theme.breakpoints.up("md"));
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [rating, setRating] = useState(null);

  const handleFormatChange = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const handleApplyFilters = () => {
    const filters = {
      priceRange,
      formats: selectedFormats,
      categories: selectedCategories,
      rating,
    };
    onApplyFilters(filters);
    setOpenMobileFilters(false);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 100]);
    setSelectedFormats([]);
    setSelectedCategories([]);
    setRating(null);
    onApplyFilters({});
    setOpenMobileFilters(false);
  };

  const filterContent = (
    <>
      {/* Price Range Filter */}
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>
          Price Range ($)
        </Typography>
        <Grid container spacing={2}>
          <TextField
            fullWidth
            type="number"
            label="Min"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
          />
          <TextField
            fullWidth
            type="number"
            label="Max"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
          />
        </Grid>
      </Box>

      <Divider />

      {/* Format Filter */}
      <Box my={3}>
        <Typography variant="subtitle1" gutterBottom>
          Language
        </Typography>
        {["English", "Spanish", "Japanese", "Italian"].map((format) => (
          <div key={format}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedFormats.includes(format)}
                  onChange={() => handleFormatChange(format)}
                />
              }
              label={format}
            />
          </div>
        ))}
      </Box>

      <Divider />

      {/* Rating Filter */}
      <Box my={3}>
        <Typography variant="subtitle1" gutterBottom>
          Genre
        </Typography>
        {[4, 3, 2, 1].map((stars) => (
          <div key={stars}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rating === stars}
                  onChange={() => setRating(rating === stars ? null : stars)}
                />
              }
              label={`${stars} stars & up`}
            />
          </div>
        ))}
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      {!mediumUp && (
        <Box sx={{ display: "inline-block", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setOpenMobileFilters(true)}
            sx={{
              my: 1,
              width: "auto", // Prevent full-width
              flexShrink: 0, // Prevent shrinking in flex containers
              px: 2, // Horizontal padding
              minWidth: "unset", // Override default min-width
              whiteSpace: "nowrap", // Prevent text wrapping
            }}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* Mobile Filter Dialog */}
      <Dialog
        open={!mediumUp && openMobileFilters}
        onClose={() => setOpenMobileFilters(false)}
        fullScreen={!mediumUp}
      >
        <DialogTitle>
          Filters
          <IconButton
            aria-label="close"
            onClick={() => setOpenMobileFilters(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{filterContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleResetFilters}>Reset</Button>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Desktop Filter Sidebar */}
      {mediumUp && (
        <Box sx={{ p: 2, width: 300 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Filters</Typography>
            <Button onClick={handleResetFilters}>Clear all</Button>
          </Box>
          {filterContent}
          <Button
            fullWidth
            variant="contained"
            onClick={handleApplyFilters}
            sx={{ mt: 2 }}
          >
            Apply Filters
          </Button>
        </Box>
      )}
    </>
  );
};

export default BookFilters;
