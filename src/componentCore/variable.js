import { ExpandLess, ExpandMore } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import ColorizeIcon from "@mui/icons-material/Colorize";
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import ListIcon from '@mui/icons-material/List';
export const navigation = [
  {
    id: 0,
    name: "Dashboard",
    icon: DashboardIcon,
    margin: 0,
    link: "/",
  },
  {
    id: 1,
    role: "codeUpdate",
    name: "Code Update",
    icon: UpgradeIcon,
    margin: 0,
    link: "/code-update",
  },
  {
    id: 2,
    role: "migration",
    name: "Migration",
    icon: SwapHorizIcon,
    margin: 0,
    link: "/migration",
    // child: [
    //   {
    //     id: 3,
    //     name: "Test 1",
    //     icon: ExpandLess,
    //     margin: 4
    //   },
    // ],
  },
  {
    id: 4,
    role: "emailTemplate",
    name: "Email Template",
    icon: EmailIcon,
    margin: 0,
    // link: "/email-template",
    child: [
      {
        id: 8,
        role: "getInforCart",
        name: "Xin thông tin",
        icon: InfoIcon,
        margin: 4,
        link: "/get-info-cart",
        
      },
      {
        id: 9,
        role: "listArticle",
        name: "Danh sách Article",
        icon: InfoIcon,
        margin: 4,
        link: "/list-article",
        
      },
      // {
      //   id: 8,
      //   name: "Danh dách mẫu email",
      //   icon: ListIcon,
      //   margin: 4,
      //   link: "/get-info-cart",
        
      // },
    ],
  },
  {
    id: 5,
    role: "processData",
    name: "Xử lí dữ liệu",
    icon: SubtitlesIcon,
    margin: 0,
    // link: "/process-data",
    child: [
      {
        id: 6,
        role: "arrString",
        name: "Convert",
        icon: ColorizeIcon,
        margin: 4,
        link: "/array-string",
      },
      {
        id: 7,
        role: "csvToSql",
        name: "CSV to SQL",
        icon: ColorizeIcon,
        margin: 4,
        link: "/csv-to-sql",
      },
    ],
  },
];
