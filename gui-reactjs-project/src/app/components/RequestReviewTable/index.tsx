import MaterialTable from "material-table";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { tableIcons } from "../TableIcon";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import axiosInstance from "@/app/routers/axios";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import PopupRequestReviewScore from "../PopupRequestReviewScore";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PopupReviewScore from "../PopupReviewScore";
import moment from "moment";
interface Props {
  courseId: number | string;
}


const RequestReviewTable = memo(({ courseId }: Props) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [requestScore, setRequestScore] = useState<any>(null);
  const [data, setData] = useState<any>([]);

  const fetchData = useCallback(
    (courseId: number | string) => {
      setTableLoading(true);
      axiosInstance
        .get(`/score/request-review/${courseId}`)
        .then((response) => {
          if (response?.data?.data?.length) {
            setData(response?.data?.data);
          }
        })
        .catch((error) => {})
        .finally(() => {
          setTableLoading(false);
        });
    },
    [courseId]
  );

  useEffect(() => {
    const titles = [
      {
        title: "Student ID",
        field: "score.studentId",
      },
      {
        title: "Fullname",
        field: "score.student.fullname",
      },
      {
        title: "Grade Item",
        field: "score.grade.name",
      },
      {
        title: "Score before review",
        field: "score.score",
      },
      {
        title: "Date",
        field: "score.createdAt",

      },
    ];
    setColumns(
      titles?.map((col) => ({
        title: col.title,
        field: col.field,
        editable: "never",
        render: col.title === "Date" ? (rowData: any) => moment(rowData.createdAt).format("DD-MM-YYYY HH:mm") : false,
        customSort: col.title === "Date" ? (a: any, b: any) => {
          return moment(a.createdAt).diff(moment(b.createdAt), "minutes")
        } : false,
      }))
    );
    fetchData(courseId);
  }, [courseId]);

  const onCloseRequesModal = () => {
    setRequestScore(null);
  };

  const onSendRequest = () => {
    fetchData(courseId);
  };

  return (
    <div className={classes.rootTable}>
      <MaterialTable
        title={t("Your score")}
        isLoading={tableLoading}
        icons={tableIcons}
        columns={columns}
        data={data}
        options={{
          actionsColumnIndex: -1,
          pageSize: 20,
          pageSizeOptions: [20, 30, 50],
          exportButton: true,
          headerStyle: {
            backgroundColor: "var(--gray-10)",
          },
          draggable: false,
        }}
        actions={[
          (rowData: any) => {
            return {
              icon: () => <RateReviewOutlinedIcon sx={{ color: "#333" }} />,
              tooltip: "View Detail",
              onClick: (event, rowData) => {
                console.log(rowData);
                setRequestScore(rowData);
              },
            };
          },
        ]}
      ></MaterialTable>
      {!!requestScore && (
        <PopupReviewScore
          isOpen={!!requestScore}
          onCancel={onCloseRequesModal}
          score={requestScore}
          onSendRequest={onSendRequest}
        />
      )}
    </div>
  );
});

export default RequestReviewTable;