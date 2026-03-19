import {HashRouter, Route, Routes } from 'react-router';
import Layout from './Layout';
import ListingsPage from '../content/ListingsPage';
import styles from './App.module.css';

export default function BadgerApp() {

  return (
    <div className={styles.appRoot}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<ListingsPage/>} />
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
