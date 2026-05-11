// src/app/router/AppRouter.jsx

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AppLayout from "../layouts/AppLayout";

import HomePage from "../../features/home/pages/HomePage";

import TabEditorPage from "../../features/tab-editor/pages/TabEditorPage";

import PracticePage from "../../features/practice/pages/PracticePage";

import IntervalPracticePage from "../../features/interval-practice/pages/IntervalPracticePage";

import IntervalQuizPage from "../../features/interval-quiz/pages/IntervalQuizPage";

import SequenceQuizPage from "../../features/sequence-quiz/pages/SequenceQuizPage";

function AppRouter() {
  return (
    <Routes>
      {/* =====================================
          ROOT LAYOUT
      ===================================== */}
      <Route element={<AppLayout />}>
        {/* HOME */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* TAB EDITOR */}
        <Route
          path="/editor"
          element={
            <TabEditorPage />
          }
        />

        {/* PRACTICE */}
        <Route
          path="/practice"
          element={
            <PracticePage />
          }
        />

        {/* INTERVAL PRACTICE */}
        <Route
          path="/ear-training/practice"
          element={
            <IntervalPracticePage />
          }
        />

        {/* INTERVAL QUIZ */}
        <Route
          path="/ear-training/quiz"
          element={
            <IntervalQuizPage />
          }
        />

        {/* SEQUENCE QUIZ */}
        <Route
          path="/ear-training/sequence-quiz"
          element={
            <SequenceQuizPage />
          }
        />
      </Route>

      {/* =====================================
          404 REDIRECT
      ===================================== */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

export default AppRouter;