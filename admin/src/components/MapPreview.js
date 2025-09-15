import React from 'react';
import { Box } from '@mui/material';

export default function MapPreview({ embedCode }) {
  if (!embedCode) return null;

  // Basic XSS protection by only allowing iframe tags with safe attributes
  const sanitize = (code) => {
    const div = document.createElement('div');
    div.innerHTML = code;
    const iframe = div.querySelector('iframe');
    if (!iframe) return '';

    const allowedAttrs = ['src', 'width', 'height', 'style', 'frameborder', 'allowfullscreen'];
    const attrs = Array.from(iframe.attributes);
    attrs.forEach(attr => {
      if (!allowedAttrs.includes(attr.name)) {
        iframe.removeAttribute(attr.name);
      }
    });

    return iframe.outerHTML;
  };

  return (
    <Box sx={{ mt: 2, height: 300 }}>
      <div dangerouslySetInnerHTML={{ __html: sanitize(embedCode) }} />
    </Box>
  );
}