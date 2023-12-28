import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Dialog, Grid } from "@mui/material";
import React, { memo, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
import moment from "moment";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  score: any;
  onSendRequest: () => void;
  courseId: number
}

interface DataForm {
  message: string;
}

const PopupRequestReviewScore = memo((props: Props) => {
  const { user } = useAppSelector((state) => state.userReducer);
  const { isOpen, onCancel, score, onSendRequest, courseId } = props;
  const dispatch = useAppDispatch();
  const messageListReferance = React.createRef();
  const [messageList, setMessageList] = useState<MessageType[]>([]);
  const schema = useMemo(() => {
    return yup.object().shape({
      message: yup.string().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (score?.messages?.length) {
      setMessageList(
        score?.messages?.map((message: any, index: number) => ({
          id: index,
          position: user?.id === message.from ? "right" : "left",
          type: "text",
          text: message.message,
          title: user?.id === message.from ? "You" : "Teacher",
          date: moment(message.createdAt).add(7, "hours").toDate(),
          notch: true,
          focus: false,
          titleColor: "black",
          forwarded: false,
          replyButton: false,
          removeButton: false,
          status: "waiting",
          retracted: false,
        }))
      );
    }
  }, [score]);

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true));
    axiosInstance
      .post(`/score/request-review/${courseId}/${score.id}`, data)
      .then((response) => {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
        });
        onCancel();
        onSendRequest();
      })
      .catch((error) => {
        onCancel();
        Swal.fire({
          title: "Oops",
          text: "There was an error",
          icon: "error",
        });
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <Heading4 $colorName="#333">Request An Review</Heading4>
        </Box>
        <ButtonCLose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <Heading4 sx={{ mt: "8px !important" }}>
          Grade name: <b>{score["Grade Item"]}</b>
        </Heading4>
        <Heading4 sx={{ mt: "8px !important" }}>
          Score before review: <b>{score["Score"]}</b>
        </Heading4>
        <Grid
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          component={"form"}
          className={classes.emailsShareContainer}
        >
          <Box sx={{ width: "100%" }}>
            <InputSearch
              multiline={true}
              placeholder="Reason"
              disabled={!score.acceptSendRequest}
              width="100%"
              className={classes.searchInput}
              sx={{ padding: "8px 16px !important" }}
              inputRef={register("message")}
            />
            {errors.message && <ErrorMessage>Please type your reason to review</ErrorMessage>}

            {!score.acceptSendRequest && !score.disableSendRequest ? (
              <ParagraphSmall sx={{ mt: "8px !important" }}>
                Please wait for the instructor to respond to your previous request
              </ParagraphSmall>
            ) : null}

            {score.disableSendRequest ? (
              <ParagraphSmall sx={{ mt: "8px !important" }}>
                This request marked as final. This is become readonly
              </ParagraphSmall>
            ) : null}

            {score.acceptSendRequest && !score.disableSendRequest ? (
              <Button
                type="submit"
                btnType={BtnType.Primary}
                className={classes.sendInviteBtn}
                disabled={!isValid}
                translation-key="project_share_send_invite"
              >
                <ParagraphSmall>Send review request</ParagraphSmall>
              </Button>
            ) : null}
          </Box>
        </Grid>
        <Heading4 sx={{fontWeight: "bold !important"}}>Request history:</Heading4>
        <MessageList
          className={classes.messageList}
          referance={messageListReferance}
          lockable={true}
          dataSource={messageList}
        ></MessageList>
      </DialogContentConfirm>
    </Dialog>
  );
});

export default PopupRequestReviewScore;
