import { Tooltip } from "@mui/material";
import moment from "moment";

export const columnsForSignUp = {
  'signUp' : [
    { field: 'id', 
    headerName: 'S.NO', 
    width: 150, 
    sortable: false, 
    align: 'center',
    headerAlign: 'center',

  },
  {
    field: 'companyName',
    headerName: 'Company Name',
    width: 200,
    sortable: false
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 200,
    sortable: false,
    valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY")
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    sortable: false
  },

],
  'login': [
    {
      field: 'id',
      headerName: 'S.NO',
      width: 100,
      sortable: false,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      width: 200,
      sortable: false
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      sortable: false,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY")

    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
      sortable: false
    },
    {
      field: 'isSearched',
      headerName: 'Searched',
      sortable: false,
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value ? 'Yes': 'No'
    },
    {
      field: 'isDownloaded',
      headerName: 'Downloaded',
      sortable: false,
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value ? 'Yes' : 'No'
    },
    {
      field: 'isRecruited',
      headerName: 'Recruited',
      sortable: false,
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value ? 'Yes' : 'No'
    }
  ],
  "search":[
    {
      field: 'id',
      headerName: 'S.NO',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      width: 200,
      sortable: false
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      sortable: true,
      type: 'dateTime',
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
      
    },
    {
      field: 'advanceSearchDto.averageMark',
      headerName: 'average mark',
      width: 160,
      sortable: false,
      valueGetter: (params) => params.row.advanceSearchDto?.averageMark ? params.row.advanceSearchDto?.averageMark : '-'
    },

    {
      field: 'advanceSearchDto.technology',
      headerName: 'technology',
      width: 160,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.advanceSearchDto?.technology ? params.row.advanceSearchDto?.technology: '-'
    },
    {
      field: 'advanceSearchDto.ug',
      headerName: 'ug %',
      width: 160,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.advanceSearchDto?.ug ? params.row.advanceSearchDto?.ug : '-' 
    },
    {
      field: 'advanceSearchDto.hsc',
      headerName: 'hsc %',
      width: 160,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => params.row.advanceSearchDto?.hsc ? params.row.advanceSearchDto?.hsc: '-' 
    },
  ],
  "download": [
    {
      field: 'id',
      headerName: 'S.NO',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      width: 200,
      sortable: false
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      sortable: true,
      type: 'dateTime',
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),

    },
    {
      field: 'count',
      headerName: 'count',
      width: 150,
      sortable: false,
    },
    {
      field: 'emails',
      headerName: 'emails',
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title={<i>{params.value?.join()}</i>} arrow>
          <div>{params.value?.join()}</div>
        </Tooltip>
      )
    },
  ], 
  "recruited": [
    {
      field: 'id',
      headerName: 'S.NO',
      width: 150,
      sortable: false,
      align: 'center',
      headerAlign: 'center',

    },
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 0.3,
      sortable: false
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 160,
      sortable: true,
      type: 'dateTime',
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),

    }, {
      field: 'email',
      headerName: 'email',
      width: 250,
      sortable: false,
      valueGetter: (params) => params.row.skillSortUserProfile?.email 
    }, 
    {
      field: 'name',
      headerName: 'name',
      width: 250,
      sortable: false,
      valueGetter: (params) => params.row.skillSortUserProfile?.firstName?.concat(" ")?.concat(params.row.skillSortUserProfile?.lastName)
    },
  ]
}



