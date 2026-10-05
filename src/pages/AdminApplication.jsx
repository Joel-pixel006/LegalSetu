import {
  useEffect,
  useState,
} from "react"

import {
  useLocation,
  useNavigate,
} from "react-router-dom"

import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"

import { supabase } from "../lib/supabase"


function AdminApplication() {
  const navigate = useNavigate()
  const location = useLocation()

  const application =
    location.state?.application

  const [documents, setDocuments] =
    useState([])

  const [history, setHistory] =
    useState([])

  const [status, setStatus] =
    useState(
      application?.current_status ||
        "submitted"
    )

  const [note, setNote] =
    useState("")

  const [loadingDocuments, setLoadingDocuments] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState("")

  const [error, setError] =
    useState("")


  useEffect(() => {
    if (!application) {
      return
    }

    loadApplicationData()
  }, [application])


  async function loadApplicationData() {
    try {
      setLoadingDocuments(true)
      setError("")

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
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

      if (profileError) {
        throw profileError
      }

      if (profile.role !== "admin") {
        setError(
          "You do not have permission to access this page."
        )
        return
      }

      const {
        data: documentsData,
        error: documentsError,
      } =
        await supabase
          .from("application_documents")
          .select("*")
          .eq(
            "application_id",
            application.id
          )
          .order(
            "uploaded_at",
            {
              ascending: false,
            }
          )

      if (documentsError) {
        throw documentsError
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
            application.id
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

      setDocuments(
        documentsData || []
      )

      setHistory(
        historyData || []
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          "Failed to load application details."
      )
    } finally {
      setLoadingDocuments(false)
    }
  }


  async function openDocument(
    document
  ) {
    try {
      setError("")

      const {
        data,
        error: signedUrlError,
      } =
        await supabase.storage
          .from(
            "application-documents"
          )
          .createSignedUrl(
            document.storage_path,
            60
          )

      if (signedUrlError) {
        throw signedUrlError
      }

      window.open(
        data.signedUrl,
        "_blank"
      )
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          "Could not open the document."
      )
    }
  }


  async function updateApplication() {
    if (!status) {
      return
    }

    try {
      setSaving(true)
      setError("")
      setMessage("")

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(
          "You must be logged in as an admin."
        )
      }

      const {
        data: profile,
        error: profileError,
      } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single()

      if (profileError) {
        throw profileError
      }

      if (profile.role !== "admin") {
        throw new Error(
          "You do not have admin permission."
        )
      }

      const {
        error: updateError,
      } =
        await supabase
          .from("applications")
          .update({
            current_status:
              status,
          })
          .eq(
            "id",
            application.id
          )

      if (updateError) {
        throw updateError
      }

      const {
        data: newHistory,
        error: historyError,
      } =
        await supabase
          .from(
            "application_status_history"
          )
          .insert({
            application_id:
              application.id,
            status,
            note:
              note.trim() ||
              null,
            changed_by:
              user.id,
          })
          .select()
          .single()

      if (historyError) {
        throw historyError
      }

      setHistory(
        (previous) => [
          ...previous,
          newHistory,
        ]
      )

      setMessage(
        "Application status updated successfully."
      )

      setNote("")

      application.current_status =
        status

      setTimeout(() => {
        navigate("/admin")
      }, 1000)
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          "Failed to update application."
      )
    } finally {
      setSaving(false)
    }
  }


  function formatStatus(value) {
    if (!value) {
      return "Unknown"
    }

    return String(value)
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  }


  function formatDate(date) {
    if (!date) {
      return ""
    }

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


  function getStatusStyle(
    value
  ) {
    switch (value) {
      case "completed":
        return "border-[#b9cdbf] bg-[#edf3ee] text-[#315d45]"

      case "rejected":
        return "border-[#dec3bd] bg-[#f6ece9] text-[#8b3f35]"

      case "under_review":
        return "border-[#d8cfaa] bg-[#f5f0dd] text-[#766b35]"

      case "referred":
        return "border-[#c8d3d9] bg-[#edf2f4] text-[#45616e]"

      case "lawyer_assigned":
        return "border-[#c5d2c9] bg-[#edf3ee] text-[#315d45]"

      case "documents_received":
        return "border-[#d3d0c4] bg-[#f1efe7] text-[#716b58]"

      default:
        return "border-[#cfcfc7] bg-[#efefeb] text-[#62635c]"
    }
  }


  function getTimelineIcon(
    value
  ) {
    if (
      value ===
      "completed"
    ) {
      return (
        <CheckCircle2 size={15} />
      )
    }

    if (
      value ===
      "rejected"
    ) {
      return (
        <AlertCircle size={15} />
      )
    }

    return (
      <Clock3 size={15} />
    )
  }


  if (!application) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header showBack />

        <main className="mx-auto max-w-3xl px-6 py-16">

          <div className="border-y border-[#d5d4cd] py-16 text-center">

            <FileText
              size={30}
              className="mx-auto text-[#93938b]"
            />

            <h1 className="mt-5 font-serif text-3xl">
              Application not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#77786f]">
              The application details could not be loaded.
            </p>

            <button
              onClick={() =>
                navigate("/admin")
              }
              className="mt-7 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
            >
              Back to Dashboard
            </button>

          </div>

        </main>

        <Footer />

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header showBack />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">

        <button
          onClick={() =>
            navigate("/admin")
          }
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] hover:text-[#171815]"
        >
          <ArrowLeft
            size={15}
            className="transition group-hover:-translate-x-1"
          />

          Back to Applications
        </button>


        <section className="mt-8 border-b border-[#d5d4cd] pb-10">

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            Legal aid application
          </p>

          <h1 className="mt-3 font-serif text-5xl tracking-[-0.035em] sm:text-6xl">
            {
              application.application_number
            }
          </h1>

          <p className="mt-4 text-sm text-[#77786f]">
            Submitted on{" "}
            {formatDate(
              application.created_at
            )}
          </p>

        </section>


        {message && (
          <div className="mt-6 border-l-2 border-[#315d45] bg-[#edf3ee] px-4 py-4">

            <p className="text-sm leading-6 text-[#315d45]">
              {message}
            </p>

          </div>
        )}


        {error && (
          <div className="mt-6 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-4">

            <p className="text-sm leading-6 text-[#71352f]">
              {error}
            </p>

          </div>
        )}


        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px]">


          <div className="space-y-10">

            {/* Applicant */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Applicant
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Applicant information
                </h2>

              </div>


              <div className="mt-6 grid border-y border-[#d9d8d2] sm:grid-cols-2">

                <div className="border-b border-[#d9d8d2] py-5 sm:border-b-0 sm:border-r sm:pr-6">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Full name
                  </p>

                  <p className="mt-2 font-serif text-xl">
                    {
                      application.full_name
                    }
                  </p>

                </div>


                <div className="border-b border-[#d9d8d2] py-5 sm:border-b-0 sm:pl-6">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Phone
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#4f5049]">
                    <Phone size={14} />
                    {
                      application.phone
                    }
                  </p>

                </div>


                <div className="border-t border-[#d9d8d2] py-5 sm:border-r sm:pr-6">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    District
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-[#4f5049]">
                    <MapPin size={14} />
                    {
                      application.district
                    }
                  </p>

                </div>


                <div className="border-t border-[#d9d8d2] py-5 sm:pl-6">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Category
                  </p>

                  <p className="mt-2 font-serif text-lg">
                    {
                      application.category
                    }
                  </p>

                </div>

              </div>

            </section>


            {/* Problem */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  02 / Submitted problem
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  What the applicant told us
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2] py-6">

                <p className="whitespace-pre-wrap text-sm leading-7 text-[#55574f]">
                  {
                    application.problem_description
                  }
                </p>

              </div>

            </section>


            {/* Documents */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  03 / Documents
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Supporting files
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2]">

                {loadingDocuments ? (

                  <div className="py-10 text-sm text-[#77786f]">
                    Loading documents...
                  </div>

                ) : documents.length ===
                  0 ? (

                  <div className="py-10 text-center">

                    <FileText
                      size={26}
                      className="mx-auto text-[#999990]"
                    />

                    <p className="mt-4 text-sm text-[#77786f]">
                      No documents were uploaded.
                    </p>

                  </div>

                ) : (

                  documents.map(
                    (document) => (

                      <div
                        key={
                          document.id
                        }
                        className="flex items-center justify-between gap-4 border-b border-[#d9d8d2] py-5 last:border-b-0"
                      >

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#cecdc6]">

                            <FileText
                              size={15}
                              className="text-[#315d45]"
                            />

                          </div>


                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-[#242520]">
                              {
                                document.file_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-[#85857d]">
                              {
                                document.file_type ||
                                "File"
                              }
                            </p>

                          </div>

                        </div>


                        <button
                          onClick={() =>
                            openDocument(
                              document
                            )
                          }
                          className="inline-flex shrink-0 items-center gap-2 border border-[#c8c7bf] px-3 py-2 text-xs font-medium hover:border-[#171815] hover:bg-white"
                        >

                          <Download
                            size={14}
                          />

                          View

                        </button>

                      </div>

                    )
                  )

                )}

              </div>

            </section>


            {/* History */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  04 / Status history
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Application progress
                </h2>

              </div>


              {loadingDocuments ? (

                <div className="mt-6 text-sm text-[#77786f]">
                  Loading history...
                </div>

              ) : history.length ===
                0 ? (

                <div className="mt-6 border-y border-[#d9d8d2] py-12 text-center">

                  <Clock3
                    size={27}
                    className="mx-auto text-[#999990]"
                  />

                  <p className="mt-4 text-sm text-[#77786f]">
                    No status history available.
                  </p>

                </div>

              ) : (

                <div className="relative mt-7">

                  <div className="absolute bottom-5 left-[15px] top-5 w-px bg-[#d4d3cc]" />

                  <div>

                    {history.map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={
                            item.id ||
                            index
                          }
                          className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-5"
                        >

                          <div className="relative z-10 flex h-8 w-8 items-center justify-center border border-[#c9c8c0] bg-[#f6f5f1] text-[#62635c]">

                            {
                              getTimelineIcon(
                                item.status
                              )
                            }

                          </div>


                          <div className="pb-8">

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">

                              <div>

                                <p className="font-serif text-xl">
                                  {
                                    formatStatus(
                                      item.status
                                    )
                                  }
                                </p>

                                <p className="mt-1 text-xs leading-5 text-[#7e7f77]">
                                  {
                                    item.note ||
                                    "Status updated by an administrator."
                                  }
                                </p>

                              </div>


                              <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[#99988f]">
                                {
                                  formatDate(
                                    item.created_at
                                  )
                                }
                              </span>

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </section>

          </div>


          {/* RIGHT */}

          <aside className="lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                05 / Administrative action
              </p>


              <h2 className="mt-2 font-serif text-3xl">
                Update the request.
              </h2>


              <p className="mt-3 text-sm leading-6 text-[#73746d]">
                Select the next status and leave a note when additional context is useful.
              </p>


              <div className="mt-7 border-y border-[#d9d8d2]">

                <div className="py-5">

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    Current status
                  </label>


                  <select
                    value={status}
                    onChange={(
                      event
                    ) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    className="mt-3 w-full border border-[#c7c6bf] bg-[#fbfaf7] px-3 py-3 text-sm outline-none focus:border-[#315d45]"
                  >

                    <option value="submitted">
                      Submitted
                    </option>

                    <option value="documents_received">
                      Documents Received
                    </option>

                    <option value="under_review">
                      Under Review
                    </option>

                    <option value="referred">
                      Referred
                    </option>

                    <option value="lawyer_assigned">
                      Lawyer Assigned
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                  </select>

                </div>


                <div className="border-t border-[#d9d8d2] py-5">

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    Note
                  </label>


                  <textarea
                    value={note}
                    onChange={(
                      event
                    ) =>
                      setNote(
                        event.target.value
                      )
                    }
                    rows={6}
                    placeholder="Add a note about this update..."
                    className="mt-3 w-full resize-none border border-[#c7c6bf] bg-[#fbfaf7] p-3 text-sm leading-6 outline-none focus:border-[#315d45]"
                  />

                </div>

              </div>


              <button
                onClick={
                  updateApplication
                }
                disabled={saving}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-[#315d45] px-4 py-3 text-sm font-medium text-white hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
              >

                <Save size={15} />

                {saving
                  ? "Updating..."
                  : "Update Application"}

              </button>


              <div className="mt-6 border border-[#d5d4cd] bg-[#eeede7] p-4">

                <p className="flex items-start gap-2 text-xs leading-5 text-[#77786f]">

                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-[#315d45]"
                  />

                  Each status update is recorded in the application history for the applicant to track.

                </p>

              </div>

            </div>


            <div className="mt-5">

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
                Current status
              </p>

              <span
                className={`mt-2 inline-flex border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] ${getStatusStyle(
                  application.current_status
                )}`}
              >
                {
                  formatStatus(
                    application.current_status
                  )
                }
              </span>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default AdminApplication