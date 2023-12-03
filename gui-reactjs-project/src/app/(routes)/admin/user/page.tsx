"use client";
import { Add, DeleteOutlineOutlined, EditOutlined, ExpandMoreOutlined, Check as CheckIcon, FilterAlt, Restore } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Link,
  Avatar,
} from "@mui/material";
import { memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import Inputs from "@/app/components/input/InputTextfield";
import InputSearch from "@/app/components/input/InputSearch";
import { EAdminType, TableHeaderLabel } from "@/models/general";
import TableHeader from "@/app/components/Table/TableHead";
import { User } from "@/models/user";
import AdminService from "@/services/adminService";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import WarningModal from "@/app/components/WarningModal";

const tableHeaders: TableHeaderLabel[] = [
  { name: "id", label: "Id", sortable: true },
  { name: "studentId", label: "Student ID", sortable: true },
  { name: "avatar", label: "Avatar", sortable: true },
  { name: "fullname", label: "Full Name", sortable: true },
  { name: "email", label: "Email", sortable: true },
  { name: "isValid", label: "Blocked", sortable: false },
  { name: "actions", label: "Actions", sortable: false },
];

interface IUserList {
  list: User[];
  currentPage: number;
  totalPage: number;
  totalItem: number;
  size: number;
}

const List = memo(() => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [data, setData] = useState<IUserList | null>(null);
  const [itemDelete, setItemDelete] = useState<User | null>(null);
  const [page, setPage] = useState<number>(1);
  const [itemAction, setItemAction] = useState<User>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const fetchData = (page: number) => {
    dispatch(setLoading(true));
    AdminService.getAllUser(page)
      .then((data) => {
        setData(data?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleAction = (event: React.MouseEvent<HTMLButtonElement>, item: User) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(undefined);
    setActionAnchor(null);
  };

  const handlePageChange = (_: MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage + 1);
  };

  const onCloseConfirm = () => {
    if (!itemDelete) return;
    setItemDelete(null);
    onCloseActionMenu();
  };

  const onDelete = () => {
    console.log(itemDelete);
    if (!itemDelete) return;
    const form = new FormData();
    form.append("id", `${itemDelete.id}`);
    dispatch(setLoading(true));
    AdminService.toggleBlockUser(itemDelete.id)
      .then(() => {
        fetchData(page);
      })
      .finally(() => dispatch(setLoading(false)));
    onCloseConfirm();
  };

  const onShowConfirm = () => {
    if (!itemAction) return;
    setItemDelete(itemAction);
  };

  return (
    <div className={classes.container}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={6}>
          <Typography component="h2" variant="h6" align="left">
            Users
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => router.push("/admin/user/create")}>
              Create
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" m={3}>
              <InputSearch placeholder="Search ..." />
              <Button variant="contained" color="primary" startIcon={<FilterAlt />}>
                Filter
              </Button>
            </Box>
            <Table>
              <TableHeader headers={tableHeaders} />
              <TableBody>
                {data?.list?.map((user, userIndex) => {
                  return (
                    <TableRow hover tabIndex={-1} key={userIndex}>
                      <TableCell>{user?.id ?? "N/A"}</TableCell>
                      <TableCell>{user?.studentId ?? "N/A"}</TableCell>
                      <TableCell>
                        {user.avatarUrl && <Avatar alt={user.fullname} src={user.avatarUrl} imgProps={{ referrerPolicy: "no-referrer" }} />}
                      </TableCell>
                      <TableCell>
                        <Link component="button">{user?.fullname ?? "N/A"}</Link>
                      </TableCell>
                      <TableCell>{user.email ?? "N/A"}</TableCell>
                      <TableCell sx={{ color: "#af1c10", textAlign: "center" }}>{!user.isValid && <CheckIcon />}</TableCell>
                      <TableCell component="th">
                        <IconButton
                          className={clsx(classes.actionButton, {
                            [classes.actionButtonActive]: user.id === itemAction?.id,
                          })}
                          color="primary"
                          onClick={(event) => {
                            handleAction(event, user);
                          }}
                        >
                          <ExpandMoreOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={data?.totalItem || 0}
              rowsPerPage={15}
              rowsPerPageOptions={[5]}
              page={data?.currentPage ? data?.currentPage - 1 : 0}
              onPageChange={handlePageChange}
            />
          </TableContainer>
          {!!actionAnchor ? (
            <Menu
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              anchorEl={actionAnchor}
              keepMounted
              open={Boolean(actionAnchor)}
              onClose={onCloseActionMenu}
            >
              <MenuItem sx={{ fontSize: "0.875rem" }}>
                <Box display="flex" alignItems={"center"}>
                  <EditOutlined sx={{ marginRight: "0.25rem" }} fontSize="small" />
                  <span>Edit</span>
                </Box>
              </MenuItem>
              {itemAction?.roleId != EAdminType.ADMIN ? (
                <MenuItem sx={{ fontSize: "0.875rem" }} onClick={onShowConfirm}>
                  <Box display="flex" alignItems={"center"}>
                    {!!itemAction?.isValid ? (
                      <DeleteOutlineOutlined sx={{ marginRight: "0.25rem" }} color="error" fontSize="small" />
                    ) : (
                      <Restore sx={{ marginRight: "0.25rem" }} fontSize="small" />
                    )}
                    <span>{!!itemAction?.isValid ? "Block" : "Unblock"}</span>
                  </Box>
                </MenuItem>
              ) : null}
            </Menu>
          ) : null}
          <WarningModal title="Confirm" isOpen={!!itemDelete} onClose={onCloseConfirm} onYes={onDelete}>
            Are you sure?
          </WarningModal>
        </Grid>
      </Grid>
    </div>
  );
});

export default List;
