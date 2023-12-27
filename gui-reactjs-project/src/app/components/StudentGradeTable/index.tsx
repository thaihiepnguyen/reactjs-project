import MaterialTable from "material-table";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { tableIcons } from "../TableIcon";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import axiosInstance from "@/app/routers/axios";
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import PopupRequestReviewScore from "../PopupRequestReviewScore";
interface Props {
  courseId: number | string;
}

const StudentGradeTable = ({ courseId }: Props) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [requestScore, setRequestScore] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const { user } = useAppSelector((state) => state.userReducer);

  const missingStudentId = useMemo(() => !user?.studentId, [user]);

  useEffect(() => {
    const titles = ["Grade Item", "Score", "Contribution to course total"];
    setColumns(
      titles?.map((col) => ({
        title: col,
        field: col,
        editable: "never",
      }))
    );

    axiosInstance.get(`/score/my-score/${courseId}`)
    .then((response) => {
      if (response?.data?.scoreData?.length) {
        setData(response?.data?.scoreData)
      }
    })
    .catch((error) => {

    })
    
  }, [courseId]);

  const onCloseRequesModal = () => {
    setRequestScore(null);
  }
  return (
    <div className={classes.rootTable}>
      <MaterialTable
        title={t("Your score")}
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
          draggable: false
        }}
        localization={{
          body: {
            emptyDataSourceMessage: missingStudentId
              ? "It looks like you don't have a student ID number yet. Please configure your student ID in your profile to see your scores"
              : "No records to display2",
          },
        }}
        actions={[(rowData: any) => {
          return {
            icon: () => (<MapsUgcOutlinedIcon sx={{color: "#333"}}/>),
            tooltip: 'Request a review',
            onClick: (event, rowData) => {
              console.log(rowData);
              setRequestScore(rowData.id);
            },
            hidden: rowData?.disableReview ?? true,
          }
        }]}
       
      ></MaterialTable>
      {!!requestScore && <PopupRequestReviewScore isOpen={!!requestScore} onCancel={onCloseRequesModal} scoreId={requestScore} />}
    </div>
  );
};

export default StudentGradeTable;
