import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Dialog, Grid } from "@mui/material";
import { memo, useMemo } from "react";
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
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import Swal from "sweetalert2";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  courseId: string;
}

interface DataForm {
  emails: string[];
  email: string;
}

const PopupInviteCourse = memo((props: Props) => {
  const { isOpen, onCancel, courseId } = props;
  const dispatch = useAppDispatch();
  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup.string().notRequired(),
      emails: yup.array(yup.string().email()).when("email", {
        is: (val: string) => yup.string().email().required().isValidSync(val),
        then: (schema) => schema.min(0).notRequired(),
        otherwise: (schema) => schema.min(1).required(),
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: DataForm) => {
    let listEmail: string[] = [];
    if (data?.emails?.length) {
      listEmail = [...data?.emails]
    }
    if (data.email) listEmail.push(data.email);
    dispatch(setLoading(true));
    axiosInstance
      .post("/courses/invite", {
        emails: listEmail,
        courseId: courseId
      })
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Send invitation email successfully!",
          icon: "success",
        })
        onCancel();
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(setLoading(false));
    
  };

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <Heading4 $colorName="#333">Invite to course</Heading4>
        </Box>
        <ButtonCLose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <Grid
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          component={"form"}
          className={classes.emailsShareContainer}
        >
          <Box className={classes.tagInputContainer}>
            <InputTag
              className={classes.inputTag}
              control={control}
              name="emails"
              nameText="email"
              placeholder={"Enter email address"}
            />
          </Box>
          <Button
            type="submit"
            btnType={BtnType.Primary}
            className={classes.sendInviteBtn}
            disabled={!isValid}
            translation-key="project_share_send_invite"
          >
            <ParagraphSmall $colorName="--white">Invite</ParagraphSmall>
          </Button>
        </Grid>
        {(errors.emails || errors.email) && <ErrorMessage>One or some of your emails are invalid</ErrorMessage>}
      </DialogContentConfirm>
    </Dialog>
  );
});

export default PopupInviteCourse;
