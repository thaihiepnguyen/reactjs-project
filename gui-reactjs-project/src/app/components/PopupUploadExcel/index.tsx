import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Dialog, DialogActions, FormControl, Grid, Stack } from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import classes from "./styles.module.scss";
import { DialogTitleConfirm } from "../dialogs/DialogTitle";
import Heading4 from "../text/Heading4";
import ButtonCLose from "../buttons/ButtonClose";
import { DialogContentConfirm } from "../dialogs/DialogContent";
import InputTag from "../InputTag";
import ParagraphSmall from "../text/ParagraphSmall";
import Button, { BtnType } from "../buttons/Button";
import ErrorMessage from "../text/ErrorMessage";
import axiosInstance from "@/app/routers/axios";
import InputSearch from "../input/InputSearch";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import Swal from "sweetalert2";
import "react-chat-elements/dist/main.css";
import { MessageList, MessageType } from "react-chat-elements";
import { Switch } from "@material-ui/core";
import moment from "moment";
import UploadFile, { FileUpload } from "../UploadFile";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  title: string;
  onUpload: (dataform: FormData) => void;
  name: string;
}

export interface UploadFormData {
  file: FileUpload;
}

const PopupUploadExcel = memo((props: Props) => {
  // const { user } = useAppSelector((state) => state.userReducer);
  const { isOpen, onCancel, title, onUpload, name } = props;
  // const dispatch = useAppDispatch();
  // const messageListReferance = React.createRef();
  // const [messageList, setMessageList] = useState<MessageType[]>([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      file: yup.mixed().required("File is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UploadFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // useEffect(() => {
  //   if (score?.messages?.length) {
  //     setMessageList(
  //       score?.messages?.map((message: any, index: number) => ({
  //         id: index,
  //         position: user?.id === message.from ? "right" : "left",
  //         type: "text",
  //         text: message.message,
  //         title: user?.id === message.from ? "You" : "Student",
  //         date: moment(message.createdAt).add(7, "hours").toDate(),
  //         notch: true,
  //         focus: false,
  //         titleColor: "black",
  //         forwarded: false,
  //         replyButton: false,
  //         removeButton: false,
  //         status: "waiting",
  //         retracted: false,
  //       }))
  //     );
  //   }

  //   reset({
  //     isFinal: !!score?.isFinal,
  //   });
  // }, [score]);

  const onSubmit = (data: UploadFormData) => {
    const formData = new FormData();
    formData.append(name, data.file.file)
    onUpload(formData)
    onCancel();
  };

  // console.log(errors);
  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogTitleConfirm className={classes.dialogTitle}>
          <Box display="flex" alignItems="center">
            <Heading4 $colorName="#333">{title}</Heading4>
          </Box>
          <ButtonCLose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
        </DialogTitleConfirm>
        <DialogContentConfirm dividers>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <UploadFile
                className={classes.uploadWrapper}
                value={field.value}
                caption="Allowed excel"
                typeInvalidMess="File type must be excel"
                errorMessage={(errors.file as any)?.message}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </DialogContentConfirm>
        <DialogActions sx={{ p: "8px 24px 24px 0" }}>
          <Button className={classes.buttonCancel} onClick={onCancel}>
            Cancel
          </Button>
          <Button className={classes.buttonConfirm} type="submit" variant="contained" autoFocus>
            Upload
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default PopupUploadExcel;
