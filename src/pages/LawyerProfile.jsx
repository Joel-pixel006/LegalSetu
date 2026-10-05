import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Languages,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"
import Footer from "../components/Footer"


function LawyerProfile({
  lawyer,
  onBack,
}) {
  if (!lawyer) {
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
              Lawyer not found
            </h1>

            <button
              onClick={
                onBack
              }
              className="mt-7 inline-flex items-center gap-2 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
            >

              <ArrowLeft
                size={15}
              />

              Back to Lawyers

            </button>

          </div>

        </main>

        <Footer />

      </div>
    )
  }


  const initial =
    lawyer.name
      ?.charAt(0)
      ?.toUpperCase() ||
    "A"


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

          Back to Lawyers

        </button>


        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_300px] lg:items-end">

          <div className="flex gap-5 sm:gap-7">

            <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-[#315d45] font-serif text-4xl text-white sm:h-24 sm:w-24">
              {initial}
            </div>


            <div>

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
                Lawyer profile
              </p>


              <h1 className="mt-3 font-serif text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
                {
                  lawyer.name
                }
              </h1>


              <p className="mt-3 text-sm text-[#62645d]">
                {
                  lawyer.specialization
                }
              </p>


              <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#77786f]">

                <span className="flex items-center gap-1.5">

                  <MapPin
                    size={14}
                  />

                  {
                    lawyer.location
                  }

                </span>


                <span className="flex items-center gap-1.5">

                  <Languages
                    size={14}
                  />

                  {
                    lawyer.languages
                  }

                </span>

              </div>

            </div>

          </div>


          <div className="border-l border-[#d5d4cd] pl-5">

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={16}
                className="text-[#315d45]"
              />

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#77786f]">
                Verification
              </p>

            </div>


            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              Verification information will be displayed when LegalSetu is connected to its verified lawyer database.
            </p>

          </div>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">


          <div className="pt-8">

            {/* Details */}

            <section>

              <div className="grid border-y border-[#d9d8d2] sm:grid-cols-2">

                <div className="border-b border-[#d9d8d2] py-6 sm:border-b-0 sm:border-r sm:pr-6">

                  <Briefcase
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Experience
                  </p>

                  <p className="mt-2 font-serif text-xl">
                    {
                      lawyer.experience
                    }
                  </p>

                </div>


                <div className="py-6 sm:pl-6">

                  <MapPin
                    size={19}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-[#898981]">
                    Location
                  </p>

                  <p className="mt-2 font-serif text-xl">
                    {
                      lawyer.location
                    }
                  </p>

                </div>

              </div>

            </section>


            {/* Practice */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Practice
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Areas of practice
                </h2>

              </div>


              <div className="mt-6 flex flex-wrap gap-2">

                <span className="border border-[#c8c7bf] px-3 py-2 text-sm text-[#44453f]">
                  {
                    lawyer.specialization
                  }
                </span>


                <span className="border border-[#c8c7bf] px-3 py-2 text-sm text-[#44453f]">
                  Legal Consultation
                </span>


                <span className="border border-[#c8c7bf] px-3 py-2 text-sm text-[#44453f]">
                  Client Representation
                </span>

              </div>

            </section>


            {/* Verification */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  02 / Verification
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Verification information
                </h2>

              </div>


              <div className="mt-6 flex gap-4 border-y border-[#d9d8d2] py-6">

                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-[#315d45]"
                />


                <p className="text-sm leading-7 text-[#686a62]">
                  Verification information will be displayed here when LegalSetu is connected to its verified lawyer database.
                </p>

              </div>

            </section>


            {/* Contact */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  03 / Contact
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Contact the lawyer
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2] py-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#cecdc6]">

                    <Phone
                      size={16}
                      className="text-[#315d45]"
                    />

                  </div>


                  <div>

                    <p className="font-serif text-xl">
                      Contact details
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#77786f]">
                      Contact details will be available once verified lawyer information is connected.
                    </p>


                    <button
                      disabled
                      className="mt-5 inline-flex items-center gap-2 bg-[#e5e4df] px-5 py-3 text-sm font-medium text-[#99988f]"
                    >

                      Contact Lawyer

                      <ArrowRight
                        size={15}
                      />

                    </button>

                  </div>

                </div>

              </div>

            </section>


            <p className="mt-8 text-xs leading-5 text-[#898981]">
              Lawyer information should be verified before relying on it or making contact.
            </p>

          </div>


          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-[#77786f]">
                Profile summary
              </p>


              <h2 className="mt-2 font-serif text-3xl">
                A little context.
              </h2>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                <div className="py-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#898981]">
                    Specialization
                  </p>

                  <p className="mt-2 text-sm text-[#4f5049]">
                    {
                      lawyer.specialization
                    }
                  </p>

                </div>


                <div className="py-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#898981]">
                    Languages
                  </p>

                  <p className="mt-2 text-sm text-[#4f5049]">
                    {
                      lawyer.languages
                    }
                  </p>

                </div>


                <div className="py-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#898981]">
                    Location
                  </p>

                  <p className="mt-2 text-sm text-[#4f5049]">
                    {
                      lawyer.location
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

export default LawyerProfile