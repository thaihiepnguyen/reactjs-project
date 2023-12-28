import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Dialog, FormControl, Grid, Stack } from "@mui/material";
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

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  score: any;
  onSendRequest: () => void;
}

interface DataForm {
  score: number;
  message: string;
  isFinal: boolean;
}

const PopupReviewScore = memo((props: Props) => {
  const { user } = useAppSelector((state) => state.userReducer);
  const { isOpen, onCancel, score, onSendRequest } = props;
  const dispatch = useAppDispatch();
  const messageListReferance = React.createRef();
  const [messageList, setMessageList] = useState<MessageType[]>([]);

  const schema = useMemo(() => {
    return yup.object().shape({
      score: yup.number().typeError("Please type new score").min(0, "Score must be more than or equal 0").max(10, "Score must be less than or equal 10").required("Please type new score"),
      message: yup.string().required(),
      isFinal: yup.boolean().notRequired(),
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
          title: user?.id === message.from ? "You" : "Student",
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

    reset({
      isFinal: !!score?.isFinal,
    });
  }, [score]);

  const onSubmit = (data: DataForm) => {
    console.log(data);
    dispatch(setLoading(true));
    axiosInstance
      .post(`/score/accept-request-review/${score?.score?.id}`, data)
      .then((response) => {
        Swal.fire({
          title: "Success",
          text: "Score has been updated successfully",
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

  console.log(errors);
  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <Heading4 $colorName="#333">Grading Review</Heading4>
        </Box>
        <ButtonCLose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <Heading4 sx={{ mt: "8px !important" }}>
          Grade name: <b>{score?.score?.grade?.name}</b>
        </Heading4>
        <Heading4 sx={{ mt: "8px !important" }}>
          Score before review: <b>{score?.score?.score}</b>
        </Heading4>
        <Grid
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          component={"form"}
          className={classes.emailsShareContainer}
        >
          <Box sx={{ width: "100%" }}>
            <Stack direction={"row"} spacing={0.5} alignItems={"center"} sx={{ mt: "8px !important", mb: "8px" }}>
              <ParagraphSmall sx={{mr: "16px !important"}}>New Score:</ParagraphSmall>
              <InputSearch
                width={"150px"}
                className={classes.searchInput}
                sx={{ px: 1 }}
                placeholder={"New score"}
                type={"number"}
                inputRef={register('score')}
                disabled={score.isFinal || score.acceptNewRequest}
                inputProps={{
                  min: 0,
                  max: 10,
                }}
              />
            {errors.score && <ErrorMessage>{errors.score.message}</ErrorMessage>}

            </Stack>
            <InputSearch
              multiline={true}
              placeholder="Feedback"
              disabled={score.isFinal || score.acceptNewRequest}
              width="100%"
              className={classes.searchInput}
              sx={{ padding: "8px 16px !important" }}
              inputRef={register("message")}
            />
            {errors.message && <ErrorMessage>Please type your feedback to review</ErrorMessage>}
           

            <Controller
              control={control}
              name="isFinal"
              defaultValue={false}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Stack direction={"row"} spacing={0.5} alignItems={"center"} sx={{ mt: "8px !important" }} justifyContent={"right"}>
                  <ParagraphSmall>Mark as final</ParagraphSmall>
                  <Switch onChange={onChange} onBlur={onBlur} value={value} disabled={score.isFinal || score.acceptNewRequest} color="primary" />
                </Stack>
              )}
            />

            {score.isFinal ? (
              <ParagraphSmall sx={{ mt: "8px !important" }}>
                You mark this request is final. It become readonly
              </ParagraphSmall>
            ) : null}

            {!score.isFinal && score.acceptNewRequest ? (
              <ParagraphSmall sx={{ mt: "8px !important" }}>
                You have already response this request. Please wait until student raise a new request.
              </ParagraphSmall>
            ) : null}

            {!score.isFinal && !score.acceptNewRequest ? (
              <Button
                type="submit"
                btnType={BtnType.Primary}
                className={classes.sendInviteBtn}
                disabled={!isValid}
                translation-key="project_share_send_invite"
              >
                <ParagraphSmall>Update change</ParagraphSmall>
              </Button>
            ) : null}
          </Box>
        </Grid>
        <Heading4 sx={{fontWeight: "bold !important"}}>Reponse history:</Heading4>
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

export default PopupReviewScore;
