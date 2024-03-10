import * as React from "react";
import TextField from "@mui/material/TextField";

interface PasswordInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
}


export default function PasswordInput({ onChange }: PasswordInputProps) {
    return (
      <TextField
        required
        id="password-input"
        label="Enter your new Password"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={onChange}
        InputLabelProps={{
          style: { color: "white" },
        }}
        InputProps={{
            style: { color: 'white' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
            },
          }}
      />
  );
}
