import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Scale,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"

function FindHelp({
  problem,
}) {
  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />

      <main className="mx-auto max-w-5xl px-6 py-8 sm:py-10">

        <section className="border-b border-[#d5d4cd] pb-10">

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            LegalSetu
          </p>


          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
            Finding the right help.
          </h1>


          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
            Your situation is being organized so LegalSetu can guide you toward the appropriate information and service.
          </p>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">

          <section className="pt-8">

            <div className="border-y border-[#d9d8d2]">

              <div className="grid gap-5 py-7 sm:grid-cols-[40px_minmax(0,1fr)]">

                <div className="flex h-8 w-8 items-center justify-center border border-[#cecdc6] font-mono text-[9px] text-[#666861]">
                  01
                </div>


                <div>

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Your problem
                  </p>


                  <p className="mt-3 font-serif text-2xl leading-9 text-[#242520]">
                    {problem ||
                      "No problem description provided."}
                  </p>

                </div>

              </div>


              <div className="grid gap-5 border-t border-[#d9d8d2] py-7 sm:grid-cols-[40px_minmax(0,1fr)]">

                <div className="flex h-8 w-8 items-center justify-center border border-[#cecdc6] font-mono text-[9px] text-[#666861]">
                  02
                </div>


                <div>

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Next
                  </p>


                  <p className="mt-2 font-serif text-2xl">
                    Continue to the legal-help flow.
                  </p>


                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    LegalSetu will ask a few simple questions before showing relevant resources.
                  </p>

                </div>

              </div>

            </div>


            <button
              onClick={() =>
                window.history.back()
              }
              className="group mt-7 inline-flex items-center gap-2 border border-[#c8c7bf] px-5 py-3 text-sm font-medium hover:border-[#171815] hover:bg-white"
            >

              <ArrowLeft
                size={15}
              />

              Go back

            </button>

          </section>


          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <ShieldCheck
                size={19}
                className="text-[#315d45]"
              />


              <h2 className="mt-5 font-serif text-3xl leading-tight">
                Start with the facts.
              </h2>


              <p className="mt-3 text-sm leading-6 text-[#73746d]">
                You do not need to know the legal terminology before asking for help.
              </p>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default FindHelp