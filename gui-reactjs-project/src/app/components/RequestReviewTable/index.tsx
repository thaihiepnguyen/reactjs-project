'use client'
import MaterialTable from "material-table";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { tableIcons } from "../TableIcon";
import { memo, useCallback, useEffect, useState } from "react";
import axiosInstance from "@/app/routers/axios";
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import PopupReviewScore from "../PopupReviewScore";
import moment from "moment";
import SocketService, {MESSAGE_TYPE} from "@/services/socketService";
import { useAppSelector } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
interface Props {
  courseId: number | string;
}


const RequestReviewTable = memo(({ courseId }: Props) => {
  const { t } = useTranslation();
  const [columns, setColumns] = useState<any>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  const [requestScore, setRequestScore] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scoreIdOpen = searchParams.get('scoreId')

  useEffect(() => {
    if (data?.length && scoreIdOpen) {
      const scoreOpen = data?.find((item: any) => +item.scoreId === +scoreIdOpen);
      if (scoreOpen) {
        router.replace(pathname)
        setRequestScore(scoreOpen)
      }
    }
  }, [scoreIdOpen, data])
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
  const socketService = SocketService.instance();
  const { user } = useAppSelector((state) => state.userReducer);
  socketService.listenCourses((message) => {
    if (message.type == MESSAGE_TYPE.REQUEST_REVIEW) {
      if(Object.keys(message.data).length > 0 && Object.keys(message.data)[0].includes('' + user?.id)) {
        setData([Object.values(message.data)[0], ...data]);
      }
    }
  })

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
        title: "Current Score",
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
        render: col.title === "Date" ? (rowData: any) => moment(rowData.createdAt).add(7, "hours").format("DD-MM-YYYY HH:mm") : false,
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
        title={t("Request List")}
        isLoading={tableLoading}
        icons={tableIcons}
        columns={columns}
        data={data}
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [10, 30, 50],
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
          courseId={courseId}
        />
      )}
    </div>
  );
});

export default RequestReviewTable;
