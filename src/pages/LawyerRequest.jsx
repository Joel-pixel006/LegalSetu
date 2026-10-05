import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"
import { supabase } from "../lib/supabase"

function LawyerRequest() {
  const navigate = useNavigate()
  const location = useLocation()

  const lawyer = location.state?.lawyer

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // --------------------------------------------------
  // NO LAWYER SELECTED
  // --------------------------------------------------

  if (!lawyer) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">
        <Header />

        <main className="mx-auto max-w-3xl px-6 py-12">

          <button
            onClick={() => navigate("/lawyers")}
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.7}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Back to lawyers
          </button>

          <div className="mt-10 border-y border-[#d5d4cd] py-16 text-center">

            <h1 className="font-serif text-3xl">
              Lawyer not found
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#77786f]">
              Please return to the lawyer directory and select a lawyer first.
            </p>

            <button
              onClick={() => navigate("/lawyers")}
              className="mt-7 inline-flex items-center gap-2 border border-[#c8c7bf] bg-[#fbfaf7] px-5 py-3 text-sm font-medium transition hover:border-[#315d45]"
            >
              Browse lawyers

              <ArrowRight
                size={15}
                strokeWidth={1.6}
              />
            </button>

          </div>

        </main>
      </div>
    )
  }

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    if (!form.name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.")
      return
    }

    if (!form.message.trim()) {
      setError("Please describe your legal issue.")
      return
    }

    try {
      setLoading(true)

      const {
        data: {
          user,
        },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please sign in before submitting a request.")
        return
      }

      const { error: insertError } = await supabase
        .from("lawyer_requests")
       .insert({
  user_id: user.id,
  lawyer_id: lawyer.id,
  name: form.name.trim(),
  email: form.email.trim(),
  phone: form.phone.trim() || null,
  message: form.message.trim(),
  status: "pending",
})
      if (insertError) {
        throw insertError
      }

      setSuccess(true)

    } catch (err) {
      console.error(
        "Error submitting lawyer request:",
        err
      )

      setError(
        err?.message ||
          "Unable to submit your request. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  if (success) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header />

        <main className="mx-auto max-w-3xl px-6 py-12">

          <button
            onClick={() => navigate("/lawyers")}
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
          >
            <ArrowLeft
              size={15}
              strokeWidth={1.7}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Back to lawyers
          </button>

          <section className="mt-10 border-y border-[#d5d4cd] py-16">

            <div className="flex items-center gap-3">

              <CheckCircle2
                size={22}
                strokeWidth={1.6}
                className="text-[#315d45]"
              />

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#315d45]">
                Request submitted
              </p>

            </div>

            <h1 className="mt-5 font-serif text-4xl leading-tight">
              Your contact request has been submitted.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#686a62]">
              Your request for{" "}
              <span className="font-medium text-[#242520]">
                {lawyer.name}
              </span>{" "}
              has been recorded by LegalSetu.
            </p>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#686a62]">
              The request is currently pending and can be handled through the LegalSetu workflow.
            </p>

            <button
              onClick={() => navigate("/lawyers")}
              className="mt-8 inline-flex items-center gap-2 border border-[#c8c7bf] bg-[#fbfaf7] px-5 py-3 text-sm font-medium transition hover:border-[#315d45] hover:bg-white"
            >
              Back to lawyer directory

              <ArrowRight
                size={15}
                strokeWidth={1.6}
              />
            </button>

          </section>

        </main>
      </div>
    )
  }

  // --------------------------------------------------
  // FORM
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />

      <main className="mx-auto max-w-4xl px-6 py-8 sm:py-10">

        {/* Back */}

        <button
          onClick={() => navigate("/lawyers")}
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] transition hover:text-[#171815]"
        >
          <ArrowLeft
            size={15}
            strokeWidth={1.7}
            className="transition-transform duration-200 group-hover:-translate-x-1"
          />

          Back to lawyers
        </button>

        {/* Header */}

        <section className="mt-8 border-b border-[#d5d4cd] pb-10">

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            Request contact
          </p>

          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
            Contact {lawyer.name}.
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
            Send your contact details and a short description of your legal issue. Your request will be recorded in LegalSetu.
          </p>

        </section>

        {/* Lawyer summary */}

        <section className="grid gap-6 border-b border-[#d5d4cd] py-7 md:grid-cols-[1fr_260px]">

          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
              Selected lawyer
            </p>

            <h2 className="mt-2 font-serif text-3xl">
              {lawyer.name}
            </h2>

            {lawyer.specialization && (
              <p className="mt-2 text-sm leading-6 text-[#55564f]">
                {lawyer.specialization}
              </p>
            )}

          </div>

          <div className="border-l border-[#d5d4cd] pl-5">

            {lawyer.location && (
              <p className="text-sm text-[#686a62]">
                {lawyer.location}
              </p>
            )}

            {lawyer.experience_years !== null &&
              lawyer.experience_years !== undefined && (
                <p className="mt-2 text-sm text-[#686a62]">
                  {lawyer.experience_years}{" "}
                  {lawyer.experience_years === 1
                    ? "year"
                    : "years"}{" "}
                  experience
                </p>
              )}

          </div>

        </section>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="py-8"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Name */}

            <div>

              <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Your name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-2 w-full border border-[#cbc9c1] bg-[#fbfaf7] px-4 py-3 text-sm text-[#242520] outline-none transition placeholder:text-[#9c9b93] focus:border-[#315d45]"
              />

            </div>

            {/* Email */}

            <div>

              <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full border border-[#cbc9c1] bg-[#fbfaf7] px-4 py-3 text-sm text-[#242520] outline-none transition placeholder:text-[#9c9b93] focus:border-[#315d45]"
              />

            </div>

          </div>

          {/* Phone */}

          <div className="mt-6">

            <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Optional"
              className="mt-2 w-full border border-[#cbc9c1] bg-[#fbfaf7] px-4 py-3 text-sm text-[#242520] outline-none transition placeholder:text-[#9c9b93] focus:border-[#315d45]"
            />

          </div>

          {/* Message */}

          <div className="mt-6">

            <label className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
              Legal issue
            </label>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={7}
              placeholder="Briefly describe what you need help with..."
              className="mt-2 w-full resize-y border border-[#cbc9c1] bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#242520] outline-none transition placeholder:text-[#9c9b93] focus:border-[#315d45]"
            />

          </div>

          {/* Error */}

          {error && (

            <div className="mt-6 border-l-2 border-red-700 bg-[#fbfaf7] px-4 py-3">

              <p className="text-sm leading-6 text-red-700">
                {error}
              </p>

            </div>

          )}

          {/* Privacy note */}

          <div className="mt-8 flex items-start gap-3 border-t border-[#d5d4cd] pt-6">

            <ShieldCheck
              size={16}
              strokeWidth={1.6}
              className="mt-0.5 shrink-0 text-[#315d45]"
            />

            <p className="text-xs leading-5 text-[#85857d]">
              Your request is stored in LegalSetu for handling through the contact-request workflow. Do not include passwords, financial information, or other highly sensitive information.
            </p>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 inline-flex w-full items-center justify-between border border-[#315d45] bg-[#315d45] px-5 py-3.5 text-left text-sm font-medium text-white transition hover:bg-[#284e3a] disabled:cursor-not-allowed disabled:opacity-60"
          >

            <span>
              {loading
                ? "Submitting request..."
                : "Submit contact request"}
            </span>

            <ArrowRight
              size={16}
              strokeWidth={1.6}
            />

          </button>

        </form>

      </main>

    </div>
  )
}

export default LawyerRequest