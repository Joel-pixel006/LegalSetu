import {
  Scale,
  ArrowUpRight,
} from "lucide-react"

import { useNavigate } from "react-router-dom"


function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-[#d9d8d2] bg-[#eeede8]">

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">

        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">

          {/* Brand */}
          <div>

            <button
              onClick={() => navigate("/")}
              className="group flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center bg-[#171815] text-[#f6f5f1] transition-transform duration-200 group-hover:-translate-y-0.5">
                <Scale
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <span className="font-serif text-xl text-[#171815]">
                LegalSetu
              </span>
            </button>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#70716a]">
              Making legal information and access to
              legal services easier to navigate.
            </p>

            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8b8a82]">
              Legal help, made clearer
            </p>

          </div>


          {/* Explore */}
          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#77786f]">
              Explore
            </p>

            <div className="mt-4 space-y-3">

              <button
                onClick={() => navigate("/")}
                className="block text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Home
              </button>

              <button
                onClick={() => navigate("/lawyers")}
                className="block text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Find a lawyer
              </button>

              <button
                onClick={() =>
                  navigate("/legal-aid")
                }
                className="block text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Legal aid
              </button>

            </div>

          </div>


          {/* Services */}
          <div>

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#77786f]">
              Services
            </p>

            <div className="mt-4 space-y-3">

              <button
                onClick={() =>
                  navigate("/apply")
                }
                className="block text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Apply for legal aid
              </button>

              <button
                onClick={() =>
                  navigate("/track")
                }
                className="block text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Track application
              </button>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                className="inline-flex items-center gap-1.5 text-sm text-[#5f6059] transition hover:text-[#171815]"
              >
                Back to top

                <ArrowUpRight
                  size={13}
                  strokeWidth={1.6}
                />
              </button>

            </div>

          </div>

        </div>


        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-4 border-t border-[#d3d1c9] pt-5 text-xs text-[#85847c] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} LegalSetu
          </p>

          <p className="max-w-md leading-5 sm:text-right">
            Information and resource discovery only.
            LegalSetu does not replace advice from a qualified
            legal professional.
          </p>

        </div>

      </div>

    </footer>
  )
}

export default Footer