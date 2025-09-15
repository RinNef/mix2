import React, { useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

export default function ImageUpload({ onUpload }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files || e.target.files;
    if (files?.length) {
      onUpload(files);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 1,
        p: 3,
        textAlign: 'center',
        '&:hover': {
          borderColor: 'primary.main',
          cursor: 'pointer'
        }
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => {
        // Trigger hidden file input
        document.getElementById('file-upload').click();
      }}
    >
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleDrop}
      />
      <UploadIcon sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
      <Box>
        Drop images here or click to upload
      </Box>
    </Box>
  );
}