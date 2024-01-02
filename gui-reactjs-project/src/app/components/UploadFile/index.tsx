import clsx from "clsx";
import { useDropzone } from "react-dropzone";
import { memo, useCallback, useMemo, useState } from "react";
import { Box, Typography, CircularProgress, Paper, IconButton, Tooltip } from "@mui/material";
import { Delete, FileUpload as FileUploadIcon } from "@mui/icons-material";
import classes from "./styles.module.scss";
import ErrorMessage from "../text/ErrorMessage";

const FILE_SIZE = 10 * 1000000; // bytes
const FILE_FORMATS = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];

export interface FileUpload {
  id?: number | string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
  file: File;
  isNew?: boolean;
}

interface UploadFileProps {
  disabled?: boolean;
  caption?: string;
  errorMessage?: string;
  typeInvalidMess?: string;
  value?: FileUpload | FileUpload[];
  onChange?: (value?: FileUpload | FileUpload[]) => void;
  className?: string;
  fileSize?: number;
  multiple?: boolean;
  fileFormats?: string[];
}

const UploadFile = memo(
  ({
    disabled,
    caption,
    typeInvalidMess,
    errorMessage,
    value,
    onChange,
    className,
    fileSize = FILE_SIZE,
    fileFormats = FILE_FORMATS,
    multiple,
    ...other
  }: UploadFileProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState<string>("");

    const files = useMemo(() => {
      if (multiple) return (value || []) as FileUpload[];
      else return (value ? [value] : []) as FileUpload[];
    }, [value]);

    const convertFile = (file: File): FileUpload => {
      return {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        file: file,
        isNew: true,
      };
    };

    const getImage = (file: FileUpload) => {
      const extension = file.fileName.split(".").length > 1 ? file.fileName.split(".").pop() : null;
      switch (extension) {
        case "xls":
        case "xlsx":
          return (
            <img
              alt="upload"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png"
              className={classes.imgFile}
            />
          );
      }
    };

    const handleDrop = useCallback(
      async (acceptedFiles: File[]) => {
        setIsError("");
        let hasError = false;
        for (const file of acceptedFiles) {
          if (file.size > fileSize) {
            setIsError("size-invalid");
            hasError = true;
            break;
          }
          if (!fileFormats.includes(file.type)) {
            setIsError("type-invalid");
            hasError = true;
            break;
          }
        }
        if (hasError || !acceptedFiles?.length) return;
        setIsLoading(true);
        if (multiple) {
          onChange && onChange([...(value as FileUpload[]), ...acceptedFiles.map((it) => convertFile(it))]);
        } else {
          onChange && onChange(convertFile(acceptedFiles[0]));
        }
        setIsLoading(false);
        let file = acceptedFiles[0];
        const checkSize = file.size < fileSize;
        const checkType = fileFormats.includes(file.type);
        if (!checkSize) {
          setIsError("size-invalid");
          return;
        }
        if (!checkType) {
          setIsError("type-invalid");
          return;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange]
    );

    const onDelete = (file: FileUpload) => {
      if (multiple) {
        const files = [...(value as FileUpload[])].filter((it) => it.id !== file.id);
        onChange && onChange(files);
      } else onChange && onChange();
    };

    const { getRootProps, getInputProps, isDragReject } = useDropzone({
      onDrop: handleDrop,
      multiple: multiple,
      disabled: disabled,
    });

    return (
      <>
        <div
          className={clsx(classes.root, className, {
            [classes.isDragReject]: isDragReject || !!errorMessage,
          })}
          {...other}
        >
          <div className={clsx(classes.dropZone, { [classes.isDragDisabled]: disabled })} {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={classes.content}>
              <div className={classes.preview}>
                {files.map((it, index) => {
                  return (
                    <Paper key={index} className={classes.previewItem} onClick={(e) => e.stopPropagation()}>
                      <div className={classes.boxImgFile}>{getImage(it)}</div>
                      <Tooltip title={it.fileName}>
                        <Typography className={classes.fileName} component={"div"} variant="caption">
                          {it.fileName}
                        </Typography>
                      </Tooltip>
                      <IconButton
                        onClick={() => onDelete(it)}
                        className={classes.deleteFile}
                        aria-label="delete"
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Paper>
                  );
                })}
              </div>
              <div className={classes.placeholder}>
                <FileUploadIcon />
                <Typography variant="caption">Upload file</Typography>
                <Typography variant="caption">{caption || "Allowed ppt, pptx, doc, docx, xls, xlsx, pdf"}</Typography>
                <Typography variant="caption">Max size of 10MB</Typography>
              </div>
            </div>
            {isLoading && (
              <Box className={classes.loading}>
                <CircularProgress size={32} thickness={2.4} />
              </Box>
            )}
          </div>
        </div>
        {isError === "size-invalid" && (
          <Box display={"flex"} justifyContent="center">
            <ErrorMessage>{`File is larger than 10MB`}</ErrorMessage>
          </Box>
        )}
        {isError === "type-invalid" && (
          <Box display={"flex"} justifyContent="center">
            <ErrorMessage>{typeInvalidMess || "File type must be ppt, pptx, doc, docx, xls, xlsx, pdf"}</ErrorMessage>
          </Box>
        )}
        {errorMessage && (
          <Box display={"flex"} justifyContent="center">
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </Box>
        )}
      </>
    );
  }
);

export default UploadFile;
