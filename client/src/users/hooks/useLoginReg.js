import { callLoginReg } from '../service/userService';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

function useLoginReg() {
  const [errors, setErrors] = useState(null);
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const loginReg = async (path, formData) => {
    setIsLoading(true);

    try {
      setErrors(null);
      setGeneralError('');

      // call api with appropriate uri and data
      const user = await callLoginReg(path, formData);

      // store username and token in local storage
      localStorage.setItem('user', JSON.stringify(user));

      // update global state
      dispatch({ type: 'LOGIN', payload: user });

      // done loading, set to false
      setIsLoading(false);
    } catch (err) {
      // catch any api errors
      const responseData = err?.response?.data;
      setErrors(responseData?.errors || null);
      setGeneralError(
        responseData?.message ||
          'Registration could not be completed. Please try again.'
      );

      // done loading, set to false
      setIsLoading(false);

      // throw error to trigger catch
      throw err;
    }
  };

  return { loginReg, errors, generalError, isLoading };
}

export default useLoginReg;
