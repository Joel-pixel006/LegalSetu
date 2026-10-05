import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  Landmark,
  MapPin,
  ShieldCheck,
} from "lucide-react"

import Header from "../components/Header"


const resources = [
  {
    title:
      "Free Legal Aid Eligibility in Kerala",
    source:
      "Kerala State Legal Services Authority",
    description:
      "Official information about eligibility for free legal services in Kerala.",
    url:
      "https://kerala.nalsa.gov.in/legal-aid/",
  },

  {
    title:
      "Legal Services Authorities Act: Legal Aid and Entitlement",
    source:
      "India Code",
    description:
      "The central legal framework relating to legal services and legal aid.",
    url:
      "https://www.indiacode.nic.in/handle/123456789/17040?locale=en",
  },

  {
    title:
      "District Legal Services Authorities in Kerala",
    source:
      "Kerala State Legal Services Authority",
    description:
      "Directory information for District Legal Services Authorities in Kerala.",
    url:
      "https://kerala.nalsa.gov.in/dlsa/",
  },

  {
    title:
      "Lok Adalat and Types of Disputes in Kerala",
    source:
      "Kerala State Legal Services Authority",
    description:
      "Information about Lok Adalat and the types of disputes that may be handled through the mechanism.",
    url:
      "https://kerala.nalsa.gov.in/lok-adalat/",
  },
]


function LegalAid() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />

      <main className="mx-auto max-w-6xl px-6 py-8 sm:py-10">

        {/* Back */}

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


        {/* Heading */}

        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_320px] lg:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Legal aid
            </p>

            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
              Legal help should not begin with a price tag.
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
              Explore official information about legal-aid services in Kerala and the organisations that provide them.
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
                Official information
              </p>

            </div>

            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              Eligibility and service availability should be confirmed through the relevant legal-services authority.
            </p>

          </div>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* LEFT */}

          <div className="pt-8">


            {/* Overview */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Start here
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  What legal aid means
                </h2>

              </div>


              <div className="mt-6 grid gap-0 border-y border-[#d9d8d2] md:grid-cols-3">

                <div className="border-b border-[#d9d8d2] px-1 py-6 md:border-b-0 md:border-r">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                    01
                  </p>

                  <h3 className="mt-3 font-serif text-xl">
                    Check eligibility
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    Review the official eligibility information before applying.
                  </p>

                </div>


                <div className="border-b border-[#d9d8d2] px-1 py-6 md:border-b-0 md:border-r md:pl-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                    02
                  </p>

                  <h3 className="mt-3 font-serif text-xl">
                    Find the right office
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    Legal-services authorities operate through state and district structures.
                  </p>

                </div>


                <div className="px-1 py-6 md:pl-5">

                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8a8a82]">
                    03
                  </p>

                  <h3 className="mt-3 font-serif text-xl">
                    Submit your request
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    Use LegalSetu's application flow to provide your details and supporting records.
                  </p>

                </div>

              </div>

            </section>


            {/* Resources */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  02 / Official resources
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Start with the sources.
                </h2>

              </div>


              <div className="mt-6 border-y border-[#d9d8d2]">

                {resources.map(
                  (
                    resource,
                    index
                  ) => (

                    <a
                      key={
                        resource.title
                      }
                      href={
                        resource.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="group grid gap-5 border-b border-[#d9d8d2] py-6 last:border-b-0 sm:grid-cols-[38px_minmax(0,1fr)_20px]"
                    >

                      <div className="flex h-7 w-7 items-center justify-center border border-[#cecdc6]">

                        {index === 0 ? (
                          <FileText
                            size={14}
                            strokeWidth={1.5}
                            className="text-[#315d45]"
                          />
                        ) : (
                          <Landmark
                            size={14}
                            strokeWidth={1.5}
                            className="text-[#315d45]"
                          />
                        )}

                      </div>


                      <div>

                        <h3 className="font-serif text-xl text-[#22231f]">
                          {
                            resource.title
                          }
                        </h3>

                        <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#888880]">
                          {
                            resource.source
                          }
                        </p>

                        <p className="mt-3 text-sm leading-6 text-[#74756e]">
                          {
                            resource.description
                          }
                        </p>

                      </div>


                      <ExternalLink
                        size={15}
                        strokeWidth={1.6}
                        className="text-[#9a9991] transition group-hover:text-[#315d45]"
                      />

                    </a>

                  )
                )}

              </div>

            </section>


            {/* Application */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  03 / Continue
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Ready to make a request?
                </h2>

              </div>


              <div className="mt-6 grid gap-0 border-y border-[#d9d8d2] sm:grid-cols-2">

                <button
                  onClick={() =>
                    navigate(
                      "/apply"
                    )
                  }
                  className="group border-b border-[#d9d8d2] px-6 py-7 text-left transition hover:bg-[#eeede8] sm:border-b-0 sm:border-r"
                >

                  <div className="flex items-center justify-between">

                    <FileText
                      size={20}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={17}
                      className="text-[#9b9a91] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>

                  <h3 className="mt-7 font-serif text-2xl">
                    Apply for Legal Aid
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    Start a guided application through LegalSetu.
                  </p>

                </button>


                <button
                  onClick={() =>
                    navigate(
                      "/track"
                    )
                  }
                  className="group px-6 py-7 text-left transition hover:bg-[#eeede8]"
                >

                  <div className="flex items-center justify-between">

                    <CheckCircle2
                      size={20}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={17}
                      className="text-[#9b9a91] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>

                  <h3 className="mt-7 font-serif text-2xl">
                    Track an application
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#74756e]">
                    Check the status of a request already submitted.
                  </p>

                </button>

              </div>

            </section>


            {/* Disclaimer */}

            <div className="mt-10 border-t border-[#d5d4cd] pt-5">

              <p className="text-xs leading-5 text-[#88877f]">
                LegalSetu presents general information and links to official resources. Eligibility and service decisions are made by the relevant authority.
              </p>

            </div>

          </div>


          {/* SIDEBAR */}

          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                Useful places
              </p>

              <h2 className="mt-2 font-serif text-3xl">
                Know where to look.
              </h2>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                <a
                  href="https://kerala.nalsa.gov.in/dlsa/"
                  target="_blank"
                  rel="noreferrer"
                  className="group block py-5"
                >

                  <div className="flex items-start justify-between">

                    <MapPin
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#99988f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>

                  <p className="mt-5 font-serif text-xl">
                    Find a DLSA
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77786f]">
                    View the Kerala district legal-services directory.
                  </p>

                </a>


                <a
                  href="https://kerala.nalsa.gov.in/download-forms/"
                  target="_blank"
                  rel="noreferrer"
                  className="group block py-5"
                >

                  <div className="flex items-start justify-between">

                    <FileText
                      size={19}
                      strokeWidth={1.6}
                      className="text-[#315d45]"
                    />

                    <ArrowRight
                      size={16}
                      className="text-[#99988f] transition group-hover:translate-x-1 group-hover:text-[#171815]"
                    />

                  </div>

                  <p className="mt-5 font-serif text-xl">
                    Official forms
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#77786f]">
                    View forms published by Kerala SLSA.
                  </p>

                </a>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  )
}

export default LegalAid