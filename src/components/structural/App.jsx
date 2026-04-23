import {HashRouter, Route, Routes } from 'react-router';
import Layout from './Layout';
import ListingsPage from '../content/listings/ListingsPage';
import LeaderboardsPage from '../content/leaderboards/LeaderboardsPage';
import ProfessionLeaderboardPage from "../content/leaderboards/ProfessionLeaderboardPage";
import LoginPage from "../content/auth/LoginPage";
import { ALL_LEADERBOARD_IDS, LEADERBOARD_CATEGORIES } from "../content/leaderboards/leaderboardCatalog";
import styles from './App.module.css';

export default function BadgerApp() {
  const professionLeaderboards = LEADERBOARD_CATEGORIES.find((category) => category.id === "profession")
    ?.leaderboards ?? [];

  return (
    <div className={styles.appRoot}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<ListingsPage/>} />
            <Route path="leaderboards" element={<LeaderboardsPage/>} />
            <Route path="login" element={<LoginPage/>} />
            {ALL_LEADERBOARD_IDS.map((leaderboardId) => (
              <Route
                key={leaderboardId}
                path={`leaderboards/${leaderboardId}`}
                element={<ProfessionLeaderboardPage leaderboardId={leaderboardId} />}
              />
            ))}
            {professionLeaderboards.map((leaderboardId) => (
              <Route
                key={`profession-${leaderboardId}`}
                path={`leaderboards/professions/${leaderboardId}`}
                element={<ProfessionLeaderboardPage leaderboardId={leaderboardId} />}
              />
            ))}
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
