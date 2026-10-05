import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  Landmark,
  Search,
  Scale,
  ShieldCheck,
  UserRound,
  LayoutDashboard,
} from "lucide-react"

import Footer from "../components/Footer"
import Header from "../components/Header"

import { processLegalProblem } from "../lib/legalPipeline"
import { supabase } from "../lib/supabase"

function Home({
  onFindHelp,
  onFindLawyer,
  onFindLegalAid,
  onApplyAid,
  onTrackApplication,
}) {
  const [problem, setProblem] = useState("")
  const [language, setLanguage] = useState("en")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        if (mounted) setIsAdmin(false)
        return
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (mounted) {
        setIsAdmin(profile?.role === "admin")
      }
    }

    checkAdmin()

    return () => {
      mounted = false
    }
  }, [])

  const isMalayalam = language === "ml"

  const handleSubmit = async () => {
    if (!problem.trim() || loading) {
      return
    }

    setError("")
    setLoading(true)

    try {
      const result = await processLegalProblem(problem.trim())

      try {
        sessionStorage.setItem(
          "legalsetu_current_result",
          JSON.stringify(result)
        )
      } catch (storageError) {
        console.warn(
          "Could not save LegalSetu result:",
          storageError
        )
      }

      onFindHelp(result)
    } catch (err) {
      console.error(err)

      setError(
        err?.message ||
          "Something went wrong while understanding your problem."
      )
    } finally {
      setLoading(false)
    }
  }

  const services = [
    {
      title: isMalayalam
        ? "അഭിഭാഷകനെ കണ്ടെത്തുക"
        : "Find a Lawyer",
      description: isMalayalam
        ? "നിങ്ങളുടെ പ്രശ്നത്തിന് അനുയോജ്യമായ നിയമ പ്രൊഫഷണലിനെ കണ്ടെത്തുക."
        : "Browse lawyers who can help with your type of problem.",
      icon: Scale,
      action: onFindLawyer,
    },
    {
      title: isMalayalam
        ? "നിയമ സഹായം കണ്ടെത്തുക"
        : "Find Legal Aid",
      description: isMalayalam
        ? "ലഭ്യമായ നിയമ സഹായ സേവനങ്ങളെക്കുറിച്ച് അറിയുക."
        : "Explore available legal-aid services.",
      icon: Landmark,
      action: onFindLegalAid,
    },
    {
      title: isMalayalam
        ? "സൗജന്യ നിയമ സഹായത്തിന് അപേക്ഷിക്കുക"
        : "Apply for Free Legal Aid",
      description: isMalayalam
        ? "നിയമ സഹായത്തിനായുള്ള അപേക്ഷ ആരംഭിക്കുക."
        : "Start your legal-aid application.",
      icon: FileText,
      action: onApplyAid,
    },
    {
      title: isMalayalam
        ? "അപേക്ഷയുടെ നില പരിശോധിക്കുക"
        : "Track Application",
      description: isMalayalam
        ? "നിങ്ങളുടെ അപേക്ഷയുടെ നിലവിലെ സ്ഥിതി പരിശോധിക്കുക."
        : "Check the status of your application.",
      icon: ClipboardCheck,
      action: onTrackApplication,
    },
  ]

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6">

        {/* INTRO */}
        <section className="grid gap-10 border-b border-[#d5d4cd] py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#315d45]" />

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
                {isMalayalam
                  ? "നിയമ സഹായത്തിലേക്കുള്ള വഴി"
                  : "A clearer route to legal help"}
              </p>
            </div>

            <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              {isMalayalam
                ? "നിങ്ങളുടെ നിയമ പ്രശ്നം എവിടെ നിന്ന് തുടങ്ങണമെന്ന് അറിയില്ലേ?"
                : "Not sure where to start with a legal problem?"}
            </h1>
          </div>

          <div className="max-w-md">
            <p className="text-[15px] leading-7 text-[#686a62]">
              {isMalayalam
                ? "നിങ്ങളുടെ പ്രശ്നം സാധാരണ വാക്കുകളിൽ വിശദീകരിക്കൂ. LegalSetu അത് മനസ്സിലാക്കി പ്രസക്തമായ ഔദ്യോഗിക വിവരങ്ങളും അടുത്ത ഘട്ടങ്ങളും കണ്ടെത്താൻ സഹായിക്കും."
                : "Describe what happened in ordinary language. LegalSetu helps organize the situation, find relevant official information, and point you toward the next practical step."}
            </p>

            <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#77786f]">
              <ShieldCheck size={14} strokeWidth={1.6} />

              <span>
                {isMalayalam
                  ? "പൊതു വിവരങ്ങൾ മാത്രം"
                  : "General information, not legal advice"}
              </span>
            </div>
          </div>
        </section>

        {/* MAIN WORK AREA */}
        <section className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_290px]">

          {/* PROBLEM INPUT */}
          <div className="border border-[#d1d0c9] bg-[#fbfaf7]">
            <div className="flex items-center justify-between border-b border-[#deddd7] px-6 py-4">
              <div className="flex items-center gap-3">
                <Search
                  size={17}
                  strokeWidth={1.7}
                  className="text-[#315d45]"
                />

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#666861]">
                    01 / Your situation
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#22231f]">
                    {isMalayalam
                      ? "എന്താണ് സംഭവിച്ചത്?"
                      : "What happened?"}
                  </p>
                </div>
              </div>

              <p className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-[#99988f] sm:block">
                Start here
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <label
                htmlFor="legal-problem"
                className="sr-only"
              >
                Describe your legal problem
              </label>

              <textarea
                id="legal-problem"
                value={problem}
                onChange={(event) =>
                  setProblem(event.target.value)
                }
                disabled={loading}
                rows={8}
                placeholder={
                  isMalayalam
                    ? "ഉദാഹരണം: എന്റെ വീട്ടുടമ മുന്നറിയിപ്പൊന്നുമില്ലാതെ എന്നെ വീട്ടിൽ നിന്ന് പുറത്താക്കി..."
                    : "Example: My landlord kicked me out of the house without any warning..."
                }
                className="w-full resize-none border-0 bg-transparent px-0 py-0 font-serif text-2xl leading-9 text-[#171815] outline-none placeholder:text-[#9b9a92] disabled:cursor-not-allowed disabled:opacity-60"
              />

              {error && (
                <div className="mt-6 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-3">
                  <p className="text-sm leading-6 text-[#71352f]">
                    {error}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-4 border-t border-[#deddd7] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-md text-xs leading-5 text-[#7b7c74]">
                  {isMalayalam
                    ? "നിയമ പദങ്ങൾ അറിയേണ്ടതില്ല. സംഭവിച്ചത് പോലെ തന്നെ എഴുതുക."
                    : "You do not need legal terminology. Write the situation the way you would explain it to another person."}
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !problem.trim()}
                  className="group inline-flex shrink-0 items-center justify-center gap-3 bg-[#315d45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      {isMalayalam
                        ? "മനസ്സിലാക്കുന്നു..."
                        : "Understanding..."}
                    </>
                  ) : (
                    <>
                      {isMalayalam
                        ? "നിയമ സഹായം കണ്ടെത്തുക"
                        : "Find Legal Help"}

                      <ArrowRight
                        size={17}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <aside className="border-t-2 border-[#315d45] pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              How it works
            </p>

            <div className="mt-5">
              <div>
                <p className="font-serif text-xl leading-tight text-[#171815]">
                  Tell us what happened.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#70716a]">
                  Describe the situation in your own words.
                </p>
              </div>

              <div className="mt-6 border-t border-[#deddd7] pt-5">
                <p className="font-serif text-xl leading-tight text-[#171815]">
                  Answer a few questions.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#70716a]">
                  LegalSetu asks simple follow-up questions to understand the situation better.
                </p>
              </div>

              <div className="mt-6 border-t border-[#deddd7] pt-5">
                <p className="font-serif text-xl leading-tight text-[#171815]">
                  Review relevant sources.
                </p>

                <p className="mt-2 text-sm leading-6 text-[#70716a]">
                  Retrieved information is connected to its official source.
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* SERVICES */}
        <section className="border-t border-[#d9d8d2] py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
                Services
              </p>

              <h2 className="mt-2 font-serif text-3xl tracking-[-0.02em] text-[#171815]">
                Choose your next step
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-[#74756e]">
              Browse the main ways LegalSetu can help you move forward.
            </p>
          </div>

          <div className="mt-7 grid border-y border-[#d1d0c9] sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <button
                  key={service.title}
                  onClick={service.action}
                  className={[
                    "group min-h-[190px] p-6 text-left transition hover:bg-[#eeede8] sm:p-7",
                    index % 2 === 0
                      ? "sm:border-r sm:border-[#d1d0c9]"
                      : "",
                    index < 2
                      ? "border-b border-[#d1d0c9]"
                      : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      size={21}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={17}
                      strokeWidth={1.6}
                      className="text-[#a0a098] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />
                  </div>

                  <div className="mt-10">
                    <h3 className="font-serif text-2xl tracking-[-0.02em] text-[#171815]">
                      {service.title}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#77786f]">
                      {service.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* USER / ADMIN WORKSPACE */}
        <section className="border-t border-[#d9d8d2] py-10">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Your workspace
            </p>

            <h2 className="font-serif text-3xl tracking-[-0.02em]">
              Manage your LegalSetu activity
            </h2>
          </div>

          <div
            className={[
              "mt-7 grid gap-4",
              isAdmin
                ? "lg:grid-cols-2"
                : "max-w-xl",
            ].join(" ")}
          >
            {/* My Lawyer Requests */}
            <button
              onClick={() =>
                navigate("/my-lawyer-requests")
              }
              className="group flex min-h-[145px] items-center justify-between border border-[#d1d0c9] bg-[#fbfaf7] p-6 text-left transition hover:border-[#315d45] hover:bg-[#eeede8] sm:p-7"
            >
              <div className="flex items-start gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cfd4ce] bg-[#edf3ee] text-[#315d45]">
                  <UserRound
                    size={19}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                    Personal
                  </p>

                  <h3 className="mt-2 font-serif text-2xl">
                    My Lawyer Requests
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-[#77786f]">
                    View the lawyers you have contacted and check their request status.
                  </p>
                </div>
              </div>

              <ArrowRight
                size={18}
                strokeWidth={1.6}
                className="ml-4 shrink-0 text-[#9a9a92] transition group-hover:translate-x-1 group-hover:text-[#315d45]"
              />
            </button>

            {/* Admin Dashboard */}
            {isAdmin && (
              <button
                onClick={() =>
                  navigate("/admin")
                }
                className="group flex min-h-[145px] items-center justify-between border border-[#d1d0c9] bg-[#fbfaf7] p-6 text-left transition hover:border-[#315d45] hover:bg-[#eeede8] sm:p-7"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#cfd4ce] bg-[#edf3ee] text-[#315d45]">
                    <LayoutDashboard
                      size={19}
                      strokeWidth={1.6}
                    />
                  </div>

                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                      Administration
                    </p>

                    <h3 className="mt-2 font-serif text-2xl">
                      Admin Dashboard
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-[#77786f]">
                      Track applications and manage lawyer contact requests.
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={18}
                  strokeWidth={1.6}
                  className="ml-4 shrink-0 text-[#9a9a92] transition group-hover:translate-x-1 group-hover:text-[#315d45]"
                />
              </button>
            )}
          </div>
        </section>

        {/* DISCLAIMER */}
        <section className="flex flex-col gap-4 border-t border-[#d9d8d2] py-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={17}
              strokeWidth={1.6}
              className="mt-0.5 shrink-0 text-[#315d45]"
            />

            <p className="max-w-2xl text-xs leading-5 text-[#7b7c74]">
              LegalSetu helps organize legal problems and discover relevant legal resources. It does not replace advice from a qualified legal professional.
            </p>
          </div>

          <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#9b9a92]">
            Kerala · India
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home
