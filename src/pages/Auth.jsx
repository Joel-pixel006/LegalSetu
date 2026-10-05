import { useState } from "react"
import {
  useNavigate,
} from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  MapPin,
  Phone,
  Scale,
  User,
} from "lucide-react"
import {
  signIn,
  signUp,
} from "../lib/auth"


function Auth() {
  const navigate =
    useNavigate()

  const [mode, setMode] =
    useState("login")

  const [fullName, setFullName] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [phone, setPhone] =
    useState("")

  const [state, setState] =
    useState("")

  const [district, setDistrict] =
    useState("")

  const [pincode, setPincode] =
    useState("")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [success, setSuccess] =
    useState("")

  const isLogin =
    mode === "login"


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError("")
    setSuccess("")

    if (
      !email.trim() ||
      !password.trim()
    ) {
      setError(
        "Please enter your email and password."
      )
      return
    }

    if (!isLogin) {

      if (!fullName.trim()) {
        setError(
          "Please enter your full name."
        )
        return
      }

      if (!phone.trim()) {
        setError(
          "Please enter your phone number."
        )
        return
      }

      if (!state.trim()) {
        setError(
          "Please enter your state."
        )
        return
      }

      if (!district.trim()) {
        setError(
          "Please enter your district."
        )
        return
      }

      if (!pincode.trim()) {
        setError(
          "Please enter your pincode."
        )
        return
      }

    }


    if (
      password.length <
      6
    ) {
      setError(
        "Password must be at least 6 characters."
      )
      return
    }


    try {

      setLoading(true)

      if (isLogin) {

        await signIn(
          email.trim(),
          password
        )

        navigate("/")

      } else {

        const data =
          await signUp(
            email.trim(),
            password,
            {
              fullName:
                fullName.trim(),
              phone:
                phone.trim(),
              state:
                state.trim(),
              district:
                district.trim(),
              pincode:
                pincode.trim(),
            }
          )


        if (data.session) {

          navigate("/")

        } else {

          setSuccess(
            "Account created. Please check your email to confirm your account before signing in."
          )

          setMode("login")
          setPassword("")

        }

      }

    } catch (err) {

      console.error(err)

      setError(
        err?.message ||
          "Something went wrong."
      )

    } finally {
      setLoading(false)
    }
  }


  function switchMode(
    newMode
  ) {
    setMode(newMode)
    setError("")
    setSuccess("")
  }


  return (
    <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

      <header className="border-b border-[#d9d8d2]">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <button
            onClick={() =>
              navigate("/")
            }
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center bg-[#171815] text-[#f6f5f1]">
              <Scale
                size={20}
              />
            </div>


            <div className="text-left">

              <p className="font-serif text-xl leading-none">
                LegalSetu
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-[#77786f]">
                Legal help, made clearer
              </p>

            </div>

          </button>


          <button
            onClick={() =>
              navigate("/")
            }
            className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#72736b] hover:text-[#171815]"
          >

            <ArrowLeft
              size={15}
              className="transition group-hover:-translate-x-1"
            />

            Back

          </button>

        </div>

      </header>


      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-12 lg:grid-cols-[1fr_430px] lg:items-center">

        <section className="hidden lg:block">

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            LegalSetu account
          </p>


          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[0.96] tracking-[-0.04em]">
            Keep your legal journey in one place.
          </h1>


          <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#686a62]">
            Sign in to access your LegalSetu services, applications, and requests.
          </p>

        </section>


        <section>

          <div className="border-t-2 border-[#315d45] pt-5">

            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
              {isLogin
                ? "01 / Sign in"
                : "01 / Create account"}
            </p>


            <h2 className="mt-2 font-serif text-4xl tracking-[-0.025em]">

              {isLogin
                ? "Welcome back."
                : "Create your account."}

            </h2>


            <p className="mt-3 text-sm leading-6 text-[#73746d]">

              {isLogin
                ? "Sign in to continue to LegalSetu."
                : "Create an account to access LegalSetu services."}

            </p>

          </div>


          <div className="mt-7 grid grid-cols-2 border-y border-[#d9d8d2]">

            <button
              type="button"
              onClick={() =>
                switchMode("login")
              }
              className={`py-4 text-sm font-medium transition ${
                isLogin
                  ? "border-b-2 border-[#315d45] text-[#171815]"
                  : "text-[#85857d] hover:text-[#171815]"
              }`}
            >
              Login
            </button>


            <button
              type="button"
              onClick={() =>
                switchMode("signup")
              }
              className={`py-4 text-sm font-medium transition ${
                !isLogin
                  ? "border-b-2 border-[#315d45] text-[#171815]"
                  : "text-[#85857d] hover:text-[#171815]"
              }`}
            >
              Sign Up
            </button>

          </div>


          <form
            onSubmit={
              handleSubmit
            }
            className="mt-7 space-y-5"
          >

            {!isLogin && (
              <div>

                <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={15}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[#898a82]"
                  />

                  <input
                    type="text"
                    value={
                      fullName
                    }
                    onChange={(
                      event
                    ) =>
                      setFullName(
                        event.target.value
                      )
                    }
                    placeholder="Your full name"
                    className="w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 pr-0 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                  />

                </div>

              </div>
            )}


            <div>

              <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={15}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#898a82]"
                />

                <input
                  type="email"
                  value={
                    email
                  }
                  onChange={(
                    event
                  ) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@example.com"
                  className="w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 pr-0 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                />

              </div>

            </div>


            {!isLogin && (
              <div>

                <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                  Phone number
                </label>

                <div className="relative">

                  <Phone
                    size={15}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-[#898a82]"
                  />

                  <input
                    type="tel"
                    value={
                      phone
                    }
                    onChange={(
                      event
                    ) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="Phone number"
                    className="w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 pr-0 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                  />

                </div>

              </div>
            )}


            {!isLogin && (
              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    State
                  </label>

                  <input
                    type="text"
                    value={
                      state
                    }
                    onChange={(
                      event
                    ) =>
                      setState(
                        event.target.value
                      )
                    }
                    placeholder="State"
                    className="mt-2 w-full border-b border-[#bbb9b0] bg-transparent py-3 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                  />

                </div>


                <div>

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    District
                  </label>

                  <div className="relative">

                    <MapPin
                      size={15}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-[#898a82]"
                    />

                    <input
                      type="text"
                      value={
                        district
                      }
                      onChange={(
                        event
                      ) =>
                        setDistrict(
                          event.target.value
                        )
                      }
                      placeholder="District"
                      className="w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                    />

                  </div>

                </div>

              </div>
            )}


            {!isLogin && (
              <div>

                <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                  Pincode
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={
                    pincode
                  }
                  onChange={(
                    event
                  ) =>
                    setPincode(
                      event.target.value
                    )
                  }
                  placeholder="Pincode"
                  className="w-full border-b border-[#bbb9b0] bg-transparent py-3 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                />

              </div>
            )}


            <div>

              <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={15}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-[#898a82]"
                />

                <input
                  type="password"
                  value={
                    password
                  }
                  onChange={(
                    event
                  ) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="At least 6 characters"
                  className="w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                />

              </div>

            </div>


            {error && (
              <div className="border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-3">

                <p className="text-sm leading-6 text-[#71352f]">
                  {error}
                </p>

              </div>
            )}


            {success && (
              <div className="border-l-2 border-[#315d45] bg-[#edf3ee] px-4 py-3">

                <p className="text-sm leading-6 text-[#315d45]">
                  {success}
                </p>

              </div>
            )}


            <button
              type="submit"
              disabled={
                loading
              }
              className="group flex w-full items-center justify-center gap-3 bg-[#315d45] px-5 py-3.5 text-sm font-medium text-white hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
            >

              {loading
                ? "Please wait..."
                : isLogin
                  ? "Login"
                  : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={16}
                  className="transition group-hover:translate-x-1"
                />
              )}

            </button>

          </form>


          <p className="mt-6 text-xs leading-5 text-[#8a8981]">
            LegalSetu helps users discover and access legal resources. It does not provide legal advice.
          </p>

        </section>

      </main>

    </div>
  )
}

export default Auth