import { useState } from "react"
import type { IReview } from "./types/Review"
import ResumeUpload from "./components/Resume"
import ResumeReview from "./components/Review"

function App() {
  const [review, setReview] = useState<null | IReview>(null)

  return (
    <main className="min-h-screen bg-zinc-900 p-8 space-y-6 flex flex-col items-center justify-center">
      {review ? (
        <>
          <ResumeReview review={review} />
          <button onClick={() => setReview(null)} className="mt-4 bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition-colors text-white py-2 px-4 rounded-md">
            Get review for another resume
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-white">Trash My CV</h1>
          <ResumeUpload onReviewReceived={setReview} />
        </>
      )}
    </main>
  )
}

export default App