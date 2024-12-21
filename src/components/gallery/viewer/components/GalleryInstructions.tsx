import React from 'react';

export const GalleryInstructions = () => {
  return (
    <p className="text-sm text-muted-foreground mb-2">
      Click to select an artwork. Drag to move in X-Y plane.
      Hold Alt + drag to move closer/further (Z-axis).
      Hold Shift + drag to rotate.
      Hold S + drag to scale.
      Use WASD or arrow keys to move around. Hold right mouse button and move to look around.
      Use R/F keys to look up/down.
    </p>
  );
};