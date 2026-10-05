import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {
  FileText,
  Clock3,
  CheckCircle2,
  Eye,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  Scale,
} from "lucide-react"

import { supabase } from "../lib/supabase"
import Header from "../components/Header"
import Footer from "../components/Footer"

function AdminDashboard() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [lawyerRequests, setLawyerRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedRequestStatus, setSelectedRequestStatus] = useState("pending")
  const [savingRequest, setSavingRequest] = useState(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)
      setError("")

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        navigate("/auth")
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      if (profile.role !== "admin") {
        setError("You do not have permission to access the admin dashboard.")
        return
      }

      const { data: applicationData, error: applicationsError } =
        await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false })

      if (applicationsError) {
        throw applicationsError
      }

      const { data: requestData, error: requestsError } = await supabase
        .from("lawyer_requests")
        .select(
          "id, name, email, phone, message, status, created_at, lawyers(name, location, specialization)"
        )
        .order("created_at", { ascending: false })

      if (requestsError) {
        throw requestsError
      }

      setApplications(applicationData || [])
      setLawyerRequests(requestData || [])
    } catch (err) {
      console.error(err)
      setError(err?.message || "Failed to load the admin dashboard.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteApplication(application) {
    const confirmed = window.confirm(
      `Delete application ${application.application_number || ""}? This will permanently remove the application and its status history.`
    )

    if (!confirmed) return

    try {
      setDeletingId(application.id)
      setError("")

      const { error: historyError } = await supabase
        .from("application_status_history")
        .delete()
        .eq("application_id", application.id)

      if (historyError) {
        throw historyError
      }

      const { error: applicationError } = await supabase
        .from("applications")
        .delete()
        .eq("id", application.id)

      if (applicationError) {
        throw applicationError
      }

      setApplications((current) =>
        current.filter((item) => item.id !== application.id)
      )
    } catch (err) {
      console.error(err)
      setError(
        err?.message ||
          "Failed to delete the application. No changes were made if the database rejected the operation."
      )
    } finally {
      setDeletingId(null)
    }
  }

  function viewLawyerRequest(request) {
    setSelectedRequest(request)
    setSelectedRequestStatus(request.status || "pending")
    setError("")
  }

  async function saveLawyerRequestStatus() {
    if (!selectedRequest) return

    try {
      setSavingRequest(true)
      setError("")

      const { data, error: updateError } = await supabase
        .from("lawyer_requests")
        .update({ status: selectedRequestStatus })
        .eq("id", selectedRequest.id)
        .select(
          "id, name, email, phone, message, status, created_at, lawyers(name, location, specialization)"
        )
        .single()

      if (updateError) {
        throw updateError
      }

      setSelectedRequest(data)

      setLawyerRequests((current) =>
        current.map((item) =>
          item.id === data.id ? data : item
        )
      )
    } catch (err) {
      console.error(err)
      setError(
        err?.message || "Failed to update the lawyer request."
      )
    } finally {
      setSavingRequest(false)
    }
  }

  async function deleteLawyerRequest(request) {
    const confirmed = window.confirm(
      "Delete this lawyer contact request? This permanently removes the request from Supabase."
    )

    if (!confirmed) return

    try {
      setDeletingId(request.id)
      setError("")

      const { error: deleteError } = await supabase
        .from("lawyer_requests")
        .delete()
        .eq("id", request.id)

      if (deleteError) {
        throw deleteError
      }

      setLawyerRequests((current) =>
        current.filter((item) => item.id !== request.id)
      )

      if (selectedRequest?.id === request.id) {
        setSelectedRequest(null)
      }
    } catch (err) {
      console.error(err)
      setError(
        err?.message || "Failed to delete the lawyer request."
      )
    } finally {
      setDeletingId(null)
    }
  }

  function formatStatus(status) {
    if (!status) return "Unknown"

    return String(status)
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  function formatDate(date) {
    if (!date) return "Unknown"

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function getStatusStyle(status) {
    switch (status) {
      case "completed":
        return "border-[#b9cdbf] bg-[#edf3ee] text-[#315d45]"
      case "rejected":
        return "border-[#dec3bd] bg-[#f6ece9] text-[#8b3f35]"
      case "under_review":
        return "border-[#d8cfaa] bg-[#f5f0dd] text-[#766b35]"
      case "referred":
        return "border-[#c8d3d9] bg-[#edf2f4] text-[#45616e]"
      default:
        return "border-[#cfcfc7] bg-[#efefeb] text-[#62635c]"
    }
  }

  const submittedCount = applications.filter(
    (app) => app.current_status === "submitted"
  ).length

  const reviewCount = applications.filter(
    (app) => app.current_status === "under_review"
  ).length

  const completedCount = applications.filter(
    (app) => app.current_status === "completed"
  ).length

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">
      <Header showBack />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <button
          onClick={() => navigate("/")}
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
        >
          <ArrowLeft
            size={15}
            className="transition group-hover:-translate-x-1"
          />
          Back to LegalSetu
        </button>

        <section className="mt-8 border-b border-[#d5d4cd] pb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            Administration
          </p>

          <h1 className="mt-3 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
            Track applications and lawyer requests.
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
            View submitted information, update request status, or permanently
            delete records from LegalSetu.
          </p>
        </section>

        {error && (
          <div className="mt-8 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-4">
            <p className="text-sm leading-6 text-[#71352f]">{error}</p>
          </div>
        )}

        {!error && (
          <>
            <section className="mt-8 grid gap-0 border-y border-[#d5d4cd] sm:grid-cols-3">
              <div className="border-b border-[#d9d8d2] px-1 py-6 sm:border-b-0 sm:border-r">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
                  New applications
                </p>
                <p className="mt-2 font-serif text-4xl">{submittedCount}</p>
              </div>

              <div className="border-b border-[#d9d8d2] px-1 py-6 sm:border-b-0 sm:border-r sm:pl-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
                  Under review
                </p>
                <p className="mt-2 font-serif text-4xl">{reviewCount}</p>
              </div>

              <div className="px-1 py-6 sm:pl-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
                  Completed
                </p>
                <p className="mt-2 font-serif text-4xl">{completedCount}</p>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex flex-col gap-4 border-b border-[#d5d4cd] pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                    Application tracking
                  </p>

                  <h2 className="mt-1 font-serif text-3xl">
                    Legal-aid applications
                  </h2>

                  <p className="mt-2 text-sm text-[#74756e]">
                    {applications.length} application
                    {applications.length === 1 ? "" : "s"} currently visible.
                  </p>
                </div>

                <button
                  onClick={loadDashboard}
                  disabled={loading}
                  className="inline-flex items-center gap-2 border border-[#c8c7bf] px-4 py-2.5 text-sm font-medium transition hover:border-[#171815] hover:bg-white disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>

              <div className="mt-6 border-y border-[#d5d4cd]">
                {loading ? (
                  <div className="py-16 text-center">
                    <span className="mx-auto block h-6 w-6 animate-spin rounded-full border-2 border-[#c7c7bf] border-t-[#315d45]" />
                    <p className="mt-4 text-sm text-[#77786f]">
                      Loading dashboard...
                    </p>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="py-14 text-center">
                    <FileText
                      size={28}
                      className="mx-auto text-[#9a9991]"
                    />
                    <h3 className="mt-5 font-serif text-2xl">
                      No applications yet.
                    </h3>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                      <thead className="border-b border-[#d9d8d2] bg-[#eeede7]">
                        <tr>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Application
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Applicant
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Category
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Status
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {applications.map((application) => (
                          <tr
                            key={application.id}
                            className="border-b border-[#d9d8d2] transition hover:bg-[#eeede8]"
                          >
                            <td className="px-5 py-5">
                              <p className="font-mono text-sm text-[#242520]">
                                {application.application_number}
                              </p>
                              <p className="mt-1 text-xs text-[#85857d]">
                                {formatDate(application.created_at)}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="font-medium text-[#242520]">
                                {application.full_name}
                              </p>
                              <p className="mt-1 text-xs text-[#85857d]">
                                {application.phone}
                              </p>
                            </td>

                            <td className="px-5 py-5 text-sm text-[#666861]">
                              {application.category}
                            </td>

                            <td className="px-5 py-5">
                              <span
                                className={`inline-flex border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] ${getStatusStyle(
                                  application.current_status
                                )}`}
                              >
                                {formatStatus(application.current_status)}
                              </span>
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    navigate("/admin/application", {
                                      state: { application },
                                    })
                                  }
                                  className="inline-flex items-center gap-2 border border-[#c8c7bf] px-3 py-2 text-xs font-medium transition hover:border-[#171815] hover:bg-white"
                                >
                                  <Eye size={14} />
                                  View
                                </button>

                                <button
                                  onClick={() => deleteApplication(application)}
                                  disabled={deletingId === application.id}
                                  className="inline-flex items-center gap-2 border border-[#d7b7b1] px-3 py-2 text-xs font-medium text-[#8b3f35] transition hover:border-[#9b3d32] hover:bg-[#f5ebe8] disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  {deletingId === application.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            <section className="mt-14">
              <div className="border-b border-[#d5d4cd] pb-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  Lawyer contact tracking
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Lawyer requests
                </h2>

                <p className="mt-2 text-sm text-[#74756e]">
                  {lawyerRequests.length} request
                  {lawyerRequests.length === 1 ? "" : "s"} currently visible.
                </p>
              </div>

              <div className="mt-6 border-y border-[#d5d4cd]">
                {lawyerRequests.length === 0 ? (
                  <div className="py-14 text-center">
                    <Scale
                      size={28}
                      className="mx-auto text-[#9a9991]"
                    />
                    <h3 className="mt-5 font-serif text-2xl">
                      No lawyer requests yet.
                    </h3>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left">
                      <thead className="border-b border-[#d9d8d2] bg-[#eeede7]">
                        <tr>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Requester
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Lawyer
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Status
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Date
                          </th>
                          <th className="px-5 py-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77786f]">
                            Action
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {lawyerRequests.map((request) => (
                          <tr
                            key={request.id}
                            className="border-b border-[#d9d8d2] transition hover:bg-[#eeede8]"
                          >
                            <td className="px-5 py-5">
                              <p className="font-medium text-[#242520]">
                                {request.name}
                              </p>
                              <p className="mt-1 text-xs text-[#85857d]">
                                {request.email}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <p className="text-sm text-[#3f403a]">
                                {request.lawyers?.name || "Unknown lawyer"}
                              </p>
                              <p className="mt-1 text-xs text-[#77786f]">
                                {request.lawyers?.specialization ||
                                  "Specialization not specified"}
                              </p>
                            </td>

                            <td className="px-5 py-5">
                              <span
                                className={`inline-flex border px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] ${getStatusStyle(
                                  request.status
                                )}`}
                              >
                                {formatStatus(request.status)}
                              </span>
                            </td>

                            <td className="px-5 py-5 text-sm text-[#7a7b73]">
                              {formatDate(request.created_at)}
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    viewLawyerRequest(request)
                                  }
                                  className="inline-flex items-center gap-2 border border-[#c8c7bf] px-3 py-2 text-xs font-medium transition hover:border-[#171815] hover:bg-white"
                                >
                                  <Eye size={14} />
                                  View
                                </button>

                                <button
                                  onClick={() => deleteLawyerRequest(request)}
                                  disabled={deletingId === request.id}
                                  className="inline-flex items-center gap-2 border border-[#d7b7b1] px-3 py-2 text-xs font-medium text-[#8b3f35] transition hover:border-[#9b3d32] hover:bg-[#f5ebe8] disabled:opacity-50"
                                >
                                  <Trash2 size={14} />
                                  {deletingId === request.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {selectedRequest && (
                <section className="mt-8 border-t-2 border-[#315d45] pt-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                        Selected request
                      </p>

                      <h3 className="mt-2 font-serif text-3xl">
                        {selectedRequest.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="border border-[#c8c7bf] px-3 py-2 text-xs font-medium transition hover:border-[#171815] hover:bg-white"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-6 grid gap-8 border-y border-[#d5d4cd] py-7 lg:grid-cols-2">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        Contact details
                      </p>

                      <p className="mt-3 text-sm text-[#3f403a]">
                        {selectedRequest.email}
                      </p>

                      {selectedRequest.phone && (
                        <p className="mt-1 text-sm text-[#77786f]">
                          {selectedRequest.phone}
                        </p>
                      )}

                      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        Lawyer
                      </p>

                      <p className="mt-2 font-serif text-xl">
                        {selectedRequest.lawyers?.name || "Unknown lawyer"}
                      </p>

                      <p className="mt-1 text-sm text-[#77786f]">
                        {selectedRequest.lawyers?.location || "Location not specified"}
                      </p>

                      <p className="mt-1 text-sm text-[#77786f]">
                        {selectedRequest.lawyers?.specialization ||
                          "Specialization not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        User message
                      </p>

                      <div className="mt-3 border-l-2 border-[#315d45] pl-4">
                        <p className="text-sm leading-7 text-[#55564f]">
                          {selectedRequest.message ||
                            "No message was provided."}
                        </p>
                      </div>

                      <p className="mt-5 text-xs text-[#85857d]">
                        Submitted{" "}
                        {formatDate(selectedRequest.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <label className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8a8a82]">
                        Update status
                      </label>

                      <select
                        value={selectedRequestStatus}
                        onChange={(event) =>
                          setSelectedRequestStatus(event.target.value)
                        }
                        className="mt-2 w-full border border-[#c8c7bf] bg-[#fbfaf7] px-4 py-3 text-sm outline-none focus:border-[#315d45]"
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <button
                      onClick={saveLawyerRequestStatus}
                      disabled={savingRequest}
                      className="border border-[#315d45] bg-[#315d45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#274b38] disabled:opacity-50"
                    >
                      {savingRequest
                        ? "Saving..."
                        : "Save status"}
                    </button>

                    <button
                      onClick={() =>
                        deleteLawyerRequest(selectedRequest)
                      }
                      disabled={
                        deletingId === selectedRequest.id
                      }
                      className="inline-flex items-center justify-center gap-2 border border-[#d7b7b1] px-5 py-3 text-sm font-medium text-[#8b3f35] transition hover:border-[#9b3d32] hover:bg-[#f5ebe8] disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingId === selectedRequest.id
                        ? "Deleting..."
                        : "Delete request"}
                    </button>
                  </div>
                </section>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default AdminDashboard
