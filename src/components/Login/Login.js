import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
  if (action.type === 'INPUT_EMAIL') {
    return { value: action.val, isValid: action.val.includes('@') }; //*value: action.val
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.includes('@') }; //value: state.value
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'PASSWORD') {
    return { value: action.v, isValid: action.v.trim().length > 6 }; //*value: action.val
  }
  if (action.type === 'PASSWORD_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 }; //value: state.value
  }
  return { value: '', isValid: false };
};

const Login = props => {
  /** const [enteredEmail, setEnteredEmail] = useState('');
  const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();*/
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null }); //reducer(prevState, action-->newState), initial => state, dispatch
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const authCtx = useContext(AuthContext);

  /** деструктуризация - псевдо присвоение
 const{isValid: emailIsValid} =emailState
  const{isValid: passwordIsValid} =passwordState
*/
  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(emailState.isValid && passwordState.isValid);
      //setFormIsValid(emailState.isValid && passwordIsValid);
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailState.isValid, passwordState.isValid]); //*

  const emailChangeHandler = event => {
    //setEnteredEmail(event.target.value);
    dispatchEmail({ type: 'INPUT_EMAIL', val: event.target.value }); //action вызывает reducer

    setFormIsValid(
      //emailState.value
      emailState.isValid && passwordState.isValid,
    );
  };

  const passwordChangeHandler = event => {
    //setEnteredPassword(event.target.value);
    dispatchPassword({ type: 'PASSWORD', v: event.target.value }); //action вызывает reducer

    setFormIsValid(
      //emailState.value //event.target.value.trim().length > 6
      event.target.value.includes('@') && event.target.value.trim().length > 6,
    );
  };

  const validateEmailHandler = () => {
    //setEmailIsValid(emailState.value.includes("@")
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    //setPasswordIsValid(passwordState.value.trim().length > 6);
    dispatchPassword({ type: 'PASSWORD_BLUR' });
  };

  const submitHandler = event => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
