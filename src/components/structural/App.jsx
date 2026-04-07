import {HashRouter, Route, Routes } from 'react-router';
import Layout from './Layout';
import ListingsPage from '../content/listings/ListingsPage';
import LeaderboardsPage from '../content/leaderboards/LeaderboardsPage';
import ProfessionLeaderboardPage from "../content/leaderboards/ProfessionLeaderboardPage";
import { PROFESSION_LEADERBOARD_IDS } from "../content/leaderboards/professionLeaderboards";
import styles from './App.module.css';

export default function BadgerApp() {

  return (
    <div className={styles.appRoot}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<ListingsPage/>} />
            <Route path="leaderboards" element={<LeaderboardsPage/>} />
            {PROFESSION_LEADERBOARD_IDS.map((leaderboardId) => (
              <Route
                key={leaderboardId}
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
