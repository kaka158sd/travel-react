//创建路由实例,绑定path和Element

import AncientTown from '@/pages/AncientTown';
import HumanStoriesPage from '@/pages/AncientTown/HumanStoriesPage';
import ScenicSpotsPage from '@/pages/AncientTown/ScenicSpotsPage';
import FoodExploration from '@/pages/FoodExploration';
import FoodsPage from '@/pages/FoodExploration/FoodsPage';
import Home from '@/pages/Home';
import IntangibleCultural from '@/pages/IntangibleCultural';
import IntangibleHeritagePage from '@/pages/IntangibleCultural/IntangibleHeritagePage';
import ItineraryPlanning from '@/pages/ItineraryPlanning';
import Layout from '@/pages/Layout';
import Login from '@/pages/Login';
import NewsPage from '@/pages/NewsPage';
import PracticalTips from '@/pages/PracticalTips';
import Register from '@/pages/Register';
import AdminCenter from '@/pages/userCenter/Admins';
import AdminsAccount from '@/pages/userCenter/Admins/AdminsAccount';
import ActivityManage from '@/pages/userCenter/Admins/ActivityManage';
import AdminsConsole from '@/pages/userCenter/Admins/AdminsConsole';
import NewsManage from '@/pages/userCenter/Admins/NewsManage';
import PeopleManage from '@/pages/userCenter/Admins/PeopleManage';
import SpotManage from '@/pages/userCenter/Admins/SpotManage';
import InheritorCenter from '@/pages/userCenter/Inheritors';
import TouristCenter from '@/pages/userCenter/Tourists';
import HelpCenter from '@/pages/userCenter/Tourists/HelpCenter';
import MyComments from '@/pages/userCenter/Tourists/MyComments';
import MyFavorites from '@/pages/userCenter/Tourists/MyFavorites';
import MyOrders from '@/pages/userCenter/Tourists/MyOrders';
import MyTrips from '@/pages/userCenter/Tourists/MyTrips';
import Setting from '@/pages/userCenter/Tourists/Setting';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import InheritorConsole from '@/pages/userCenter/Inheritors/InheritorConsole';
import OrderManage from '@/pages/userCenter/Inheritors/OrderManage';
import HeritageManage from '@/pages/userCenter/Inheritors/HeritageManage';
import InheritorAccount from '@/pages/userCenter/Inheritors/InheritorAccount';
import ScenicSpotsDetail from '@/pages/AncientTown/ScenicSpotsDetail';
import IntangibleHeritageDetail from '@/pages/IntangibleCultural/IntangibleHeritageDetail';
import { AuthAdmin, AuthInheritor, AuthTourist } from '@/components';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/ancient-town',
        element: <AncientTown />,
      },
      {
        path: '/intangible-cultural',
        element: <IntangibleCultural />,
      },
      {
        path: '/food-exploration',
        element: <FoodExploration />,
      },
      {
        path: '/itinerary-planning',
        element: <ItineraryPlanning />,
      },
      {
        path: '/practical-tips',
        element: <PracticalTips />,
      },
      {
        path: '/touristCenter',
        element: (
          <AuthTourist>
            <Outlet />
          </AuthTourist>
        ),
        children: [
          { index: true, element: <TouristCenter /> },
          { path: '/touristCenter/setting', element: <Setting /> },
          {
            path: '/touristCenter/helpCenter',
            element: <HelpCenter />,
          },
          {
            path: '/touristCenter/myComments',
            element: <MyComments />,
          },
          {
            path: '/touristCenter/myOrders',
            element: <MyOrders />,
          },
          {
            path: '/touristCenter/myTrips',
            element: <MyTrips />,
          },
          {
            path: '/touristCenter/myFavorites',
            element: <MyFavorites />,
          },
        ],
      },
    ],
  },
  {
    path: '/scenicSpots_Page',
    element: <ScenicSpotsPage />,
  },
  {
    path: '/humanStories_Page',
    element: <HumanStoriesPage />,
  },
  {
    path: '/intangibleHeritage_Page',
    element: <IntangibleHeritagePage />,
  },
  {
    path: '/foods_Page',
    element: <FoodsPage />,
  },
  {
    path: '/news_Page',
    element: <NewsPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/adminCenter',
    element: (
      <AuthAdmin>
        <AdminCenter />
      </AuthAdmin>
    ),
    children: [
      { path: '', element: <AdminsConsole /> },
      { path: 'spotManage', element: <SpotManage /> },
      { path: 'activityManage', element: <ActivityManage /> },
      { path: 'newsManage', element: <NewsManage /> },
      { path: 'peopleManage', element: <PeopleManage /> },
      { path: 'account', element: <AdminsAccount /> },
    ],
  },
  {
    path: '/inheritorCenter',
    element: (
      <AuthInheritor>
        <InheritorCenter />
      </AuthInheritor>
    ),
    children: [
      { path: '', element: <InheritorConsole /> },
      { path: 'orderManage', element: <OrderManage /> },
      { path: 'heritageManage', element: <HeritageManage /> },
      {
        path: 'inheritorAccount',
        element: <InheritorAccount />,
      },
    ],
  },
  { path: '/scenicSpotsDetail/:id', element: <ScenicSpotsDetail /> },
  {
    path: '/intangibleHeritageDetail/:id',
    element: <IntangibleHeritageDetail />,
  },
]);

export default router;
