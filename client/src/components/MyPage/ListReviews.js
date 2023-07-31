import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const ListReviews = ({ reviews, avgScore }) => {
  return (
    <>
      <Grid container spacing={2} justify="center" alignItems="center">
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ padding: 2, marginLeft: "10px", border: "2px solid #333", borderRadius: "8px", boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)" }}>
            <Typography variant="h4" gutterBottom align="center">
              Average Score: {avgScore}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} justify="center" alignItems="center">
        {reviews.map((review, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Paper elevation={1} sx={{ padding: 2, marginLeft: "10px", marginTop: "10px", border: "2px solid #333", borderRadius: "8px", boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)" }}>
              <Typography variant="body1" gutterBottom>
                Review: {review.reviewContents}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Score: {review.reviewScore}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ListReviews;
