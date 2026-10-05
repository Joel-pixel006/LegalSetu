import { supabase } from "./supabase"

export async function signUp(
  email,
  password,
  profile
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: profile.fullName,
          phone: profile.phone,
          state: profile.state,
          district: profile.district,
          pincode: profile.pincode,
        },
      },
    })

  if (error) {
    throw error
  }

  return data
}

export async function signIn(
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    throw error
  }

  return data
}

export async function signOut() {
  const { error } =
    await supabase.auth.signOut()

  if (error) {
    throw error
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}