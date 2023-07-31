import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from '@mui/material';

const wrapText = (text, chunkSize) => {
  if (!text) return []; 

  const regex = new RegExp(`.{1,${chunkSize}}`, 'g');
  return text.match(regex) || [];
};

const DataTable = ({ searchedMovies }) => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%', maxHeight: 400 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '25%' }}>Movie Title</TableCell>
            <TableCell style={{ width: '25%' }}>Director Name</TableCell>
            <TableCell style={{ width: '25%' }}>Review Content</TableCell>
            <TableCell style={{ width: '25%' }}>Average Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {searchedMovies.map((movie, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: '25%' }}>{movie.movieTitle}</TableCell>
              <TableCell style={{ width: '25%' }}>{movie.directorName}</TableCell>
              <TableCell style={{ width: '25%' }}>
                {wrapText(movie.reviewContent || '', 50).map((line, i) => (
                  <div key={i} style={{ whiteSpace: 'pre-wrap' }}>
                    {line}
                  </div>
                ))}
              </TableCell>
              <TableCell style={{ width: '25%' }}>{movie.averageScore}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
