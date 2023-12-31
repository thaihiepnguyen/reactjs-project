import MaterialTable from "material-table";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { tableIcons } from "../TableIcon";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import axiosInstance from "@/app/routers/axios";
import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import PopupRequestReviewScore from "../PopupRequestReviewScore";
interface Props {
  courseId: number | string;
}

const StudentGradeTable = memo(({ courseId }: Props) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [requestScore, setRequestScore] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const { user } = useAppSelector((state) => state.userReducer);

  const missingStudentId = useMemo(() => !user?.studentId, [user]);

  const fetchData = useCallback(
    (courseId: number | string) => {
      setTableLoading(true);
      axiosInstance
        .get(`/score/my-score/${courseId}`)
        .then((response) => {
          if (response?.data?.scoreData?.length) {
            setData(response?.data?.scoreData);
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
    const titles = ["Grade Item", "Score", "Contribution to course total"];
    setColumns(
      titles?.map((col) => ({
        title: col,
        field: col,
        editable: "never",
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
          rowStyle: rowData => {
            return {
              backgroundColor: (rowData["Grade Item"] === "Total Score") ? '#EEE' : '#FFF',
              fontWeight: (rowData["Grade Item"] === "Total Score") ? "bold" : 400,
            }
          }
        }}
        localization={{
          body: {
            emptyDataSourceMessage: missingStudentId
              ? t(
                  "It looks like you don't have a student ID number yet. Please configure your student ID in your profile to see your scores"
                )
              : t("No records to display"),
          },
        }}
        actions={[
          (rowData: any) => {
            console.log(rowData)
            return {
              icon: () => <MapsUgcOutlinedIcon sx={{ color: "#333" }} />,
              tooltip: "Request a review",
              onClick: (event, rowData) => {
                setRequestScore(rowData);
              },
              hidden: rowData?.disableReview ?? true,
            };
          },
        ]}
      ></MaterialTable>
      {!!requestScore && (
        <PopupRequestReviewScore
          isOpen={!!requestScore}
          onCancel={onCloseRequesModal}
          score={requestScore}
          onSendRequest={onSendRequest}
          courseId={courseId}
        />
      )}
    </div>
  );
})

export default StudentGradeTable;
