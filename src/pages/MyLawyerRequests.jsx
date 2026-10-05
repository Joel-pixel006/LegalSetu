import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Clock3,
  CheckCircle2,
  MessageCircle,
  RefreshCw,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"
import { supabase } from "../lib/supabase"

function MyLawyerRequests() {
  const navigate = useNavigate()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    try {
      setLoading(true)
      setError("")

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        navigate("/auth")
        return
      }

      const { data, error: requestError } = await supabase
        .from("lawyer_requests")
        .select("id, lawyer_id, name, email, phone, message, status, created_at, lawyers(name, location, specialization)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (requestError) {
        throw requestError
      }

      setRequests(data || [])
    } catch (err) {
      console.error(err)
      setError(err?.message || "Failed to load your lawyer requests.")
    } finally {
      setLoading(false)
    }
  }

  function formatDate(date) {
    if (!date) return "Unknown date"

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function formatStatus(status) {
    return String(status || "pending")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  function statusIcon(status) {
    if (status === "completed") return <CheckCircle2 size={16} />
    if (status === "contacted") return <MessageCircle size={16} />
    return <Clock3 size={16} />
  }

  function statusClass(status) {
    if (status === "completed") {
      return "border-[#9bb9a5] bg-[#edf5ef] text-[#315d45]"
    }

    if (status === "contacted") {
      return "border-[#b9b7a9] bg-[#f3f1e8] text-[#5d5b4f]"
    }

    return "border-[#c9c8c0] bg-[#fbfaf7] text-[#77786f]"
  }

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />
          Back
        </button>

        <section className="mt-8 border-b border-[#d5d4cd] pb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            Your requests
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h1 className="max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                My lawyer requests.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
                See the lawyers you have contacted through LegalSetu and the current status of each request.
              </p>
            </div>

            <button
              onClick={loadRequests}
              className="inline-flex items-center justify-center gap-2 border border-[#c8c7bf] bg-[#fbfaf7] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] transition hover:border-[#315d45]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </section>

        {loading && (
          <div className="border-b border-[#d5d4cd] py-12 text-sm text-[#77786f]">
            Loading your requests...
          </div>
        )}

        {!loading && error && (
          <div className="mt-8 border border-[#c9a4a0] bg-[#fbf3f1] p-5 text-sm leading-6 text-[#70433e]">
            {error}
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <section className="border-b border-[#d5d4cd] py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
              No requests yet
            </p>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.025em]">
              You have not contacted a lawyer yet.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#77786f]">
              Browse the lawyer directory when you are ready to send a request.
            </p>
            <button
              onClick={() => navigate("/lawyers")}
              className="mt-7 inline-flex items-center gap-2 bg-[#315d45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#254b37]"
            >
              Browse lawyers
            </button>
          </section>
        )}

        {!loading && !error && requests.length > 0 && (
          <section className="divide-y divide-[#d5d4cd] border-b border-[#d5d4cd]">
            {requests.map((request) => {
              const lawyer = request.lawyers

              return (
                <article key={request.id} className="grid gap-6 py-8 lg:grid-cols-[1fr_260px]">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-2xl tracking-[-0.02em]">
                          {lawyer?.name || "Lawyer profile"}
                        </p>

                        <p className="mt-2 text-sm text-[#77786f]">
                          {lawyer?.location || "Location not specified"}
                          {lawyer?.specialization
                            ? ` · ${lawyer.specialization}`
                            : ""}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] ${statusClass(request.status)}`}
                      >
                        {statusIcon(request.status)}
                        {formatStatus(request.status)}
                      </span>
                    </div>

                    {request.message && (
                      <div className="mt-6 border-l-2 border-[#315d45] pl-4">
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8a8a82]">
                          Your request
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#55564f]">
                          {request.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#d9d8d2] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                      Submitted
                    </p>
                    <p className="mt-2 text-sm text-[#3f403a]">
                      {formatDate(request.created_at)}
                    </p>

                    <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                      Status
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#55564f]">
                      {request.status === "pending" && "Your request has been submitted and is awaiting follow-up."}
                      {request.status === "contacted" && "The lawyer request has been marked as contacted."}
                      {request.status === "completed" && "This lawyer request has been marked as completed."}
                      {!['pending', 'contacted', 'completed'].includes(request.status) && "Your request is being processed."}
                    </p>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default MyLawyerRequests
