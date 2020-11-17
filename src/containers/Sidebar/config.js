export const sidebarMenu = [
  {
    key: 'Dashboard',
    heading: 'Bảng điều khiển',
    icon: 'fa fa-home-alt',
    route: '/dashboard',
  },
  {
    key: 'Drones',
    heading: 'Điều khiển drone',
    icon: 'fas fa-drone-alt',
    route: '/drones',
    subMenu: [
      {
        key: 'DroneState',
        heading: 'Tình trạng drone',
        icon: 'fal fa-monitor-heart-rate',
        route: '/drone-state',
      },
      {
        key: 'FlySetting',
        heading: 'Thiết lập đường bay',
        icon: 'fa fa-user-chart',
        route: '/fly-setting',
      },
      {
        key: 'DroneStatistic',
        heading: 'Thống kê drone',
        icon: 'fa fa-file-chart-line',
        route: '/drone-statistic',
      },
    ],
  },
  {
    key: 'FlightHub',
    heading: 'Flight hub',
    icon: 'fab fa-hubspot',
    route: '/flight-hub',
  },
  {
    key: 'Payloads',
    heading: 'Payloads',
    icon: 'fas fa-layer-group',
    route: '/payloads',
  },
  {
    key: 'metadata',
    heading: 'Hình ảnh và video',
    icon: 'fas fa-images',
    route: '/metadata',
  },
  {
    key: 'Problems',
    heading: 'Sự cố',
    icon: 'fas fa-times-octagon',
    route: '/problems',
  },
  {
    key: 'SupervisedObject',
    heading: 'Đối tượng giám sát',
    icon: 'fas fa-binoculars',
    route: '/supervised-object',
  },
  {
    key: 'GeneralStatistic',
    heading: 'Báo cáo thống kê',
    icon: 'fas fa-chart-line',
    route: '/statistic',
  },
  {
    key: 'Warning',
    heading: 'Cảnh báo',
    icon: 'far fa-bell',
    route: '/warning',
  },
  {
    key: 'ActivityLog',
    heading: 'Lịch sử hoạt động',
    icon: 'fas fa-file-signature',
    route: '/activity-log',
  },
  {
    key: 'SurveillanceDomain',
    heading: 'Miền giám sát',
    icon: 'fas fa-crop-alt',
    route: '/surveillance-domain',
    subMenu: [
      {
        key: 'SurveillanceDomainArea',
        heading: 'Quản lý khu vực',
        icon: 'fas fa-crop-alt',
        route: '/surveillance-domain-area',
      },
      {
        key: 'SurveillanceDomainManage',
        heading: 'Quản lý miền giám sát',
        icon: 'fas fa-crop-alt',
        route: '/surveillance-domain-manage',
      },
    ],
  },
  {
    key: 'HandleProblem',
    heading: 'Xử lý sự cố',
    icon: 'fas fa-toolbox',
    route: '/handle-problem',
  },
  {
    key: 'UserManagement',
    heading: 'Quản lý người dùng',
    icon: 'fas fa-user-circle',
    route: '/user-management',
  },
];
