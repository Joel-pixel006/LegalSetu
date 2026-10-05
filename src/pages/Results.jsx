import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  ExternalLink,
  FileText,
  Landmark,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"

import {
  processClarifiedProblem,
} from "../lib/legalPipeline"


const RESULT_STORAGE_KEY =
  "legalsetu_current_result"

const ANSWERS_STORAGE_KEY =
  "legalsetu_current_answers"

const CLARIFIED_STORAGE_KEY =
  "legalsetu_clarified_result"

const CLARIFIED_PROBLEM_STORAGE_KEY =
  "legalsetu_clarified_problem"



function normalizeSourceUrl(url) {
  if (typeof url !== "string") {
    return ""
  }

  const cleaned = url.trim()

  const marker = cleaned.search(
    /Section(?:%20|\s)*Reference\s*:/i
  )

  if (marker !== -1) {
    return cleaned.slice(0, marker).trim()
  }

  return cleaned
}

function Results({
  result,
  onBack,
}) {
  const navigate = useNavigate()

  // Always open the Results page at the top.
  // This also handles returning here from Lawyers / Legal Aid,
  // where the pathname is still /results.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    })
  }, [])

  // --------------------------------------------------
  // State
  // --------------------------------------------------

  const [storedResult, setStoredResult] =
    useState(null)

  const [answers, setAnswers] =
    useState({})

  const [clarifiedResult, setClarifiedResult] =
    useState(null)

  const [clarifying, setClarifying] =
    useState(false)

  const [clarifyError, setClarifyError] =
    useState("")


  // --------------------------------------------------
  // Restore state after refresh
  // --------------------------------------------------

  useEffect(() => {
    // A final Results history entry must restore the final result,
    // even if React Router supplies the original result prop again.
    const isFinalHistoryEntry =
      window.history.state?.legalSetuStage ===
      "final"

    if (result && !isFinalHistoryEntry) {
      return
    }

    let restoredResult = null

    try {
      const savedResult =
        sessionStorage.getItem(
          RESULT_STORAGE_KEY
        )

      if (savedResult) {
        restoredResult =
          JSON.parse(savedResult)

        setStoredResult(
          restoredResult
        )
      }
    } catch (error) {
      console.error(
        "Could not restore result:",
        error
      )
    }

    const restoredProblem =
      restoredResult?.problem?.trim() ||
      ""

    try {
      const savedAnswers =
        sessionStorage.getItem(
          ANSWERS_STORAGE_KEY
        )

      if (savedAnswers) {
        setAnswers(
          JSON.parse(savedAnswers)
        )
      }
    } catch (error) {
      console.error(
        "Could not restore answers:",
        error
      )
    }

    try {
      const savedClarified =
        sessionStorage.getItem(
          CLARIFIED_STORAGE_KEY
        )

      const savedClarifiedProblem =
        sessionStorage.getItem(
          CLARIFIED_PROBLEM_STORAGE_KEY
        )

      if (
        restoredProblem &&
        savedClarified &&
        savedClarifiedProblem &&
        restoredProblem ===
          savedClarifiedProblem.trim()
      ) {
        setClarifiedResult(
          JSON.parse(savedClarified)
        )

        // Keep the final stage represented in browser history after
        // a refresh so browser Back can return to the questions.
        if (
          window.history.state?.legalSetuStage !==
          "final"
        ) {
          window.history.replaceState(
            {
              ...(window.history.state || {}),
              legalSetuStage: "final",
            },
            "",
            window.location.href
          )
        }
      } else if (savedClarified || savedClarifiedProblem) {
        sessionStorage.removeItem(
          CLARIFIED_STORAGE_KEY
        )

        sessionStorage.removeItem(
          CLARIFIED_PROBLEM_STORAGE_KEY
        )
      }
    } catch (error) {
      console.error(
        "Could not restore clarified result:",
        error
      )
    }
  }, [result])


  // --------------------------------------------------
  // Save incoming result
  // --------------------------------------------------

  useEffect(() => {
    if (!result) {
      return
    }

    // Returning from Lawyers / Legal Aid lands on the final Results
    // history entry. Do not reset the final result back to questions.
    if (
      window.history.state?.legalSetuStage ===
      "final"
    ) {
      return
    }

    setStoredResult(result)

    // A new problem starts a new clarification stage.
    // Clear answers and final results from the previous problem.
    setAnswers({})
    setClarifiedResult(null)
    setClarifyError("")

    try {
      sessionStorage.setItem(
        RESULT_STORAGE_KEY,
        JSON.stringify(result)
      )

      sessionStorage.removeItem(
        ANSWERS_STORAGE_KEY
      )

      sessionStorage.removeItem(
        CLARIFIED_STORAGE_KEY
      )

      sessionStorage.removeItem(
        CLARIFIED_PROBLEM_STORAGE_KEY
      )
    } catch (error) {
      console.error(
        "Could not save result:",
        error
      )
    }
  }, [result])


  // --------------------------------------------------
  // Save answers
  // --------------------------------------------------

  useEffect(() => {
    try {
      sessionStorage.setItem(
        ANSWERS_STORAGE_KEY,
        JSON.stringify(answers)
      )
    } catch (error) {
      console.error(
        "Could not save answers:",
        error
      )
    }
  }, [answers])


  // --------------------------------------------------
  // Active result
  // --------------------------------------------------

  const activeResult =
    result || storedResult

  // Always open Results at the top. This also fixes the browser
  // restoring the previous scroll position after returning from
  // Lawyers or Legal Aid.
  useEffect(() => {
    const previousRestoration =
      window.history.scrollRestoration

    window.history.scrollRestoration =
      "manual"

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      })
    }

    scrollToTop()

    const frame = window.requestAnimationFrame(
      scrollToTop
    )

    return () => {
      window.cancelAnimationFrame(frame)

      window.history.scrollRestoration =
        previousRestoration
    }
  }, [activeResult, clarifiedResult])

  // --------------------------------------------------
  // Initial classification
  // --------------------------------------------------

  const problem =
    activeResult?.problem || ""

  const initialClassification =
    activeResult?.classification || {}

  const questions =
    Array.isArray(
      initialClassification.questions
    )
      ? initialClassification.questions
      : []

  // --------------------------------------------------
  // Final classification
  // --------------------------------------------------

  const classification =
    clarifiedResult?.clarified ||
    initialClassification

  const resources =
    Array.isArray(
      clarifiedResult?.resources
    )
      ? clarifiedResult.resources
      : []

  const ragAnswer =
    clarifiedResult?.ragAnswer ||
    null

  const category =
    classification?.category ||
    "other"

  const urgency =
    classification?.urgency ||
    "normal"

  const summary =
    classification?.summary ||
    "Your situation has been classified for routing purposes."

  // --------------------------------------------------
  // Save final result
  // --------------------------------------------------

  useEffect(() => {
    if (!clarifiedResult) {
      return
    }

    try {
      sessionStorage.setItem(
        CLARIFIED_STORAGE_KEY,
        JSON.stringify(
          clarifiedResult
        )
      )

      sessionStorage.setItem(
        CLARIFIED_PROBLEM_STORAGE_KEY,
        problem.trim()
      )
    } catch (error) {
      console.error(
        "Could not save clarified result:",
        error
      )
    }
  }, [clarifiedResult])


  // --------------------------------------------------
  // Format helpers
  // --------------------------------------------------

  const formatCategory = (
    value
  ) => {
    if (!value) {
      return "Other"
    }

    return String(value)
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      )
  }


  const formatUrgency = (
    value
  ) => {
    if (!value) {
      return "Normal"
    }

    return String(value).replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase()
    )
  }


  const getSourceForPoint = (point, index) => {
    const sourceIndex =
      Number.isInteger(point?.source_index)
        ? point.source_index
        : index

    const cleanedSource =
      ragAnswer?.sources?.[sourceIndex]

    const rawSource =
      resources?.[sourceIndex]

    return {
      title:
        cleanedSource?.title ||
        rawSource?.title ||
        point?.title ||
        "Official source",

      source_name:
        cleanedSource?.source_name ||
        rawSource?.source_name ||
        "Official source",

      source_url: normalizeSourceUrl(
        cleanedSource?.source_url ||
        rawSource?.source_url ||
        ""
      ),
    }
  }

  // --------------------------------------------------
  // Documents
  // --------------------------------------------------

  const documents =
    useMemo(() => {
      if (
        Array.isArray(
          ragAnswer?.documents
        ) &&
        ragAnswer.documents.length >
          0
      ) {
        return ragAnswer.documents
      }


      const text =
        `${problem} ${summary}`.toLowerCase()


      const rentalCase =
        /landlord|tenant|rent|rental|lease|house|property|evict|eviction|kicked out|lockout|deposit|tenancy/.test(
          text
        )


      if (rentalCase) {
        const list = [
          {
            title:
              "Rental agreement / lease agreement",

            description:
              "Keep the agreement or any written terms that describe the tenancy.",
          },

          {
            title:
              "Proof of rent payments",

            description:
              "Keep receipts, bank transfers, UPI records, or other payment records.",
          },

          {
            title:
              "Communication with the landlord",

            description:
              "Keep relevant messages, emails, letters, or other written communication.",
          },

          {
            title:
              "Evidence related to the removal",

            description:
              "Keep photographs, messages, notices, or other records connected to the removal or lockout.",
          },

          {
            title:
              "Witness information",

            description:
              "Keep the names and contact details of people who directly witnessed the situation.",
          },
        ]


        if (
          text.includes(
            "deposit"
          )
        ) {
          list.push({
            title:
              "Security deposit payment proof",

            description:
              "Keep the receipt, bank transfer, UPI record, or other proof of the deposit payment.",
          })
        }


        list.push({
          title:
            "Identity and address proof",

          description:
            "Keep documents that may be required when submitting a legal-aid or service request.",
        })


        return list
      }


      return [
        {
          title:
            "Relevant agreements or documents",

          description:
            "Keep documents connected to the situation you described.",
        },

        {
          title:
            "Payment or transaction records",

          description:
            "Keep receipts, bank records, invoices, or other proof of transactions where relevant.",
        },

        {
          title:
            "Written communication",

          description:
            "Keep relevant messages, emails, notices, letters, or other written records.",
        },

        {
          title:
            "Identity and supporting records",

          description:
            "Keep identification and other documents that help establish the facts.",
        },
      ]
    }, [
      ragAnswer,
      problem,
      summary,
    ])


  // --------------------------------------------------
  // ISSUE-SPECIFIC NEXT STEPS
  // --------------------------------------------------

  const nextSteps = useMemo(() => {
    const text = `${problem} ${summary} ${category}`.toLowerCase()

    const isRental =
      /landlord|tenant|rent|rental|lease|evict|eviction|lockout|tenancy|security deposit/.test(text)

    const isCyber =
      /upi|cyber|online fraud|online scam|scam|fraud|phishing|otp|bank transfer|digital payment|transaction id/.test(text)

    const isConsumer =
      /consumer|seller|shop|product|service|refund|warranty|defective|defect|online order|purchase|customer/.test(text)

    const isDomesticViolence =
      /domestic violence|husband|wife|spouse|threaten|threatening|physically hurting|physical abuse|beating|abuse|dowry harassment/.test(text) &&
      (category.toLowerCase() === "family" || /violence|abuse|threaten|hurting|beating|dowry/.test(text))

    const isFamily =
      category.toLowerCase() === "family" ||
      /spouse|husband|wife|child|children|maintenance|financial support|divorce|marriage|custody|family/.test(text)

    const isLegalAid =
      /legal aid|cannot afford|can't afford|free lawyer|free legal help/.test(text)

    if (isDomesticViolence) {
      return [
        {
          title: "Keep a record of the incidents",
          description: "Keep messages, photographs, medical records, complaints, financial records, and other evidence connected to the threats or abuse. Store important records somewhere safe.",
        },
        {
          title: "Review the available legal protections",
          description: resources.length > 0
            ? "Read the information retrieved for your situation and open the official sources to understand the protections and legal remedies that may apply."
            : "Review the information currently available in LegalSetu and note any questions that still need clarification.",
        },
        {
          title: "Consider legal support",
          description: "You can explore free legal aid or find a lawyer through LegalSetu if you need help understanding or pursuing your options. If you are in immediate danger, prioritize your safety and contact appropriate emergency or support services.",
        },
        {
          title: "Keep track of what happens next",
          description: "Record important dates, complaints, medical visits, applications, and other actions you take so you have a clear history of the situation.",
        },
      ]
    }

    if (isCyber) {
      return [
        {
          title: "Preserve the transaction evidence",
          description: "Keep the transaction ID, bank or UPI records, screenshots, messages, phone numbers, emails, and other details connected to the fraud. Do not delete the original records.",
        },
        {
          title: "Report the financial fraud promptly",
          description: resources.length > 0
            ? "Review the official cyber-fraud information retrieved above and use the source links for the reporting process and relevant government guidance."
            : "Review the information currently available in LegalSetu and note the official reporting options.",
        },
        {
          title: "Keep your complaint details",
          description: "Save the complaint or acknowledgement number, transaction details, and copies of anything you submit so you can refer back to them later.",
        },
        {
          title: "Get legal help if you need it",
          description: "If you need help understanding the legal options or recovering from the dispute, you can explore legal aid or find a lawyer through LegalSetu.",
        },
      ]
    }

    if (isRental) {
      return [
        {
          title: "Keep your tenancy records together",
          description: "Keep your rental or lease agreement, rent-payment records, security-deposit proof, communication with the landlord, and other records connected to the dispute.",
        },
        {
          title: "Review the relevant official information",
          description: resources.length > 0
            ? "Read the information retrieved for your situation and use the source links to open the complete official material."
            : "Review the information currently available and note any questions that still need clarification.",
        },
        {
          title: "Choose the support route you need",
          description: "You can explore legal-aid services or browse the lawyer directory if you want help understanding or pursuing the dispute.",
        },
        {
          title: "Keep documenting the dispute",
          description: "Keep important messages, notices, payment records, photographs, and other evidence as the situation develops. These records can help establish what happened.",
        },
      ]
    }

    if (isConsumer) {
      return [
        {
          title: "Keep your purchase records",
          description: "Keep invoices, receipts, order details, warranty documents, payment records, photographs, and other records showing the product or service and what went wrong.",
        },
        {
          title: "Keep your communication with the seller",
          description: "Save emails, messages, complaint numbers, refund requests, and replies from the seller or service provider.",
        },
        {
          title: "Review the consumer information",
          description: resources.length > 0
            ? "Read the information retrieved above and open the official sources to understand the available consumer grievance mechanisms."
            : "Review the information currently available in LegalSetu and note any questions that still need clarification.",
        },
        {
          title: "Consider legal or consumer support",
          description: "If the issue is not resolved, you can explore available legal-aid services or find a lawyer through LegalSetu for further assistance.",
        },
      ]
    }

    if (isFamily) {
      return [
        {
          title: "Keep the relevant family records together",
          description: "Keep agreements, identity records, financial documents, payment records, messages, notices, and other documents connected to the family dispute.",
        },
        {
          title: "Review the relevant legal information",
          description: resources.length > 0
            ? "Read the information retrieved for your situation and open the official sources to understand the relevant legal framework and available services."
            : "Review the information currently available and note any questions that still need clarification.",
        },
        {
          title: "Consider legal aid or a lawyer",
          description: isLegalAid
            ? "Since you indicated that affordability is a concern, explore LegalSetu's legal-aid options to see whether you may qualify for assistance."
            : "You can explore free legal aid or browse the lawyer directory if you need help understanding or pursuing your options.",
        },
        {
          title: "Keep a clear record of important events",
          description: "Keep track of important dates, communications, payments, applications, and other actions related to the situation.",
        },
      ]
    }

    return [
      {
        title: "Gather the relevant documents",
        description: "Keep the records connected to your situation together in one place. These may include agreements, payment records, messages, notices, photographs, or other supporting documents.",
      },
      {
        title: "Review the information above",
        description: resources.length > 0
          ? "Read through the relevant information and open the official source links to see the complete material behind the information shown here."
          : "Review the information currently available in LegalSetu and note any details that may need further clarification.",
      },
      {
        title: "Choose how you want to get help",
        description: "You can explore the available legal-aid services or look through the lawyer directory to decide which route fits your needs.",
      },
      {
        title: "Keep a clear record of what happens next",
        description: "Save important communications and documents as your situation develops. If you submit a request through LegalSetu, keep the application details so you can refer back to them later.",
      },
    ]
  }, [
    category,
    problem,
    resources,
    summary,
  ])


  // --------------------------------------------------
  // Back
  // --------------------------------------------------

  const clearClarifiedResult = () => {
    setClarifiedResult(null)
    setClarifyError("")

    try {
      sessionStorage.removeItem(
        CLARIFIED_STORAGE_KEY
      )

      sessionStorage.removeItem(
        CLARIFIED_PROBLEM_STORAGE_KEY
      )
    } catch (error) {
      console.error(
        "Could not clear clarified result:",
        error
      )
    }
  }


  const handleBack = () => {
    // When the final result is visible, return to the clarification
    // questions without leaving the Results page.
    if (clarifiedResult) {
      if (
        window.history.state?.legalSetuStage ===
        "final"
      ) {
        clearClarifiedResult()
        window.history.back()
        return
      }

      clearClarifiedResult()
      return
    }

    if (
      typeof onBack ===
      "function"
    ) {
      onBack()
      return
    }

    navigate(-1)
  }


  // --------------------------------------------------
  // Continue
  // --------------------------------------------------

  const handleContinue = async () => {
    if (clarifying) {
      return
    }


    setClarifying(true)

    setClarifyError("")


    try {
      const answerPayload = {}


      questions.forEach(
        (
          question,
          index
        ) => {
          const answer =
            answers[index]?.trim()

          if (answer) {
            answerPayload[
              question
            ] = answer
          }
        }
      )


      const finalResult =
        await processClarifiedProblem(
          problem,
          answerPayload
        )


      console.log(
        "Clarified result:",
        finalResult
      )

      // Create a separate history entry for the final Results state.
      // The URL stays /results, but Back can now distinguish the
      // final result from the earlier clarification state.
      window.history.pushState(
        {
          ...(window.history.state || {}),
          legalSetuStage: "final",
        },
        "",
        window.location.href
      )

      setClarifiedResult(
        finalResult
      )

    } catch (error) {
      console.error(error)

      setClarifyError(
        error?.message ||
          "Unable to analyze your answers."
      )

    } finally {
      setClarifying(false)
    }
  }


  // --------------------------------------------------
  // No active result
  // --------------------------------------------------

  if (!activeResult) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header />

        <main className="mx-auto max-w-5xl px-6 py-16">

          <div className="border-t-2 border-[#315d45] pt-6">

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              LegalSetu
            </p>

            <h1 className="mt-4 font-serif text-4xl tracking-[-0.03em]">
              No active legal problem
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#70716a]">
              Start from the home page to describe a legal problem.
            </p>

            <button
              onClick={() =>
                navigate("/")
              }
              className="mt-7 inline-flex items-center gap-2 bg-[#315d45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#254b37]"
            >
              Start again

              <ArrowRight
                size={16}
              />
            </button>

          </div>

        </main>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />


      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">

        {/* ==========================================
            BACK
        ========================================== */}

        <button
          onClick={handleBack}
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
            TITLE
        ========================================== */}

        <section className="mt-8 grid gap-8 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_290px]">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Your legal help
            </p>


            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1] tracking-[-0.035em] sm:text-6xl">
              A clearer view of your situation.
            </h1>


            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
              We organized the information you provided and matched it against the legal resources available to LegalSetu.
            </p>

          </div>


          <div className="border-l border-[#d5d4cd] pl-5">

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={16}
                strokeWidth={1.6}
                className="text-[#315d45]"
              />

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Routing only
              </p>

            </div>


            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              LegalSetu provides general information and helps connect users with legal services. It does not provide legal advice.
            </p>

          </div>

        </section>


        {/* ==========================================
            PAGE GRID
        ========================================== */}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">


          {/* ========================================
              LEFT
          ======================================== */}

          <div className="min-w-0 space-y-10 pt-8">


            {/* ======================================
                01 YOUR SITUATION
            ====================================== */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Your situation
                </p>

                <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                  What we understood
                </h2>

              </div>


              <div className="mt-5">

                <p className="font-serif text-2xl leading-9 text-[#22231f]">
                  “{problem}”
                </p>


                <p className="mt-6 max-w-3xl text-sm leading-7 text-[#666861]">
                  {summary}
                </p>


                <div className="mt-7 grid border-y border-[#d9d8d2] sm:grid-cols-2">

                  <div className="border-b border-[#d9d8d2] px-1 py-4 sm:border-b-0 sm:border-r">

                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                      Category
                    </p>

                    <p className="mt-2 font-serif text-xl">
                      {formatCategory(
                        category
                      )}
                    </p>

                  </div>


                  <div className="px-1 py-4 sm:pl-5">

                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                      Urgency
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <Clock3
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#315d45]"
                      />

                      <p className="font-serif text-xl">
                        {formatUrgency(
                          urgency
                        )}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* ======================================
                QUESTIONS
            ====================================== */}

            {!clarifiedResult &&
              questions.length >
                0 && (
                <section id="clarification-section">

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                      02 / A little more detail
                    </p>

                    <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                      What we still need to know
                    </h2>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#73746d]">
                      A few answers help narrow down the situation before relevant information is shown.
                    </p>

                  </div>


                  <div className="mt-6 border-y border-[#d9d8d2]">

                    {questions.map(
                      (
                        question,
                        index
                      ) => (

                        <div
                          key={
                            `${question}-${index}`
                          }
                          className="border-b border-[#d9d8d2] py-6 last:border-b-0"
                        >

                          <div className="flex gap-4">

                            <span className="font-mono text-[10px] text-[#9a9a91]">
                              {String(
                                index + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </span>


                            <div className="min-w-0 flex-1">

                              <label className="font-serif text-xl leading-7 text-[#22231f]">
                                {question}
                              </label>


                              <textarea
                                value={
                                  answers[
                                    index
                                  ] || ""
                                }
                                onChange={(
                                  event
                                ) => {
                                  const value =
                                    event.target.value

                                  setAnswers(
                                    (
                                      current
                                    ) => ({
                                      ...current,
                                      [index]:
                                        value,
                                    })
                                  )
                                }}
                                placeholder="Write your answer here..."
                                rows={3}
                                disabled={
                                  clarifying
                                }
                                className="mt-4 w-full resize-none border-b border-[#bbb9b0] bg-transparent px-0 py-3 text-sm leading-6 text-[#262722] outline-none placeholder:text-[#a2a199] focus:border-[#315d45] disabled:cursor-not-allowed disabled:opacity-60"
                              />

                            </div>

                          </div>

                        </div>

                      )
                    )}

                  </div>


                  <button
                    onClick={
                      handleContinue
                    }
                    disabled={
                      clarifying
                    }
                    className="group mt-7 inline-flex items-center gap-3 bg-[#315d45] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    {clarifying
                      ? "Reviewing your answers..."
                      : "Continue"}

                    {!clarifying && (
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    )}

                  </button>


                  {clarifyError && (
                    <div className="mt-5 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-3">

                      <p className="text-sm leading-6 text-[#71352f]">
                        {clarifyError}
                      </p>

                    </div>
                  )}

                </section>
              )}


            {/* ======================================
                FINAL RESULTS
            ====================================== */}

            {clarifiedResult && (
              <>

                {/* =================================
                    02 RELEVANT INFORMATION
                ================================== */}

                <section>

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                      02 / Relevant information
                    </p>

                    <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                      What the sources say
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73746d]">
                      Information below comes from the resources retrieved for this situation.
                    </p>

                  </div>


                  <div className="mt-6 border-y border-[#d9d8d2]">

                    {ragAnswer?.relevant_information ? (
                      <>

                        <div className="py-6">

                          <h3 className="font-serif text-2xl tracking-[-0.015em]">

                            {
                              ragAnswer
                                .relevant_information
                                .headline
                            }

                          </h3>


                          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#62645d]">

                            {
                              ragAnswer
                                .relevant_information
                                .summary
                            }

                          </p>

                        </div>


                        {Array.isArray(
                          ragAnswer
                            .relevant_information
                            .key_points
                        ) &&
                          ragAnswer
                            .relevant_information
                            .key_points
                            .length >
                            0 && (

                            <div className="border-t border-[#d9d8d2]">

                              {ragAnswer.relevant_information.key_points.map(
                                (
                                  point,
                                  index
                                ) => {

                                  const source =
                                    getSourceForPoint(
                                      point,
                                      index
                                    )

                                  return (
                                    <div
                                      key={
                                        `${point?.title || "point"}-${index}`
                                      }
                                      className="grid gap-4 border-b border-[#d9d8d2] py-6 last:border-b-0 sm:grid-cols-[38px_minmax(0,1fr)]"
                                    >

                                      <div className="flex h-7 w-7 items-center justify-center border border-[#c9c8c0] font-mono text-[9px] text-[#666861]">

                                        {String(
                                          index + 1
                                        ).padStart(
                                          2,
                                          "0"
                                        )}

                                      </div>


                                      <div>

                                        <h3 className="font-serif text-xl text-[#22231f]">
                                          {
                                            point?.title
                                          }
                                        </h3>


                                        <p className="mt-2 text-sm leading-7 text-[#686a62]">
                                          {
                                            point?.explanation
                                          }
                                        </p>


                                        {source?.source_url && (

                                          <a
                                            href={
                                              source.source_url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#315d45] transition hover:text-[#171815]"
                                          >

                                            {
                                              source.source_name ||
                                              "Official source"
                                            }

                                            <ExternalLink
                                              size={
                                                12
                                              }
                                              strokeWidth={
                                                1.7
                                              }
                                            />

                                          </a>

                                        )}

                                      </div>

                                    </div>
                                  )
                                }
                              )}

                            </div>

                          )}

                      </>
                    ) : (

                      <div className="py-8">

                        <p className="text-sm text-[#76776f]">
                          No relevant information was returned from the retrieved resources.
                        </p>

                      </div>

                    )}

                  </div>


                  {/* Official sources */}

                  {resources.length >
                    0 && (

                    <div className="mt-7">

                      <div className="flex items-center justify-between">

                        <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#888880]">
                          Official sources
                        </p>

                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a09f96]">
                          {resources.length} retrieved
                        </p>

                      </div>


                      <div className="mt-3 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                        {resources.map(
                          (
                            resource,
                            index
                          ) => {
                            const source = {
                              title:
                                ragAnswer?.sources?.[index]?.title ||
                                resource?.title ||
                                "Official source",
                              source_name:
                                ragAnswer?.sources?.[index]?.source_name ||
                                resource?.source_name ||
                                "Official source",
                              source_url: normalizeSourceUrl(
                                ragAnswer?.sources?.[index]?.source_url ||
                                resource?.source_url ||
                                ""
                              ),
                            }

                            return (

                            <div
                              key={
                                resource.id ||
                                index
                              }
                              className="flex items-center justify-between gap-5 py-4"
                            >

                              <div className="min-w-0">

                                <p className="text-sm font-medium text-[#242520]">
                                  {
                                    source.title
                                  }
                                </p>


                                <p className="mt-1 text-xs text-[#82837b]">
                                  {
                                    source.source_name ||
                                    "Official source"
                                  }
                                </p>

                              </div>


                              {source.source_url && (

                                <a
                                  href={
                                    source.source_url
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Open official source"
                                  className="shrink-0 text-[#6b6c64] transition hover:text-[#315d45]"
                                >

                                  <ExternalLink
                                    size={
                                      16
                                    }
                                    strokeWidth={
                                      1.6
                                    }
                                  />

                                </a>

                              )}

                            </div>

                            )
                          })}

                      </div>

                    </div>

                  )}

                </section>


                {/* =================================
                    03 DOCUMENTS
                ================================== */}

                <section>

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                      03 / Documents that may be useful
                    </p>


                    <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                      Keep these ready
                    </h2>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73746d]">
                      These are practical records that may help when explaining or documenting your situation.
                    </p>

                  </div>


                  <div className="mt-6 border-y border-[#d9d8d2]">

                    {documents.map(
                      (
                        document,
                        index
                      ) => (

                        <div
                          key={
                            `${document.title}-${index}`
                          }
                          className="grid gap-4 border-b border-[#d9d8d2] py-5 last:border-b-0 sm:grid-cols-[34px_minmax(0,1fr)_20px]"
                        >

                          <div className="flex h-7 w-7 items-center justify-center border border-[#cecdc6]">

                            <FileText
                              size={14}
                              strokeWidth={1.5}
                              className="text-[#315d45]"
                            />

                          </div>


                          <div>

                            <h3 className="font-serif text-lg text-[#22231f]">
                              {
                                document.title
                              }
                            </h3>


                            <p className="mt-1.5 text-sm leading-6 text-[#77786f]">
                              {
                                document.description
                              }
                            </p>

                          </div>


                          <span className="text-right font-mono text-[9px] text-[#9b9a91]">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </span>

                        </div>

                      )
                    )}

                  </div>

                </section>


                {/* =================================
                    04 WHAT YOU CAN DO NEXT
                ================================== */}

                <section>

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                      04 / What you can do next
                    </p>


                    <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                      A practical path forward
                    </h2>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73746d]">
                      These are general steps to help you move from understanding the situation to deciding what kind of support you need.
                    </p>

                  </div>


                  <div className="mt-6 border-y border-[#d9d8d2]">

                    {nextSteps.map(
                      (
                        step,
                        index
                      ) => (

                        <div
                          key={index}
                          className="grid gap-5 border-b border-[#d9d8d2] py-7 last:border-b-0 sm:grid-cols-[45px_minmax(0,1fr)]"
                        >

                          {/* Number */}

                          <div className="flex h-9 w-9 items-center justify-center border border-[#bfc0b8] font-mono text-[10px] text-[#55574f]">
                            {String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>


                          {/* Content */}

                          <div>

                            <h3 className="font-serif text-2xl leading-tight tracking-[-0.015em] text-[#22231f]">
                              {
                                step.title
                              }
                            </h3>


                            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#686a62]">
                              {
                                step.description
                              }
                            </p>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                </section>


                {/* =================================
                    05 GET LEGAL HELP
                ================================== */}

                <section>

                  <div className="border-b border-[#d5d4cd] pb-3">

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                      05 / Get legal help
                    </p>


                    <h2 className="mt-1 font-serif text-3xl tracking-[-0.02em]">
                      Choose how you want to proceed
                    </h2>


                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#73746d]">
                      Explore the available service options when you are ready for further assistance.
                    </p>

                  </div>


                  <div className="mt-6 grid gap-0 border-y border-[#d9d8d2] sm:grid-cols-2">

                    {/* Legal Aid */}

                    <button
                      onClick={() =>
                        navigate(
                          "/legal-aid"
                        )
                      }
                      className="group border-b border-[#d9d8d2] px-6 py-7 text-left transition hover:bg-[#eeede8] sm:border-b-0 sm:border-r"
                    >

                      <div className="flex items-start justify-between">

                        <Landmark
                          size={20}
                          strokeWidth={
                            1.6
                          }
                          className="text-[#315d45]"
                        />


                        <ArrowRight
                          size={17}
                          strokeWidth={
                            1.6
                          }
                          className="text-[#9a9991] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                        />

                      </div>


                      <h3 className="mt-7 font-serif text-2xl">
                        Find Legal Aid
                      </h3>


                      <p className="mt-2 text-sm leading-6 text-[#74756e]">
                        Explore available legal-aid services and government-supported assistance.
                      </p>

                    </button>


                    {/* Lawyer */}

                    <button
                      onClick={() =>
                        navigate(
                          "/lawyers"
                        )
                      }
                      className="group px-6 py-7 text-left transition hover:bg-[#eeede8]"
                    >

                      <div className="flex items-start justify-between">

                        <ShieldCheck
                          size={20}
                          strokeWidth={
                            1.6
                          }
                          className="text-[#315d45]"
                        />


                        <ArrowRight
                          size={17}
                          strokeWidth={
                            1.6
                          }
                          className="text-[#9a9991] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                        />

                      </div>


                      <h3 className="mt-7 font-serif text-2xl">
                        Find a Lawyer
                      </h3>


                      <p className="mt-2 text-sm leading-6 text-[#74756e]">
                        Browse the available lawyer directory and find a professional to contact.
                      </p>

                    </button>

                  </div>

                </section>

              </>
            )}


            {/* ======================================
                DISCLAIMER
            ====================================== */}

            <div className="border-t border-[#d5d4cd] pt-5">

              <p className="max-w-3xl text-xs leading-5 text-[#8a8981]">

                <strong className="font-medium text-[#676861]">
                  Important:
                </strong>{" "}

                LegalSetu provides general information and helps users discover legal resources. The information shown is not a substitute for advice from a qualified legal professional.

              </p>

            </div>

          </div>


          {/* ========================================
              RIGHT SIDEBAR
          ======================================== */}

          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                Your options
              </p>


              <h2 className="mt-2 font-serif text-3xl leading-tight tracking-[-0.02em]">
                Get help when you need it.
              </h2>


              <p className="mt-3 text-sm leading-6 text-[#73746d]">
                You can review the information first, then choose a service.
              </p>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                <button
                  onClick={() =>
                    navigate(
                      "/legal-aid"
                    )
                  }
                  className="group w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <Landmark
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                      className="text-[#98978f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Find Legal Aid
                  </p>


                  <p className="mt-1 text-xs leading-5 text-[#7b7c74]">
                    Explore available legal-aid services.
                  </p>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/lawyers"
                    )
                  }
                  className="group w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <ShieldCheck
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                      className="text-[#98978f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Find a Lawyer
                  </p>


                  <p className="mt-1 text-xs leading-5 text-[#7b7c74]">
                    Browse the lawyer directory.
                  </p>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/apply"
                    )
                  }
                  className="group w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <FileText
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                      className="text-[#98978f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Apply for Legal Aid
                  </p>


                  <p className="mt-1 text-xs leading-5 text-[#7b7c74]">
                    Start an application.
                  </p>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/track"
                    )
                  }
                  className="group w-full py-5 text-left"
                >

                  <div className="flex items-start justify-between">

                    <Clock3
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      strokeWidth={1.6}
                      className="text-[#98978f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>


                  <p className="mt-5 font-serif text-xl">
                    Track Application
                  </p>


                  <p className="mt-1 text-xs leading-5 text-[#7b7c74]">
                    Check a submitted request.
                  </p>

                </button>

              </div>

            </div>


            {/* Sidebar note */}

            <div className="mt-7 border border-[#d5d4cd] bg-[#eeede7] p-5">

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7f8078]">
                A note
              </p>


              <p className="mt-3 font-serif text-lg leading-6 text-[#34352f]">
                You do not need to know the legal terminology before asking for help.
              </p>

            </div>

          </aside>

        </div>

      </main>

    </div>
  )
}


export default Results