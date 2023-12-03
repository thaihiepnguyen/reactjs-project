import { memo } from 'react';
import {
  FormControl
} from '@mui/material';
import Select, { components, DropdownIndicatorProps, GroupBase, OptionProps, SingleValueProps, StylesConfig } from 'react-select';
import classes from './styles.module.scss';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@/app/components/text/ErrorMessage';
import TextTitle from '@/app/components/text/TextTitle';


const customStyles = (error?: boolean): StylesConfig<any, boolean, GroupBase<unknown>> => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '20px',
    letterSpacing: '0.015em',
    color: '#1C1C1C',
    padding: '14px 15px',
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: state.isSelected || state.isFocused ? '#E8F1FB' : '#ffffff',
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 16,
    fontWeight: 500,
    color: error ? '#1C1C1C' : "rgba(28, 28, 28, 0.65)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "10px 5px 10px 13px"
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
  }),
  control: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: error ? 'rgba(175, 28, 16, 0.08)' : '#ffffff',
    borderColor: error ? '#af1c10' : 'rgba(28, 28, 28, 0.2)',
  })
})

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={""} alt="" />
    </components.DropdownIndicator>
  );
};

const Option = ({ children, ...props }: OptionProps<any>) => (
  <components.Option {...props}>
    {props.data?.img && <img src={props.data.img} alt="" className={classes.iconOption} />}
    {children}
  </components.Option>
)

const SingleValue = ({ children, ...props }: SingleValueProps<any>) => (
  <components.SingleValue {...props}>
    {props.data?.img && <img src={props.data.img} alt="" className={classes.iconValue} />}
    {children}
  </components.SingleValue>
);

interface InputSelectProps {
  title?: string,
  name: string,
  errorMessage?: string | null,
  control?: any,
  bindKey?: string,
  bindLabel?: string,
  selectProps?: any,
  fullWidth?: boolean,
  optional?: boolean
  translationData?: any
}

const InputSelect = memo((props: InputSelectProps) => {
  const { title, errorMessage, name, control, bindKey, bindLabel, selectProps, fullWidth, optional, translationData } = props;

  return (
    <FormControl classes={{ root: classes.container }} sx={{ width: fullWidth ? '100%' : 'auto' }}>
      {title && <TextTitle>{title}</TextTitle>}
      {
        control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => <Select
                {...field}
                styles={customStyles(!!errorMessage)}
                getOptionValue={(option: any) => option[bindKey || 'id']}
                getOptionLabel={(option: any) => option[bindLabel || 'name']}
                components={{ DropdownIndicator, Option, SingleValue }}
                {...selectProps}
                inputProps={{autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
              />}
            />
          </>
        ) : (
          <>
            <Select
              styles={customStyles(!!errorMessage)}
              getOptionValue={(option: any) => option[bindKey || 'id']}
              getOptionLabel={(option: any) => option[bindLabel || 'name']}
              components={{ DropdownIndicator, Option, SingleValue }}
              {...selectProps}
              inputProps={{ autoComplete: 'off', autoCorrect: 'off', spellCheck: 'off' }}
            />
          </>
        )
      }
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputSelect;



