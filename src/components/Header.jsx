import {
  Scale,
  Home,
  ArrowLeft,
  LogOut,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { signOut } from "../lib/auth"

function Header({ showBack = false }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate("/auth")
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      )
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <header className="border-b border-[#d9d8d2] bg-[#f6f5f1]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

        {/* Brand */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center bg-[#171815] text-[#f6f5f1] transition-transform duration-200 group-hover:-translate-y-0.5">
            <Scale
              size={20}
              strokeWidth={1.8}
            />
          </div>

          <div className="text-left">
            <p className="font-serif text-xl leading-none tracking-[-0.02em] text-[#171815]">
              LegalSetu
            </p>

            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#77786f]">
              Legal help, made clearer
            </p>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2">

          {showBack && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 border border-[#cbc9c1] px-3 py-2 text-xs text-[#55564f] transition hover:border-[#171815] hover:bg-white"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.7}
              />
              Back
            </button>
          )}

          {/* Home */}
          <button
            onClick={() => navigate("/")}
            title="Home"
            className="flex h-9 w-9 items-center justify-center border border-[#cbc9c1] text-[#55564f] transition hover:border-[#171815] hover:bg-white hover:text-[#171815]"
          >
            <Home
              size={17}
              strokeWidth={1.7}
            />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="inline-flex items-center gap-2 border border-[#cbc9c1] px-3 py-2 text-xs text-[#55564f] transition hover:border-[#171815] hover:bg-white hover:text-[#171815]"
          >
            <LogOut
              size={16}
              strokeWidth={1.7}
            />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  )
}

export default Header