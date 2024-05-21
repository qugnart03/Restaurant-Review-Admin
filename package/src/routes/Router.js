import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout.js"));

/***** Pages ****/
const User = lazy(() => import("../views/UserPage.js"));
const Post = lazy(() => import("../views/PostPage.js"));
const RestaurantPage = lazy(() => import("../views/RestaurantPage.js"));
const Auth = lazy(() => import("../views/Auth.js"));
const DashBoardScreen = lazy(() => import("../views/DashBoardScreen.js"));

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/auth" /> },
      { path: "/dashboard", exact: true, element: <DashBoardScreen /> },
      { path: "/users", exact: true, element: <User /> },
      { path: "/posts", exact: true, element: <Post /> },
      { path: "/restaurants", exact: true, element: <RestaurantPage /> },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Navigate to="/auth" /> },
      { path: "/auth", exact: true, element: <Auth /> },
    ],
  },
];

export default ThemeRoutes;
