
import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SelectTrailer = ({ selectedMovie, changeMovie }) => {
  const movieOptions = [
    { id: 1, title: 'Fight Club' },
    { id: 2, title: 'Se7en' },
    { id: 3, title: 'Batman Begins' },
    { id: 4, title: 'Memento' },
    { id: 5, title: 'Lock, Stock and Two Smoking Barrels' },
    { id: 6, title: 'Snatch.' },
  ];

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id="movieSelectLabel">Select a Movie</InputLabel>
      <Select
        labelId="movieSelectLabel"
        id="movieSelect"
        value={selectedMovie}
        label="Select a Movie"
        onChange={changeMovie}
      >
        {movieOptions.map((movie) => (
          <MenuItem key={movie.id} value={movie.title}>
            {movie.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTrailer;
