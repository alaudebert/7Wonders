import React, { useState } from 'react';
import { Button } from 'react-native';

const MyButton = () => {
  const [clickCount, setClickCount] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    if (clickCount === 1) {
      setDisabled(true);
    }
    setClickCount(clickCount + 1);
  };

  return (
    <Button
      title="Cliquez ici"
      disabled={disabled}
      onPress={handleClick}
    />
  );
};

export default MyButton;
