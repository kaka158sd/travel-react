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
import Test from '@/pages/test';
import AdminCenter from '@/pages/userCenter/Admins';
import InheritorCenter from '@/pages/userCenter/Inheritors';
import TouristCenter from '@/pages/userCenter/Tourists';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
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
    path: '/touristCenter',
    element: <TouristCenter />,
  },
  {
    path: '/adminCenter',
    element: <AdminCenter />,
  },
  {
    path: '/inheritorCenter',
    element: <InheritorCenter />,
  },
  {
    path: '/test',
    element: <Test />,
  },
]);

export default router;
