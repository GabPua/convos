function Content() {
  return (
    <form>
      <div class="field">
        <input type="email" class="input w-full" placeholder="Email" />
        <p class="help-text">send help</p>
      </div>
      <input type="submit" class="btn primary w-full mt-4" />
    </form>
  )
}

export default function ResetForm() {
  

  return (
    <div class="min-h-screen relative">
      <div class="h-[60vh] bg-primary relative">
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[10%] rotate-45 bottom-0" />
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[4%] rotate-[120deg] top-[10%] left-[30%]" />
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[7%] -rotate-45 top-[10%] right-[30%]" />
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[6%] rotate-[-70deg] bottom-[10%] left-[38%]" />
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[4%] rotate-[20deg] top-[15%] right-[3%]" />
        <img src="/assets/green-question-mark.png" alt="bg element" class="bg-question-mark w-[7%] rotate-6 bottom-[-15%] right-[5%]" />
      </div>
      <div class="h-[40vh] relative bg-secondary z-10"></div>

      <div class="absolute w-1/5 min-w-max left-1/2 top-1/2 shadow-2xl bg-secondary -translate-x-1/2 -translate-y-1/2 rounded-xl p-8 z-50">
        <figure class="mb-10">
          <img class="m-auto w-10 mb-2" src="/assets/white-question-mark.png" alt="question mark" />
          <figcaption class="text-2xl font-keep-calm text-center">Reset your<br />password</figcaption>
        </figure>
        <Content />
      </div>
    </div>
  )
}