import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  Upload,
  User,
  X,
  AlertCircle,
} from "lucide-react"

import {
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import Header from "../components/Header"
import Footer from "../components/Footer"

import {
  supabase,
} from "../lib/supabase"


function ApplyAid() {
  const navigate =
    useNavigate()

  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      district: "",
      category: "",
      description: "",
    })

  const [file, setFile] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")

  const [
    applicationNumber,
    setApplicationNumber,
  ] = useState("")


  const categories = [
    "Family / Matrimonial",
    "Property / Housing",
    "Employment / Labour",
    "Consumer",
    "Criminal",
    "Civil",
    "Government / Documentation",
    "Other",
  ]


  const districts = [
    "Thiruvananthapuram",
    "Kollam",
    "Pathanamthitta",
    "Alappuzha",
    "Kottayam",
    "Idukki",
    "Ernakulam",
    "Thrissur",
    "Palakkad",
    "Malappuram",
    "Kozhikode",
    "Wayanad",
    "Kannur",
    "Kasaragod",
  ]


  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    )
  }


  function handleFileChange(
    event
  ) {
    const selectedFile =
      event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ]

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {
      setError(
        "Only PDF, JPG and PNG files are allowed."
      )
      return
    }

    const maxSize =
      5 * 1024 * 1024

    if (
      selectedFile.size >
      maxSize
    ) {
      setError(
        "File size must be less than 5 MB."
      )
      return
    }

    setError("")
    setFile(selectedFile)
  }


  function removeFile() {
    setFile(null)
  }


  function validateForm() {
    if (!form.name.trim()) {
      return "Please enter your full name."
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number."
    }

    if (!form.district) {
      return "Please select your district."
    }

    if (!form.category) {
      return "Please select the category of your problem."
    }

    if (!form.description.trim()) {
      return "Please describe your legal problem."
    }

    if (
      form.description
        .trim()
        .length < 20
    ) {
      return "Please provide a little more detail about your problem."
    }

    return ""
  }


  async function handleSubmit(
    event
  ) {
    event.preventDefault()

    setError("")

    const validationError =
      validateForm()

    if (validationError) {
      setError(
        validationError
      )
      return
    }

    try {
      setLoading(true)

      const {
        data: {
          user,
        },
        error: userError,
      } =
        await supabase.auth.getUser()

      if (userError) {
        throw userError
      }

      if (!user) {
        navigate("/auth")
        return
      }

      const generatedApplicationNumber =
        `LS-${new Date().getFullYear()}-${crypto
          .randomUUID()
          .slice(0, 8)
          .toUpperCase()}`

      const {
        data: application,
        error: applicationError,
      } =
        await supabase
          .from("applications")
          .insert({
            application_number:
              generatedApplicationNumber,
            user_id: user.id,
            full_name:
              form.name.trim(),
            phone:
              form.phone.trim(),
            district:
              form.district,
            category:
              form.category,
            problem_description:
              form.description.trim(),
            current_status:
              "submitted",
          })
          .select()
          .single()

      if (applicationError) {
        throw applicationError
      }

      const {
        error: statusError,
      } =
        await supabase
          .from(
            "application_status_history"
          )
          .insert({
            application_id:
              application.id,
            status: "submitted",
            note:
              "Application submitted through LegalSetu.",
            changed_by:
              user.id,
          })

      if (statusError) {
        console.error(
          "Status history error:",
          statusError
        )
      }

      if (file) {
        const fileExtension =
          file.name
            .split(".")
            .pop()
            ?.toLowerCase() ||
          "file"

        const safeFileName =
          `${crypto.randomUUID()}.${fileExtension}`

        const storagePath =
          `${user.id}/${application.id}/${safeFileName}`

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from(
              "application-documents"
            )
            .upload(
              storagePath,
              file,
              {
                cacheControl:
                  "3600",
                upsert:
                  false,
                contentType:
                  file.type,
              }
            )

        if (uploadError) {
          throw new Error(
            `Application was created, but the document upload failed: ${uploadError.message}`
          )
        }

        const {
          error: documentError,
        } =
          await supabase
            .from(
              "application_documents"
            )
            .insert({
              application_id:
                application.id,
              file_name:
                file.name,
              storage_path:
                storagePath,
              file_type:
                file.type,
              file_size:
                file.size,
            })

        if (documentError) {
          throw new Error(
            `Document uploaded, but its database record could not be saved: ${documentError.message}`
          )
        }
      }

      setApplicationNumber(
        generatedApplicationNumber
      )
    } catch (err) {
      console.error(
        "Application submission error:",
        err
      )

      setError(
        err?.message ||
          "Unable to submit your application. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }


  if (applicationNumber) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] text-[#171815]">

        <Header />

        <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-4xl items-center px-6 py-12">

          <section className="w-full border-y border-[#d5d4cd] py-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-[#315d45] text-white">

              <CheckCircle2
                size={24}
              />

            </div>


            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
              Application submitted
            </p>


            <h1 className="mt-3 font-serif text-5xl leading-none tracking-[-0.03em]">
              Your request has been recorded.
            </h1>


            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#6d6e66]">
              Keep the application number below. You will need it when checking the status of this request.
            </p>


            <div className="mx-auto mt-8 max-w-sm border-y border-[#d9d8d2] py-6">

              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#898981]">
                Application number
              </p>

              <p className="mt-3 break-all font-mono text-xl tracking-[0.08em]">
                {applicationNumber}
              </p>

            </div>


            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <button
                onClick={() =>
                  navigate(
                    "/track",
                    {
                      state: {
                        applicationNumber,
                      },
                    }
                  )
                }
                className="inline-flex items-center justify-center gap-2 bg-[#315d45] px-5 py-3 text-sm font-medium text-white hover:bg-[#254b37]"
              >

                <ClipboardCheck
                  size={16}
                />

                Track Application

              </button>


              <button
                onClick={() =>
                  navigate("/")
                }
                className="border border-[#c8c7bf] px-5 py-3 text-sm font-medium hover:border-[#171815] hover:bg-white"
              >
                Back to Home
              </button>

            </div>

          </section>

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
          onClick={() =>
            navigate("/")
          }
          className="group inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72736b] hover:text-[#171815]"
        >

          <ArrowRight
            size={15}
            className="rotate-180 transition group-hover:-translate-x-1"
          />

          Back

        </button>


        <section className="mt-8 border-b border-[#d5d4cd] pb-10">

          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#77786f]">
            Legal aid application
          </p>


          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl">
            Tell us what you need help with.
          </h1>


          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#686a62]">
            Provide the basic details below and describe your problem in your own words. The application can then be reviewed through the LegalSetu workflow.
          </p>

        </section>


        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px]">

          <form
            onSubmit={
              handleSubmit
            }
            className="pt-8"
          >

            {/* Personal */}

            <section>

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  01 / Personal information
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Basic details
                </h2>

              </div>


              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                <div>

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your full name"
                    className="mt-2 w-full border-b border-[#bbb9b0] bg-transparent px-0 py-3 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                  />

                </div>


                <div>

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    Phone number
                  </label>

                  <div className="relative">

                    <Phone
                      size={15}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#888880]"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your phone number"
                      className="mt-2 w-full border-b border-[#bbb9b0] bg-transparent py-3 pl-7 pr-0 text-sm outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                    />

                  </div>

                </div>


                <div>

                  <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                    District
                  </label>

                  <div className="relative">

                    <MapPin
                      size={15}
                      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#888880]"
                    />

                    <select
                      name="district"
                      value={
                        form.district
                      }
                      onChange={
                        handleChange
                      }
                      className="mt-2 w-full appearance-none border-b border-[#bbb9b0] bg-transparent py-3 pl-7 pr-0 text-sm outline-none focus:border-[#315d45]"
                    >

                      <option value="">
                        Select your district
                      </option>

                      {districts.map(
                        (
                          district
                        ) => (
                          <option
                            key={
                              district
                            }
                            value={
                              district
                            }
                          >
                            {
                              district
                            }
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>

            </section>


            {/* Problem */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  02 / Your legal problem
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  What happened?
                </h2>

              </div>


              <div className="mt-6">

                <label className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                  Category
                </label>


                <select
                  name="category"
                  value={
                    form.category
                  }
                  onChange={
                    handleChange
                  }
                  className="mt-2 w-full border border-[#c8c7bf] bg-[#fbfaf7] px-4 py-3 text-sm outline-none focus:border-[#315d45]"
                >

                  <option value="">
                    Select a category
                  </option>

                  {categories.map(
                    (
                      category
                    ) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {
                          category
                        }
                      </option>
                    )
                  )}

                </select>


                <label className="mt-7 block font-mono text-[9px] uppercase tracking-[0.15em] text-[#77786f]">
                  Describe the problem
                </label>


                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={8}
                  placeholder="Explain what happened in your own words..."
                  className="mt-2 w-full resize-none border border-[#c8c7bf] bg-[#fbfaf7] p-4 text-sm leading-7 outline-none placeholder:text-[#9b9a92] focus:border-[#315d45]"
                />


                <p className="mt-2 text-xs leading-5 text-[#8a8981]">
                  Provide enough detail for the request to be understood clearly.
                </p>

              </div>

            </section>


            {/* Document */}

            <section className="mt-10">

              <div className="border-b border-[#d5d4cd] pb-3">

                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                  03 / Supporting document
                </p>

                <h2 className="mt-1 font-serif text-3xl">
                  Add a document when useful.
                </h2>

              </div>


              <label className="mt-6 block cursor-pointer border border-dashed border-[#bbb9b0] bg-[#fbfaf7] p-7 transition hover:border-[#315d45] hover:bg-white">

                <div className="flex flex-col items-center text-center">

                  <div className="flex h-10 w-10 items-center justify-center border border-[#cecdc6]">

                    <Upload
                      size={17}
                      className="text-[#315d45]"
                    />

                  </div>


                  <p className="mt-4 font-serif text-xl">
                    Choose a document
                  </p>


                  <p className="mt-2 text-xs text-[#888880]">
                    PDF, JPG or PNG · Maximum 5 MB
                  </p>

                </div>


                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={
                    handleFileChange
                  }
                  className="hidden"
                />

              </label>


              {file && (
                <div className="mt-4 flex items-center justify-between gap-4 border-y border-[#d9d8d2] py-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <FileText
                      size={16}
                      className="shrink-0 text-[#315d45]"
                    />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium">
                        {
                          file.name
                        }
                      </p>

                      <p className="mt-1 text-xs text-[#85857d]">
                        {(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(
                          2
                        )}{" "}
                        MB
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={
                      removeFile
                    }
                    className="shrink-0 border border-[#c8c7bf] p-2 text-[#77786f] hover:border-[#171815] hover:bg-white"
                  >

                    <X
                      size={15}
                    />

                  </button>

                </div>
              )}

            </section>


            {/* Error */}

            {error && (
              <div className="mt-7 flex items-start gap-3 border-l-2 border-[#9b3d32] bg-[#f5ebe8] px-4 py-4">

                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#8b3f35]"
                />

                <p className="text-sm leading-6 text-[#71352f]">
                  {error}
                </p>

              </div>
            )}


            {/* Confirmation */}

            <section className="mt-10 border-y border-[#d9d8d2] py-6">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={17}
                  className="mt-0.5 shrink-0 text-[#315d45]"
                />

                <p className="text-xs leading-5 text-[#77786f]">
                  By submitting this application, you confirm that the information provided is accurate to the best of your knowledge. LegalSetu does not guarantee eligibility for legal-aid services.
                </p>

              </div>


              <button
                type="submit"
                disabled={
                  loading
                }
                className="mt-6 inline-flex w-full items-center justify-center gap-3 bg-[#315d45] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#254b37] disabled:cursor-not-allowed disabled:opacity-40"
              >

                {loading
                  ? "Submitting..."
                  : "Submit Application"}

                {!loading && (
                  <ArrowRight
                    size={16}
                  />
                )}

              </button>

            </section>

          </form>


          {/* Sidebar */}

          <aside className="pt-8 lg:sticky lg:top-5 lg:self-start">

            <div className="border-t-2 border-[#315d45] pt-5">

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#77786f]">
                Before you submit
              </p>


              <h2 className="mt-2 font-serif text-3xl leading-tight">
                Keep the useful records nearby.
              </h2>


              <div className="mt-7 divide-y divide-[#d9d8d2] border-y border-[#d9d8d2]">

                <div className="py-5">

                  <User
                    size={18}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-serif text-xl">
                    Your details
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#77786f]">
                    Keep your name, phone number, and district information accurate.
                  </p>

                </div>


                <div className="py-5">

                  <FileText
                    size={18}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-serif text-xl">
                    Supporting records
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#77786f]">
                    Agreements, receipts, messages, notices, and other relevant records can help document your situation.
                  </p>

                </div>


                <div className="py-5">

                  <Scale
                    size={18}
                    className="text-[#315d45]"
                  />

                  <p className="mt-4 font-serif text-xl">
                    Clear description
                  </p>

                  <p className="mt-2 text-xs leading-5 text-[#77786f]">
                    Describe what happened in ordinary language. Legal terminology is not required.
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

export default ApplyAid