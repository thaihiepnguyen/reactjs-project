'use client'
import clsx from 'clsx';
import { useDropzone } from 'react-dropzone';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { AddAPhoto as AddAPhotoIcon } from '@mui/icons-material';
import classes from './styles.module.scss';

const PHOTO_SIZE = 3145728; // bytes
const FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'];

interface UploadImageProps {
  disabled?: boolean;
  caption?: string;
  errorMessage?: string;
  file?: string | File;
  onChange?: (file: string | File) => void;
  className?: string;
  photoSize?: number;
  fileFormats?: string[];
  square?: boolean;
  align?: 'center' | 'left'
}

const UploadImage = memo(
  ({
    disabled,
    caption,
    errorMessage,
    file,
    onChange,
    className,
    photoSize = PHOTO_SIZE,
    fileFormats = FILE_FORMATS,
    square,
    align = 'center',
    ...other
  }: UploadImageProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string>('');
    const [fileReview, setFileReview] = useState<string>('');

    const handleDrop = useCallback(
      async (acceptedFiles) => {
        let file = acceptedFiles[0];
        const checkSize = file.size < photoSize;
        const checkType = fileFormats.includes(file.type);
        if (!checkSize) {
          setIsError('size-invalid');
          return
        }
        if (!checkType) {
          setIsError('type-invalid');
          return
        }
        setIsError('');
        setIsLoading(true);
        onChange && onChange(file)
        setIsLoading(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange]
    );

    useEffect(() => {
      if (!!file && typeof file === "object") {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => setFileReview(reader.result as string);
      } else {
        setFileReview(file as string)
      }
    }, [file])

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragReject,
      isDragAccept,
    } = useDropzone({
      onDrop: handleDrop,
      multiple: false,
      disabled: disabled,
    });

    return (
      <>
        <div className={clsx(classes.root, className, {
          [classes.square]: square,
          [classes.left]: align === "left",
          [classes.isDragReject]: isDragReject || !!errorMessage
        })} {...other}>
          <div
            className={clsx(classes.dropZone, {
              [classes.isDragDisabled]: disabled,
              [classes.isDragActive]: isDragActive,
              [classes.isDragAccept]: isDragAccept,
              [classes.dropZoneSquare]: square,

            })}
            {...getRootProps()}
          >
            <input {...getInputProps()} id="upload" />
            {isLoading && (
              <Box className={classes.loading}>
                <CircularProgress size={32} thickness={2.4} />
              </Box>
            )}
            {fileReview && (
              <img alt="upload" src={fileReview} className={classes.imgFile} referrerPolicy='no-referrer' />
            )}
            <div
              className={clsx(classes.placeholder, { [classes.hover]: fileReview })}
            >
              <AddAPhotoIcon className={classes.iconAdd} />
              <Typography variant="caption">
                {fileReview ? 'Update photo' : 'Upload photo'}
              </Typography>
            </div>
          </div>
        </div>
        <Typography variant="caption" align={align} className={classes.caption}>
          {caption ? (
            caption
          ) : (
            <>
              Allowed *.jpeg, *.jpg, *.png
              <br /> Max size of 10MB
            </>
          )}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: align === "left" ? "flex-start" : 'center' }}></Box>
      </>
    );
  }
);

export default UploadImage;
