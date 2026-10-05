import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom"
import { useEffect, useState } from "react"

import ScrollToTop from "./components/ScrollToTop"

import Home from "./pages/Home"
import Results from "./pages/Results"
import ServiceDetails from "./pages/ServiceDetails"
import ApplyAid from "./pages/ApplyAid"
import Lawyers from "./pages/Lawyers"
import LawyerProfile from "./pages/LawyerProfile"
import LegalAid from "./pages/LegalAid"
import LegalAidDetails from "./pages/LegalAidDetails"
import TrackApplication from "./pages/TrackApplication"
import NotFound from "./pages/NotFound"
import Auth from "./pages/Auth"
import AdminDashboard from "./pages/AdminDashboard"
import AdminApplication from "./pages/AdminApplication"
import LawyerRequest from "./pages/LawyerRequest"
import MyLawyerRequests from "./pages/MyLawyerRequests"

import { supabase } from "./lib/supabase"

// --------------------------------------------------
// AUTH GUARD
// --------------------------------------------------

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (mounted) {
        setUser(user)
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading LegalSetu...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}

// --------------------------------------------------
// HOME
// --------------------------------------------------

function HomePage() {
  const navigate = useNavigate()

  return (
    <Home
      onFindHelp={(result) =>
        navigate("/results", {
          state: { result },
        })
      }
      onFindLawyer={() => navigate("/lawyers")}
      onFindLegalAid={() => navigate("/legal-aid")}
      onApplyAid={() => navigate("/apply")}
      onTrackApplication={() => navigate("/track")}
    />
  )
}

// --------------------------------------------------
// RESULTS
// --------------------------------------------------

function ResultsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const result = location.state?.result

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              No problem found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please describe your legal problem first.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <Results
      result={result}
      onBack={() => navigate("/")}
    />
  )
}

// --------------------------------------------------
// SERVICE DETAILS
// --------------------------------------------------

function ServiceDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const service = location.state?.service

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Service not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The service information could not be loaded.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-6 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ServiceDetails
      service={service}
      onBack={() => navigate("/results")}
      onApplyAid={() => navigate("/apply")}
    />
  )
}

// --------------------------------------------------
// LAWYERS
// --------------------------------------------------

function LawyersPage() {
  return <Lawyers />
}

// --------------------------------------------------
// LAWYER PROFILE
// --------------------------------------------------

function LawyerProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <LawyerProfile
      lawyer={location.state?.lawyer}
      onBack={() => navigate("/lawyers")}
    />
  )
}

// --------------------------------------------------
// LEGAL AID
// --------------------------------------------------

function LegalAidPage() {
  return <LegalAid />
}

// --------------------------------------------------
// LEGAL AID DETAILS
// --------------------------------------------------

function LegalAidDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <LegalAidDetails
      centre={location.state?.centre}
      onBack={() => navigate("/legal-aid")}
      onApply={() => navigate("/apply")}
    />
  )
}

// --------------------------------------------------
// APPLY
// --------------------------------------------------

function ApplyPage() {
  const navigate = useNavigate()

  return (
    <ApplyAid
      onBack={() => navigate("/")}
    />
  )
}

// --------------------------------------------------
// TRACK
// --------------------------------------------------

function TrackPage() {
  return <TrackApplication />
}

// --------------------------------------------------
// PROTECTED PAGE WRAPPER
// --------------------------------------------------

function Protected({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}

// --------------------------------------------------
// APP
// --------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>

        {/* =========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/auth"
          element={<Auth />}
        />

        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/results"
          element={<ResultsPage />}
        />

        <Route
          path="/service"
          element={<ServiceDetailsPage />}
        />

        <Route
          path="/lawyers"
          element={<LawyersPage />}
        />

        <Route
          path="/lawyer"
          element={<LawyerProfilePage />}
        />

        <Route
          path="/legal-aid"
          element={<LegalAidPage />}
        />

        <Route
          path="/legal-aid/details"
          element={<LegalAidDetailsPage />}
        />


        {/* =========================================
            LOGIN REQUIRED
        ========================================== */}

        <Route
          path="/lawyer-request"
          element={
            <Protected>
              <LawyerRequest />
            </Protected>
          }
        />

        <Route
          path="/apply"
          element={
            <Protected>
              <ApplyPage />
            </Protected>
          }
        />

        <Route
          path="/track"
          element={
            <Protected>
              <TrackPage />
            </Protected>
          }
        />

        <Route
          path="/my-lawyer-requests"
          element={
            <Protected>
              <MyLawyerRequests />
            </Protected>
          }
        />


        {/* =========================================
            ADMIN
        ========================================== */}

        <Route
          path="/admin"
          element={
            <Protected>
              <AdminDashboard />
            </Protected>
          }
        />

        <Route
          path="/admin/application"
          element={
            <Protected>
              <AdminApplication />
            </Protected>
          }
        />


        {/* =========================================
            NOT FOUND
        ========================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App