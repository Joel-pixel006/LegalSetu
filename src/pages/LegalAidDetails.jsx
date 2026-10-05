import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Landmark,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"


function LegalAidDetails({
  centre,
  onBack,
  onApply,
}) {
  if (!centre) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header showBack />

        <main className="mx-auto max-w-3xl px-6 py-16">

          <div className="border-y border-[#d5d4cd] py-14 text-center">

            <Landmark
              size={30}
              className="mx-auto text-[#92928a]"
            />

            <h1 className="mt-5 font-serif text-3xl">
              Legal-aid service not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#77786f]">
              The service information could not be loaded.
            </p>

            <button
              onClick={
                onBack
              }
              className="mt-7 inline-flex items-center gap-2 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
            >

              <ArrowLeft
                size={15}
              />

              Back to Legal Aid

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
          onClick={
            onBack
          }
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] hover:text-[#171815]"
        >

          <ArrowLeft
            size={15}
            className="transition group-hover:-translate-x-1"
          />

          Back to Legal Aid

        </button>


        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_300px] lg:items-end">

          <div className="flex gap-5">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#315d45] text-white">

              <Landmark
                size={25}
                strokeWidth={1.6}
              />

            </div>


            <div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
                {centre.type}
              </p>


              <h1 className="mt-3 font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                {
                  centre.name
                }
              </h1>


              <p className="mt-4 flex items-center gap-2 text-sm text-[#77786f]">

                <MapPin
                  size={14}
                />

                {
                  centre.location
                }

              </p>

            </div>

          </div>


          <div className="border-l border-[#d5d4cd] pl-5">

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={16}
                className="text-[#315d45]"
              />

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Service information
              </p>

            </div>


            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              Verify current service details and working hours before visiting.
            </p>

          </div>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">


          <div className="pt-8">


            <section>

              <div className="border-y border-[#d9d8d2] py-6">

                <p className="max-w-3xl text-sm leading-7 text-[#62645d]">
                  {
                    centre.description
                  }
                </p>

              </div>

            </section>


            <section className="mt-10">

              <div className="grid border-y border-[#d9d8d2] sm:grid-cols-2">

                <div className="border-b border-[#d9d8d2] py-6 sm:border-b-0 sm:border-r sm:pr-6">

                  <Phone
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Contact
                  </p>

                  <p className="mt-2 font-serif text-xl">
                    {
                      centre.phone ||
                      "Not provided"
                    }
                  </p>

                </div>


                <div className="py-6 sm:pl-6">

                  <Clock3
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Working hours
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#77786f]">
                    Current working hours should be verified before visiting.
                  </p>

                </div>

              </div>

            </section>


            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / What this service can help with
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Possible next steps
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2]">

                {[
                  "Understand the legal-aid services available through this centre.",
                  "Ask about the documents or information that may be required.",
                  "Clarify the next stage of assistance for your situation.",
                  "Follow the instructions provided by the relevant legal-services authority.",
                ].map(
                  (
                    text,
                    index
                  ) => (

                    <div
                      key={
                        text
                      }
                      className="grid gap-4 border-b border-[#d9d8d2] py-5 last:border-b-0 sm:grid-cols-[35px_minmax(0,1fr)]"
                    >

                      <div className="flex h-7 w-7 items-center justify-center border border-[#cecdc6] font-mono text-[9px] text-[#666861]">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </div>


                      <div className="flex gap-3">

                        <CheckCircle2
                          size={17}
                          className="mt-0.5 shrink-0 text-[#315d45]"
                        />

                        <p className="text-sm leading-7 text-[#686a62]">
                          {text}
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>


            <section className="mt-10">

              <div className="border-y border-[#d9d8d2] py-7">

                <div className="flex items-start gap-4">

                  <FileText
                    size={19}
                    className="mt-0.5 shrink-0 text-[#315d45]"
                  />


                  <div>

                    <h2 className="font-serif text-2xl">
                      Need legal aid?
                    </h2>


                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#74756e]">
                      Submit your request through LegalSetu and keep your application number for later tracking.
                    </p>


                    <button
                      onClick={
                        onApply
                      }
                      className="group mt-5 inline-flex items-center gap-3 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
                    >

                      Apply for Legal Aid

                      <ArrowRight
                        size={15}
                        className="transition group-hover:translate-x-1"
                      />

                    </button>

                  </div>

                </div>

              </div>

            </section>


            <p className="mt-8 text-xs leading-5 text-[#898981]">
              Verify service details with the relevant official authority before taking action.
            </p>

          </div>


          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                Location
              </p>


              <h2 className="mt-2 font-serif text-3xl">
                Plan the visit carefully.
              </h2>


              <div className="mt-7 border-y border-[#d9d8d2]">

                <div className="py-5">

                  <MapPin
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Address
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#4f5049]">
                    {
                      centre.location
                    }
                  </p>

                </div>


                <div className="border-t border-[#d9d8d2] py-5">

                  <Phone
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Phone
                  </p>

                  <p className="mt-2 text-sm text-[#4f5049]">
                    {
                      centre.phone ||
                      "Not provided"
                    }
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default LegalAidDetails