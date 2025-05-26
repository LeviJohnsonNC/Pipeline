"use server"

export async function createNewLead(formData: FormData) {
  // This would connect to your database in a real application
  const name = formData.get("name")
  const service = formData.get("service")
  const price = formData.get("price")

  // Simulate a delay to represent saving to a database
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true }
}
