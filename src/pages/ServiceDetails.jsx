import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"


function ServiceDetails({
  service,
  onBack,
  onApplyAid,
}) {
  if (!service) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header />

        <main className="mx-auto max-w-3xl px-6 py-16">

          <div className="border-y border-[#d5d4cd] py-14 text-center">

            <Scale
              size={29}
              className="mx-auto text-[#92928a]"
            />

            <h1 className="mt-5 font-serif text-3xl">
              Service not found
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

              Back

            </button>

          </div>

        </main>

        <Footer />

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />

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

          Back

        </button>


        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_300px] lg:items-end">

          <div className="flex gap-5">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-[#315d45] text-white">

              <Scale
                size={25}
                strokeWidth={1.6}
              />

            </div>


            <div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
                {
                  service.type
                }
              </p>


              <h1 className="mt-3 font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
                {
                  service.name
                }
              </h1>


              <p className="mt-4 flex items-center gap-2 text-sm text-[#77786f]">

                <MapPin
                  size={14}
                />

                {
                  service.location
                }

              </p>

            </div>

          </div>


          <div className="border-l border-[#d5d4cd] pl-5">

            <ShieldCheck
              size={18}
              className="text-[#315d45]"
            />

            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
              Service information
            </p>

            <p className="mt-2 text-xs leading-5 text-[#7c7d75]">
              Verify current service details and availability before visiting.
            </p>

          </div>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">


          <div className="pt-8">

            {/* Description */}

            <section>

              <div className="border-y border-[#d9d8d2] py-7">

                <p className="max-w-3xl text-sm leading-7 text-[#62645d]">
                  {
                    service.description
                  }
                </p>

              </div>

            </section>


            {/* Contact */}

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
                    Contact details will be provided by the verified service.
                  </p>

                </div>


                <div className="py-6 sm:pl-6">

                  <Clock3
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Availability
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#77786f]">
                    Please verify current working hours before visiting.
                  </p>

                </div>

              </div>

            </section>


            {/* What to do */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / What you can do
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  A practical way forward
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2]">

                {[
                  "Review the assistance available through this service.",
                  "Prepare the documents related to your legal problem.",
                  "Contact the service to understand the next stage.",
                ].map(
                  (
                    text,
                    index
                  ) => (

                    <div
                      key={
                        text
                      }
                      className="grid gap-4 border-b border-[#d9d8d2] py-6 last:border-b-0 sm:grid-cols-[35px_minmax(0,1fr)]"
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


            {/* Apply */}

            <section className="mt-10">

              <div className="border-y border-[#d9d8d2] py-7">

                <div className="flex items-start gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#cecdc6]">

                    <FileText
                      size={16}
                      className="text-[#315d45]"
                    />

                  </div>


                  <div>

                    <h2 className="font-serif text-2xl">
                      Need legal aid?
                    </h2>


                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#77786f]">
                      Submit an application through LegalSetu when legal-aid assistance is the route you want to explore.
                    </p>


                    <button
                      onClick={
                        onApplyAid
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
              Information shown here is for general guidance. Verify service details with the relevant provider before taking action.
            </p>

          </div>


          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                At a glance
              </p>


              <h2 className="mt-2 font-serif text-3xl">
                The details that matter.
              </h2>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                <div className="py-5">

                  <MapPin
                    size={18}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#898981]">
                    Location
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#4f5049]">
                    {
                      service.location
                    }
                  </p>

                </div>


                <div className="py-5">

                  <Scale
                    size={18}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#898981]">
                    Service type
                  </p>

                  <p className="mt-2 text-sm text-[#4f5049]">
                    {
                      service.type
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

export default ServiceDetails