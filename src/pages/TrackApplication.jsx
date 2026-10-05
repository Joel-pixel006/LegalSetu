import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
  AlertCircle,
  MapPin,
  Scale,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { supabase } from "../lib/supabase"


function TrackApplication() {
  const navigate = useNavigate()
  const location = useLocation()

  const [applicationNumber, setApplicationNumber] =
    useState(
      location.state?.applicationNumber || ""
    )

  const [applications, setApplications] =
    useState([])

  const [application, setApplication] =
    useState(null)

  const [history, setHistory] =
    useState([])

  const [loadingApplications, setLoadingApplications] =
    useState(true)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // --------------------------------------------------
  // LOAD USER APPLICATIONS
  // --------------------------------------------------

  useEffect(() => {
    loadMyApplications()
  }, [])


  async function loadMyApplications() {
    try {
      setLoadingApplications(true)

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser()

      if (userError || !user) {
        navigate("/auth")
        return
      }

      const {
        data,
        error: applicationsError,
      } =
        await supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })

      if (applicationsError) {
        throw applicationsError
      }

      setApplications(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingApplications(false)
    }
  }


  // --------------------------------------------------
  // TRACK APPLICATION
  // --------------------------------------------------

  async function trackApplication(
    number = applicationNumber
  ) {
    if (!number.trim()) {
      setError(
        "Please enter your application number."
      )
      return
    }

    try {
      setLoading(true)
      setError("")
      setApplication(null)
      setHistory([])

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser()

      if (userError || !user) {
        navigate("/auth")
        return
      }

      const {
        data: applicationData,
        error: applicationError,
      } =
        await supabase
          .from("applications")
          .select("*")
          .eq(
            "application_number",
            number
              .trim()
              .toUpperCase()
          )
          .eq(
            "user_id",
            user.id
          )
          .single()

      if (applicationError) {
        if (
          applicationError.code ===
          "PGRST116"
        ) {
          throw new Error(
            "Application not found. Please check your application number."
          )
        }

        throw applicationError
      }

      const {
        data: historyData,
        error: historyError,
      } =
        await supabase
          .from(
            "application_status_history"
          )
          .select("*")
          .eq(
            "application_id",
            applicationData.id
          )
          .order(
            "created_at",
            {
              ascending: true,
            }
          )

      if (historyError) {
        throw historyError
      }

      setApplicationNumber(
        applicationData.application_number
      )

      setApplication(
        applicationData
      )

      setHistory(
        historyData || []
      )

      setTimeout(() => {
        document
          .getElementById(
            "application-details"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
      }, 100)
    } catch (err) {
      console.error(err)

      setError(
        err.message ||
          "Unable to track application."
      )
    } finally {
      setLoading(false)
    }
  }


  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  function formatStatus(status) {
    if (!status) {
      return "Unknown"
    }

    return status
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  }


  function formatDate(date) {
    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    )
  }


  function formatShortDate(date) {
    if (!date) {
      return ""
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }


  function getStatusColor(status) {
    switch (status) {
      case "completed":
        return "text-[#315d45]"

      case "rejected":
        return "text-[#9b3d32]"

      case "under_review":
        return "text-[#8a6a24]"

      case "referred":
        return "text-[#8a6a24]"

      case "lawyer_assigned":
        return "text-[#315d45]"

      default:
        return "text-[#686a62]"
    }
  }


  function getTimelineIcon(status) {
    if (
      status ===
      "completed"
    ) {
      return (
        <CheckCircle2
          size={17}
          strokeWidth={1.7}
        />
      )
    }

    if (
      status ===
      "rejected"
    ) {
      return (
        <AlertCircle
          size={17}
          strokeWidth={1.7}
        />
      )
    }

    return (
      <Clock3
        size={17}
        strokeWidth={1.7}
      />
    )
  }


  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />


      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">

        {/* ==========================================
            BACK
        ========================================== */}

        <button
          onClick={() =>
            navigate(-1)
          }
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
        >

          <ArrowLeft
            size={15}
            strokeWidth={1.7}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          Back

        </button>


        {/* ==========================================
            PAGE INTRO
        ========================================== */}

        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_320px] lg:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Application tracking
            </p>


            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
              Keep your legal journey in view.
            </h1>


            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
              View applications submitted through LegalSetu and follow their progress from submission to completion.
            </p>

          </div>


          <div className="border-l border-[#d5d4cd] pl-5">

            <div className="flex items-center gap-2">

              <Scale
                size={16}
                strokeWidth={1.6}
                className="text-[#315d45]"
              />

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Your applications
              </p>

            </div>


            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              Only applications connected to your LegalSetu account are shown here.
            </p>

          </div>

        </section>


        {/* ==========================================
            PAGE GRID
        ========================================== */}

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">


          {/* ========================================
              MAIN COLUMN
          ======================================== */}

          <div className="min-w-0 pt-8">


            {/* ======================================
                01 / YOUR APPLICATIONS
            ====================================== */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Your applications
                </p>

                <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                  Your legal requests
                </h2>

              </div>


              {loadingApplications ? (

                <div className="border-b border-[#d9d8d2] py-10">

                  <p className="text-sm text-[#77786f]">
                    Loading your applications...
                  </p>

                </div>

              ) : applications.length === 0 ? (

                <div className="border-b border-[#d9d8d2] py-10">

                  <div className="flex items-start gap-4">

                    <FileText
                      size={20}
                      strokeWidth={1.6}
                      className="mt-1 text-[#315d45]"
                    />

                    <div>

                      <h3 className="font-serif text-2xl">
                        No applications yet.
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-[#74756e]">
                        Applications submitted through LegalSetu will appear here so you can return to them later.
                      </p>

                      <button
                        onClick={() =>
                          navigate("/apply")
                        }
                        className="group mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#315d45]"
                      >

                        Start an application

                        <ArrowRight
                          size={15}
                          className="transition-transform group-hover:translate-x-1"
                        />

                      </button>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="divide-y divide-[#d9d8d2] border-b border-[#d9d8d2]">

                  {applications.map(
                    (
                      item,
                      index
                    ) => (

                      <button
                        key={item.id}
                        onClick={() =>
                          trackApplication(
                            item.application_number
                          )
                        }
                        className="group w-full px-1 py-6 text-left transition hover:bg-[#eeede8] sm:px-2"
                      >

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                          <div className="min-w-0">

                            <div className="flex items-center gap-3">

                              <span className="font-mono text-[9px] text-[#9a9991]">
                                {String(
                                  index + 1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                              </span>

                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#77786f]">
                                {item.application_number}
                              </p>

                            </div>


                            <h3 className="mt-3 font-serif text-2xl">
                              {item.category ||
                                "Legal Aid"}
                            </h3>


                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#77786f]">

                              {item.district && (
                                <>
                                  <MapPin
                                    size={13}
                                    strokeWidth={1.6}
                                  />

                                  <span>
                                    {item.district}
                                  </span>
                                </>
                              )}

                              {item.created_at && (
                                <>
                                  <span className="text-[#b1b0a8]">
                                    /
                                  </span>

                                  <span>
                                    Submitted{" "}
                                    {formatShortDate(
                                      item.created_at
                                    )}
                                  </span>
                                </>
                              )}

                            </div>

                          </div>


                          <div className="flex items-center gap-5 sm:shrink-0">

                            <span
                              className={`font-mono text-[9px] uppercase tracking-[0.14em] ${getStatusColor(
                                item.current_status
                              )}`}
                            >
                              {formatStatus(
                                item.current_status
                              )}
                            </span>


                            <ArrowRight
                              size={17}
                              strokeWidth={1.6}
                              className="text-[#9a9991] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                            />

                          </div>

                        </div>

                      </button>

                    )
                  )}

                </div>

              )}

            </section>


            {/* ======================================
                02 / SEARCH
            ====================================== */}

            <section className="mt-12">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  02 / Find an application
                </p>

                <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                  Have an application number?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#73746d]">
                  Enter the number from your LegalSetu application confirmation.
                </p>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2] py-6">

                <div className="flex flex-col gap-4 sm:flex-row">

                  <div className="relative flex-1">

                    <Search
                      size={17}
                      strokeWidth={1.6}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-[#8d8d85]"
                    />

                    <input
                      type="text"
                      value={
                        applicationNumber
                      }
                      onChange={(
                        event
                      ) =>
                        setApplicationNumber(
                          event.target.value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          trackApplication()
                        }
                      }}
                      placeholder="LS-2026-DF4DF884"
                      className="w-full border-b border-[#bcbab1] bg-transparent px-8 py-3 text-sm text-[#252620] outline-none placeholder:text-[#aaa9a1] focus:border-[#315d45]"
                    />

                  </div>


                  <button
                    onClick={() =>
                      trackApplication()
                    }
                    disabled={
                      loading
                    }
                    className="group inline-flex items-center justify-center gap-3 bg-[#315d45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {loading
                      ? "Searching..."
                      : "Track application"}

                    {!loading && (
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    )}

                  </button>

                </div>


                {error && (

                  <div className="mt-5 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-3">

                    <div className="flex items-start gap-2">

                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-[#9b3d32]"
                      />

                      <p className="text-sm leading-6 text-[#71352f]">
                        {error}
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </section>


            {/* ======================================
                03 / APPLICATION DETAILS
            ====================================== */}

            {application && (

              <section
                id="application-details"
                className="mt-12"
              >

                <div className="border-b border-[#d5d4cd] pb-3">

                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                    03 / Application details
                  </p>

                  <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                    Your application
                  </h2>

                </div>


                {/* Application header */}

                <div className="border-b border-[#d9d8d2] py-7">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                    <div>

                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        Application number
                      </p>

                      <h3 className="mt-2 font-serif text-3xl">
                        {application.application_number}
                      </h3>

                    </div>


                    <div>

                      <p
                        className={`font-mono text-[10px] uppercase tracking-[0.15em] ${getStatusColor(
                          application.current_status
                        )}`}
                      >
                        {formatStatus(
                          application.current_status
                        )}
                      </p>

                    </div>

                  </div>


                  <div className="mt-7 grid border-y border-[#d9d8d2] sm:grid-cols-3">

                    <div className="border-b border-[#d9d8d2] py-4 sm:border-b-0 sm:border-r sm:pr-5">

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                        Applicant
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {application.full_name}
                      </p>

                    </div>


                    <div className="border-b border-[#d9d8d2] py-4 sm:border-b-0 sm:border-r sm:px-5">

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                        District
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {application.district}
                      </p>

                    </div>


                    <div className="py-4 sm:pl-5">

                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                        Category
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {application.category}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Problem */}

                <div className="border-b border-[#d9d8d2] py-7">

                  <div className="flex items-start gap-4">

                    <FileText
                      size={20}
                      strokeWidth={1.6}
                      className="mt-1 text-[#315d45]"
                    />

                    <div>

                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                        Submitted information
                      </p>

                      <h3 className="mt-2 font-serif text-2xl">
                        Your problem
                      </h3>

                    </div>

                  </div>


                  <div className="mt-5 border-l-2 border-[#d5d4cd] pl-5">

                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#686a62]">
                      {application.problem_description}
                    </p>

                  </div>

                </div>


                {/* Progress */}

                <div className="py-7">

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                      Status history
                    </p>

                    <h3 className="mt-1 font-serif text-2xl">
                      Application progress
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#73746d]">
                      Updates recorded by LegalSetu administrators.
                    </p>

                  </div>


                  {history.length === 0 ? (

                    <div className="py-8">

                      <p className="text-sm text-[#77786f]">
                        No status updates yet.
                      </p>

                    </div>

                  ) : (

                    <div className="mt-7">

                      {history.map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            key={
                              item.id
                            }
                            className="relative flex gap-5 pb-8 last:pb-0"
                          >

                            {index <
                              history.length -
                                1 && (

                              <div className="absolute bottom-0 left-[9px] top-5 w-px bg-[#d5d4cd]" />

                            )}


                            <div
                              className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center ${
                                index ===
                                history.length -
                                  1
                                  ? "text-[#315d45]"
                                  : "text-[#92928a]"
                              }`}
                            >

                              {getTimelineIcon(
                                item.status
                              )}

                            </div>


                            <div className="min-w-0 flex-1">

                              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                  <h4 className="font-serif text-xl">
                                    {formatStatus(
                                      item.status
                                    )}
                                  </h4>

                                </div>


                                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#9a9991]">
                                  {formatDate(
                                    item.created_at
                                  )}
                                </span>

                              </div>


                              {item.note && (

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74756e]">
                                  {item.note}
                                </p>

                              )}

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </div>

              </section>

            )}

          </div>


          {/* ========================================
              SIDEBAR
          ======================================== */}

          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                Useful places
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                Know where to go next.
              </h2>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">


                {/* Legal Aid */}

                <button
                  onClick={() =>
                    navigate(
                      "/legal-aid"
                    )
                  }
                  className="group block w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <FileText
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#99988f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Legal aid
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77786f]">
                    Explore available legal-aid services.
                  </p>

                </button>


                {/* Lawyers */}

                <button
                  onClick={() =>
                    navigate(
                      "/lawyers"
                    )
                  }
                  className="group block w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <Scale
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#99988f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Find a lawyer
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77786f]">
                    Browse the LegalSetu lawyer directory.
                  </p>

                </button>


                {/* Apply */}

                <button
                  onClick={() =>
                    navigate(
                      "/apply"
                    )
                  }
                  className="group block w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <CheckCircle2
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#99988f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Apply for legal aid
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77786f]">
                    Start a new legal-aid application.
                  </p>

                </button>

              </div>


              {/* Note */}

              <div className="mt-7 border-t border-[#d5d4cd] pt-5">

                <p className="text-xs leading-5 text-[#88877f]">
                  LegalSetu helps users discover legal information and services. It does not provide legal advice.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>


      <Footer />

    </div>
  )
}


export default TrackApplication