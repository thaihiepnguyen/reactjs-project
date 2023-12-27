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
import InputSearch from "../input/InputSearch";

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  scoreId: string;
}

interface DataForm {
  reason: string;
}

const PopupRequestReviewScore = memo((props: Props) => {
  const { isOpen, onCancel, scoreId } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      reason: yup.string(),
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

  const onSubmit = (data: DataForm) => {
    
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
        <Heading4 sx={{ mt: "8px !important" }}>Grade name: </Heading4>
        <Heading4 sx={{ mt: "8px !important" }}>Score before review: </Heading4>
        <Grid
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          component={"form"}
          className={classes.emailsShareContainer}
        >
          <InputSearch multiline={true} placeholder="Reason" width="100%" className={classes.searchInput} sx={{padding: '8px 16px !important'}} inputRef={register('reason')}/>
        </Grid>

        <Button
          type="submit"
          btnType={BtnType.Primary}
          className={classes.sendInviteBtn}
          disabled={!isValid}
          translation-key="project_share_send_invite"
        >
          <ParagraphSmall>Send review request</ParagraphSmall>
        </Button>
        {(errors.reason) && <ErrorMessage>Please type your reason to review</ErrorMessage>}
      </DialogContentConfirm>
    </Dialog>
  );
});

export default PopupRequestReviewScore;
