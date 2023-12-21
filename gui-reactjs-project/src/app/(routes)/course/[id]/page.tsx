"use client";
import React, { useEffect, useState } from "react";
import classes from "./styles.module.scss";
import MenuListComposition from "@/app/components/MenuListComposition/page";
import { Avatar, Button, ClickAwayListener, Divider, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import CreateNotificationForm from "@/app/components/CreateNotificationForm/page";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axiosInstance from "@/app/routers/axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Heading3 from "@/app/components/text/Heading3";
import ParagraphSmall from "@/app/components/text/ParagraphSmall";
import Heading4 from "@/app/components/text/Heading4";
import { User } from "@/models/user";
import { MoreHoriz, PeopleAltOutlined } from "@mui/icons-material";
import PopupInviteCourse from "@/app/components/PopupInviteCourse";
import GradeManagementTable from "@/app/components/GradeManagementTable";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Page({ params }: { params: { id: string } }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.userReducer);
  const [value, setValue] = React.useState(0);
  const [showTable, setShowTable] = useState(false);
  const [course, setCourse] = useState<any>({});
  const [openMenuShare, setOpenMenuShare] = React.useState(false);
  const [isOpenModalShare, setIsOpenModalShare] = useState<boolean>(false);

  const anchorRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function getCourseDetail(id: string) {
      dispatch(setLoading(true));
      axiosInstance
        .get(`/courses/user/my-courses/detail/${id}`)
        .then((response) => {
          setCourse(response.data.data);
        })
        .catch((err) => {
          Swal.fire({
            title: err.response.data.message,
            icon: "error",
          }).then(() => {
            router.back();
          });
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }

    getCourseDetail(params.id);
  }, []);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const handleClickCreationDiv = () => {
    setShowTable(!showTable);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleToggle = () => {
    setOpenMenuShare((prevOpen) => !prevOpen);
  };

  const handleCloseMenuShare = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenuShare(false);
  };

  const onShowModalShare = () => {
    setIsOpenModalShare(true);
  };

  const onCloseShowModalShareProject = () => {
    setIsOpenModalShare(false);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.menu} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Dashboard" {...a11yProps(0)} />
          <Tab label="Classmate" {...a11yProps(1)} />
          <Tab label="Grade Composition" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <div className={classes.container}>
        <CustomTabPanel value={value} index={0}>
          <div className={classes.titleContainer}>
            <img
              className={classes.backgroundImgContainer}
              aria-hidden="true"
              src="https://gstatic.com/classroom/themes/img_learnlanguage.jpg"
              data-iml="5098.800000011921"
            />
            <div className={classes.titleCourse}>
              <h1>{course.title}</h1>
              <p>{course.description}</p>
            </div>
          </div>
          <br />
          <br />
          <div className={classes.mainContainer}>
            <div className={classes.leftSection}>
              <div className={classes.codeCourse}>
                <div className={classes.boxClassCourseTitle}>
                  <h3>Class Code</h3>
                  <MenuListComposition />
                </div>
                <br />
                <h4 className={classes.code}>{course.classCode}</h4>
              </div>
              <br />
              <div className={classes.deadline}>
                <h3>Deadline</h3>
                <br />
                <p style={{ color: "rgba(0,0,0,.549)" }}>There is no deadline</p>
                <br />
                <Button variant="text">View excercises</Button>
              </div>
            </div>
            <div className={classes.rightSection}>
              {!showTable && (
                <div className={classes.createNotificationDiv} onClick={handleClickCreationDiv}>
                  <p>Create notification for the class</p>
                  <AddCircleOutlineIcon />
                </div>
              )}
              {showTable && <CreateNotificationForm onHideForm={handleClickCreationDiv} id={params.id} />}
            </div>
          </div>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          {user?.role?.name === "teacher" ? (
            <IconButton className={classes.iconMore} onClick={handleToggle} ref={anchorRef}>
              <MoreHoriz />
            </IconButton>
          ) : null}
          <div className={classes.list}>
            <Divider>
              <Heading3>Teachers</Heading3>
            </Divider>
            {course?.teacherList?.map((teacher: User, teacherIdx: number) => (
              <div className={classes.infoWrapper} key={teacherIdx}>
                <div className={classes.personalImage}>
                  <Avatar>{teacher?.avatarUrl ? <img src={teacher.avatarUrl} alt=""></img> : "T"}</Avatar>
                </div>
                <div className={classes.personalInfo}>
                  <Heading4 $colorName="--eerie-black" className={classes.name}>
                    {teacher?.id === user?.id ? "You" : teacher?.fullname}
                  </Heading4>
                  <ParagraphSmall>{teacher?.email}</ParagraphSmall>
                </div>
              </div>
            ))}
          </div>
          <Box className={classes.list} sx={{ mt: 4 }}>
            <Divider>
              <Heading3>Students</Heading3>
            </Divider>
            {course?.studentList?.map((student: User, studentIdx: number) => (
              <div className={classes.infoWrapper} key={studentIdx}>
                <div className={classes.personalImage}>
                  <Avatar>{student?.avatarUrl ? <img src={student.avatarUrl} alt=""></img> : "T"}</Avatar>
                </div>
                <div className={classes.personalInfo}>
                  <Heading4 $colorName="--eerie-black" className={classes.name}>
                    {student?.id === user?.id ? "You" : student?.fullname}
                  </Heading4>
                  <ParagraphSmall>{student?.email}</ParagraphSmall>
                </div>
              </div>
            ))}
          </Box>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>
            <GradeManagementTable courseId={5}/>
        </CustomTabPanel>
      </div>
      <Popper
        open={openMenuShare}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        className={classes.customMenuShare}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenuShare}>
                <MenuList autoFocusItem={openMenuShare} id="composition-menu" aria-labelledby="composition-button">
                  <MenuItem onClick={onShowModalShare}>
                    <Box display="flex" alignItems={"center"}>
                      <PeopleAltOutlined sx={{ marginRight: "13.5px" }} />
                      <ParagraphSmall $fontWeight="400" $colorName="--gray-80" translation-key="project_header_menu_share_option">
                        Invite
                      </ParagraphSmall>
                    </Box>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <PopupInviteCourse isOpen={isOpenModalShare} onCancel={onCloseShowModalShareProject} />
    </Box>
  );
}
