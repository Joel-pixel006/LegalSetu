import {
  useEffect,
  useMemo,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Scale,
} from "lucide-react"

import Header from "../components/Header"
import { supabase } from "../lib/supabase"

function Lawyers() {
  const navigate = useNavigate()

  const [lawyers, setLawyers] = useState([])
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("All locations")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // --------------------------------------------------
  // LOAD LAWYERS FROM SUPABASE
  // --------------------------------------------------

  useEffect(() => {
    async function loadLawyers() {
      try {
        setLoading(true)
        setError("")

        const {
          data,
          error: supabaseError,
        } = await supabase
          .from("lawyers")
          .select(
            "id, name, specialization, location, experience_years, languages, phone, email, verified, created_at"
          )
          .order("created_at", {
            ascending: false,
          })

        if (supabaseError) {
          throw supabaseError
        }

        setLawyers(data || [])
      } catch (err) {
        console.error(
          "Error loading lawyers:",
          err
        )

        setError(
          err?.message ||
            "Unable to load lawyer profiles."
        )
      } finally {
        setLoading(false)
      }
    }

    loadLawyers()
  }, [])

  // --------------------------------------------------
  // LOCATIONS
  // --------------------------------------------------

  const locations = useMemo(() => {
    const values = lawyers
      .map((lawyer) => lawyer.location)
      .filter(Boolean)

    return [
      "All locations",
      ...Array.from(new Set(values)),
    ]
  }, [lawyers])

  // --------------------------------------------------
  // FILTER LAWYERS
  // --------------------------------------------------

  const filteredLawyers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return lawyers.filter((lawyer) => {
      const matchesLocation =
        location === "All locations" ||
        lawyer.location === location

      if (!matchesLocation) {
        return false
      }

      if (!query) {
        return true
      }

      const searchableText = [
        lawyer.name,
        lawyer.specialization,
        lawyer.location,
        ...(Array.isArray(lawyer.languages)
          ? lawyer.languages
          : []),
        lawyer.phone,
        lawyer.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      return searchableText.includes(query)
    })
  }, [lawyers, search, location])

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

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

        {/* Intro */}

        <section className="mt-8 grid gap-10 border-b border-[#d5d4cd] pb-10 lg:grid-cols-[1fr_330px] lg:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Lawyer directory
            </p>

            <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
              Find someone to speak to.
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
              Browse lawyer profiles available through LegalSetu. Use the filters to narrow the directory by location or search by specialization.
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
                Directory note
              </p>

            </div>

            <p className="mt-3 text-xs leading-5 text-[#7c7d75]">
              Only profiles supplied through the LegalSetu directory should be presented as verified.
            </p>

          </div>

        </section>

        {/* Search / filters */}

        <section className="grid gap-4 border-b border-[#d5d4cd] py-7 md:grid-cols-[minmax(0,1fr)_220px]">

          <div className="relative">

            <Search
              size={17}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a82]"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, specialization, location or language..."
              className="w-full border border-[#cbc9c1] bg-[#fbfaf7] py-3 pl-11 pr-4 text-sm text-[#242520] outline-none transition placeholder:text-[#9c9b93] focus:border-[#315d45]"
            />

          </div>

          <div className="relative">

            <SlidersHorizontal
              size={15}
              strokeWidth={1.6}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8a82]"
            />

            <select
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              className="w-full appearance-none border border-[#cbc9c1] bg-[#fbfaf7] py-3 pl-10 pr-8 text-sm text-[#242520] outline-none focus:border-[#315d45]"
            >

              {locations.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}

            </select>

          </div>

        </section>

        {/* Directory count */}

        <div className="flex items-center justify-between py-5">

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">

            {loading
              ? "Loading profiles..."
              : `${filteredLawyers.length} profile${
                  filteredLawyers.length === 1
                    ? ""
                    : "s"
                } shown`}

          </p>

          <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a09f96]">
            Kerala
          </p>

        </div>

        {/* Error */}

        {error && !loading && (

          <div className="border-y border-[#d5d4cd] py-10">

            <div className="border-l-2 border-red-700 pl-5">

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-red-700">
                Directory error
              </p>

              <p className="mt-2 text-sm leading-6 text-[#676861]">
                {error}
              </p>

            </div>

          </div>

        )}

        {/* Loading */}

        {loading && (

          <div className="border-y border-[#d5d4cd] py-16 text-center">

            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#d5d4cd] border-t-[#315d45]" />

            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
              Loading lawyer directory
            </p>

          </div>

        )}

        {/* Lawyer list */}

        {!loading &&
          !error &&
          filteredLawyers.length > 0 && (

          <div className="border-y border-[#d5d4cd]">

            {filteredLawyers.map((lawyer) => (

              <article
                key={lawyer.id}
                className="group border-b border-[#d9d8d2] py-7 last:border-b-0"
              >

                <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_260px]">

                  {/* Main profile */}

                  <div>

                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h2 className="font-serif text-3xl tracking-[-0.02em] text-[#22231f]">
                            {lawyer.name}
                          </h2>

                          {lawyer.verified && (

                            <span className="inline-flex items-center gap-1 border border-[#b8cbbd] bg-[#edf3ee] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#315d45]">

                              <CheckCircle2
                                size={11}
                                strokeWidth={1.8}
                              />

                              Verified

                            </span>

                          )}

                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#7a7b73]">

                          {lawyer.location && (

                            <span className="inline-flex items-center gap-1.5">

                              <MapPin
                                size={13}
                                strokeWidth={1.6}
                              />

                              {lawyer.location}

                            </span>

                          )}

                          {lawyer.experience_years !== null &&
                            lawyer.experience_years !== undefined && (

                            <span>
                              {lawyer.experience_years}{" "}
                              {lawyer.experience_years === 1
                                ? "year"
                                : "years"}{" "}
                              experience
                            </span>

                          )}

                        </div>

                      </div>

                      <ArrowRight
                        size={18}
                        strokeWidth={1.6}
                        className="text-[#9a9991] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#315d45]"
                      />

                    </div>

                    {/* Specialization */}

                    <div className="mt-5">

                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        Specialization
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#3f403a]">
                        {lawyer.specialization || "Not specified"}
                      </p>

                    </div>

                    {/* Languages */}

                    <div className="mt-5">

                      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                        Languages
                      </p>

                      <p className="mt-2 text-sm text-[#3f403a]">

                        {Array.isArray(lawyer.languages) &&
                        lawyer.languages.length > 0
                          ? lawyer.languages.join(" · ")
                          : "Not specified"}

                      </p>

                    </div>

                  </div>

                  {/* Contact */}

                  <div className="border-t border-[#d9d8d2] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#8a8a82]">
                      Contact
                    </p>

                    {lawyer.phone && (

                      <a
                        href={`tel:${lawyer.phone}`}
                        className="mt-3 block text-sm text-[#3f403a] transition hover:text-[#315d45]"
                      >
                        {lawyer.phone}
                      </a>

                    )}

                    {lawyer.email && (

                      <a
                        href={`mailto:${lawyer.email}`}
                        className="mt-2 block break-all text-sm text-[#3f403a] transition hover:text-[#315d45]"
                      >
                        {lawyer.email}
                      </a>

                    )}

                    {!lawyer.phone &&
                      !lawyer.email && (

                      <p className="mt-3 text-sm text-[#7a7b73]">
                        Contact details not specified.
                      </p>

                    )}

                    <button
                      onClick={() =>
                        navigate(
                          "/lawyer-request",
                          {
                            state: {
                              lawyer,
                            },
                          }
                        )
                      }
                      className="group mt-7 inline-flex w-full items-center justify-between border border-[#c8c7bf] bg-[#fbfaf7] px-4 py-3 text-left text-sm font-medium text-[#242520] transition hover:border-[#315d45] hover:bg-white"
                    >

                      <span>
                        Request contact
                      </span>

                      <ArrowRight
                        size={15}
                        strokeWidth={1.6}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />

                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

        {/* No profiles */}

        {!loading &&
          !error &&
          filteredLawyers.length === 0 && (

          <div className="border-y border-[#d5d4cd] py-16 text-center">

            <Scale
              size={26}
              strokeWidth={1.4}
              className="mx-auto text-[#8b8c84]"
            />

            <h2 className="mt-5 font-serif text-2xl">
              No matching profiles.
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77786f]">
              Try another location or a broader search term.
            </p>

            <button
              onClick={() => {
                setSearch("")
                setLocation("All locations")
              }}
              className="mt-6 border border-[#c8c7bf] px-4 py-2 text-sm font-medium transition hover:border-[#171815] hover:bg-white"
            >
              Clear filters
            </button>

          </div>

        )}

        {/* Bottom note */}

        <section className="mt-10 flex flex-col gap-4 border-t border-[#d5d4cd] pt-6 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={16}
              strokeWidth={1.6}
              className="mt-0.5 text-[#315d45]"
            />

            <p className="max-w-2xl text-xs leading-5 text-[#85857d]">
              Lawyer availability, contact details, and verification should come from the directory data maintained by LegalSetu.
            </p>

          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#64665e] transition hover:text-[#171815]"
          >

            Start a new problem

            <ArrowRight
              size={13}
              strokeWidth={1.6}
            />

          </button>

        </section>

      </main>

    </div>
  )
}

export default Lawyers