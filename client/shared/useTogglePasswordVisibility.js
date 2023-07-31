
import React ,{useState} from "react";


export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('md-eye-sharp');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'md-eye-sharp') {
      setRightIcon('md-eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'md-eye-off') {
      setRightIcon('md-eye-sharp');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility
  };
};