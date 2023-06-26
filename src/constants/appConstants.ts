// Avatar colors for profile
export const avatarColors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#FF9800",
    "#FF5722",
    "#FFB900",
    "#D83B01",
    "#B50E0E",
    "#E81123",
    "#B4009E",
    "#5C2D91",
    "#0078D7",
    "#00B4FF",
    "#008272",
    "#107C10",
    '#B381B3',
    '#939393',
    '#E3BC00'

  ];

// Header Tab Names and paths - Note: change Route names if below is modified
  export const ProfileHeaderTabs = [
      {tabName: "My Profile", path: "details"},
      {tabName: "My Activities", path: "activities"},
      {tabName: "Saved Posts", path: "saved-posts"},
  ]

  // Admin Filter Tab Names and paths - Note: change Route names if below is modified
  export const AdminThreadFilter = [
    {id: 0,tabName: "All Questions", path: "", filter: "", count: 0},
    {id: 1, tabName: "Unanswered Questions", path: "", filter: 'unanswered',count: 0},
    {id: 2, tabName: "Answered Questions", path: "",filter: 'answered',count: 0},
    {id: 3, tabName: "Closed", path:"", filter: 'closed', count:0}
]

  // Threads menu and paths
  export const QuestionsCategory = [
    {
      id: 0,
      name: "All",
      count: 500
  },
  {
      id: 1,
      name: "SWAM Plan",
      count: 120
  },
  {
      id: 2,
      name: "Dashboard Access",
      count: 1
  },
  {
      id: 3,
      name: "Upload of Subcontracting Spend",
      count: 100
  },
  {
      id: 4,
      name: "Upload of Self Reporting Spend, or Adjustments",
      count: 2
  },
  {
      id: 5,
      name: "FAQ",
      count: 1
  }
    ] ;

    export const questionCategoryColors = [
      'warning',
      'primary',
      'success',
      'danger',
      'purple',
      'info'
    ]
  
    export const userRoles =  {
      reportviewer: 'role:reportviewer',
      datamanager: 'role:datamanager',
      sbsdadmin: 'role:sbsdadmin',
      swamdatamanger: 'role:swamdatamanger',
      agencydatamanger: 'role:agencydatamanger',
      agencyowner: 'role:agencyowner',
      swamplanapprover: 'role:swamplanapprover',
      agencydatamanagerandswamplanadministrator: 'role:agencydatamanagerandswamplanadministrator',
      swamplanadministratorandapprover: 'role:swamplanadministratorandapprover',
      agencyownerandswamplanadministrator: 'role:agencyownerandswamplanadministrator',
      agencyownerandswam: 'role:agencyownerandswam',
      sbsdoutreach: 'role:sbsdoutreach'
  }

export const AdminQuestionFilter = {
  ALL: 0,
  ANSWERED: 1,
  UNANSWERED: 2
}

export const FilterTabTypes = {
  DEFAULT: 'default',
  FAQS: 'faqs',
  QUESTIONSTATUS: 'status'
}

//Faq
export const FAQCATEGORY = "5";
export const FAQCATEGORYID = "0";
