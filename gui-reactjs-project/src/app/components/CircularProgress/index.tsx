'use client'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import classes from "./styles.module.scss"
import { useAppSelector } from "@/redux/hook";
function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        }}
        size={60}
        thickness={2}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#242424' : '#222222'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={60}
        thickness={2}
        {...props}
      />
    </Box>
  );
}

export default function CustomizedProgressBars() {
  const { isLoading } = useAppSelector((state) => state.loadingReducer);
  return (
    <>
      {isLoading && (
        <div className={classes.loading_page}>
          <Box sx={{ flexGrow: 1 }} className={classes.container}>
            <FacebookCircularProgress />
          </Box>          
        </div>
      )}
    </>
  );
}