import {
  ArrowLeft,
  Home,
  Scale,
} from "lucide-react"

import {
  useNavigate,
} from "react-router-dom"

import Header from "../components/Header"
import Footer from "../components/Footer"


function NotFound() {
  const navigate =
    useNavigate()

  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <Header />

      <main className="flex min-h-[calc(100vh-150px)] items-center justify-center px-6 py-16">

        <div className="w-full max-w-xl border-y border-[#d5d4cd] py-14 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#171815] text-[#f6f5f1]">

            <Scale
              size={23}
            />

          </div>


          <p className="mt-7 font-mono text-6xl tracking-[-0.05em] text-[#315d45]">
            404
          </p>


          <h1 className="mt-3 font-serif text-4xl tracking-[-0.025em]">
            This page isn't here.
          </h1>


          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#77786f]">
            The page you were looking for may have moved or the address may be incorrect.
          </p>


          <button
            onClick={() =>
              navigate("/")
            }
            className="group mt-7 inline-flex items-center gap-3 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
          >

            <Home
              size={15}
            />

            Back to LegalSetu

            <ArrowLeft
              size={15}
              className="rotate-180 transition group-hover:translate-x-1"
            />

          </button>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default NotFound