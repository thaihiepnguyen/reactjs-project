import { useState, memo } from 'react';
import { OutlinedInput, FormControl, FormControlProps, InputAdornment, IconButton, OutlinedInputProps, SxProps, Theme } from '@mui/material';
import classes from './styles.module.scss';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import clsx from 'clsx';
import TextTitle from '../../text/TextTitle';
import ErrorMessage from '../../text/ErrorMessage';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface InputsProps extends OutlinedInputProps {
  title?: string,
  titleRequired?: boolean,
  placeholder?: string,
  name?: string,
  type?: string,
  defaultValue?: string,
  value?: string | number,
  showEyes?: boolean,
  root?: string,
  className?: any,
  inputRef?: any,
  autoComplete?: string,
  errorMessage?: string | null,
  optional?: boolean,
  infor?: string,
  isShowError?: boolean,
  rootProps?: FormControlProps
}
const InputTextfield = memo((props: InputsProps) => {

  const [toggleEyes, setToggleEyes] = useState(false);
  const { title,
    placeholder,
    name,
    defaultValue,
    value,
    type,
    root,
    className,
    showEyes,
    inputRef,
    errorMessage,
    autoComplete,
    optional,
    infor,
    titleRequired,
    isShowError,
    rootProps,
    ...rest
  } = props;

  const handleClick = () => {
    setToggleEyes(!toggleEyes);
  }

  const { ref: refInput, ...inputProps } = inputRef || { ref: null }

  return (
    <FormControl className={clsx(classes.root, root)} {...rootProps}>
      {title && (
        <TextTitle invalid={errorMessage}>{title}
          {optional ? <span className={classes.optional}>optional</span> : ""}
          {titleRequired ? <span className={classes.titleRequired}> *</span> : ""}
        </TextTitle>
      )}
      <OutlinedInput
        type={!toggleEyes ? type : 'text'}
        placeholder={placeholder}
        fullWidth
        name={name}
        defaultValue={defaultValue}
        value={value}
        variant="standard"
        classes={{ root: clsx(classes.inputTextfield, {[classes.inputInvalid]: !!errorMessage|| isShowError}) }}
        className={className}
        autoComplete={autoComplete}
        onWheel={e => (e.target instanceof HTMLElement && (e.target as any).type === 'number') && e.target.blur()}
        endAdornment={errorMessage && <ErrorOutlineIcon className={classes.iconErrorOutline} />
        }
        {...inputProps}
        inputRef={refInput}
        {...rest}
      />
      {infor && <p className={classes.textInfor}>{infor}</p>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputTextfield;



