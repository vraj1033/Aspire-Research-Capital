import { AnimatePresence, motion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import { useState } from 'react'
import { MagneticButton } from './ui/MagneticButton'

const ease = [0.16, 1, 0.3, 1] as const

type Errors = Partial<Record<'name' | 'from' | 'message', string>>

type ContactFormProps = {
  topics: string[]
  topic: string | null
  onTopicChange: (topic: string | null) => void
  /** Destination address for the prefilled email. */
  email: string
}

const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

/**
 * Contact form.
 *
 * DEMO BEHAVIOUR — there is no backend. A valid submission opens the reader's
 * own email app with the message prefilled (subject, body, sender), which
 * works anywhere without a server. Before launch, replace `deliver` with a
 * POST to the client's form endpoint and keep the validation as it is.
 */
export function ContactForm({ topics, topic, onTopicChange, email }: ContactFormProps) {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const mailto = () => {
    const subject = `${topic ?? 'Enquiry'} — ${name.trim()}`
    const body = `${message.trim()}\n\n— ${name.trim()} (${from.trim()})`
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const validate = (): Errors => {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = 'Please tell us your name.'
    if (!looksLikeEmail(from)) next.from = 'That doesn’t look like an email address.'
    if (message.trim().length < 12) next.message = 'A sentence or two helps us reply properly.'
    return next
  }

  const deliver = (event: React.FormEvent) => {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    // TODO: replace with a POST to the client's form endpoint.
    window.location.href = mailto()
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setName('')
    setFrom('')
    setMessage('')
    setErrors({})
  }

  const field =
    'w-full border-b bg-transparent py-3 text-[1rem] text-bone placeholder:text-bone/30 transition-colors duration-500 focus:outline-none'
  const fieldEdge = (error?: string) =>
    error ? 'border-[#d98b8b]' : 'border-bone/20 focus:border-emerald-soft'
  const label = 'eyebrow block text-bone/45'
  const errorText = 'mt-2 text-[0.78rem] text-[#d98b8b]'

  return (
    <div id="contact-form" className="scroll-mt-28">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            className="max-w-[56ch]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-soft/50 text-emerald-soft">
              <Check className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-[clamp(1.4rem,2.4vw,1.9rem)] font-bold tracking-[-0.03em] text-bone">
              Your message is ready to send.
            </h3>
            <p className="mt-4 text-[0.98rem] leading-[1.8] text-bone/55">
              Your email app should have opened with the message prefilled. If it didn&rsquo;t,
              use the button below.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticButton variant="light" href={mailto()} withArrow>
                Open in email app
              </MagneticButton>
              <button
                type="button"
                onClick={reset}
                className="link-underline min-h-[44px] text-[0.88rem] font-semibold text-bone/70 transition-colors hover:text-bone"
              >
                Write another
              </button>
            </div>
            <p className="mt-6 text-[0.72rem] leading-relaxed text-bone/35">
              Demo — the form hands off to your email app instead of a server. Wire a form
              endpoint before launch.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={deliver}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            className="grid gap-x-12 gap-y-9 lg:grid-cols-12"
          >
            {/* Topic */}
            <fieldset className="lg:col-span-12">
              <legend className={label}>What is this about?</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((option) => {
                  const selected = topic === option
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onTopicChange(selected ? null : option)}
                      className={`min-h-[44px] rounded-full border px-4 text-[0.82rem] font-semibold transition-colors duration-300 ${
                        selected
                          ? 'border-bone bg-bone text-ink-950'
                          : 'border-bone/15 text-bone/65 hover:border-bone/45 hover:text-bone'
                      }`}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="lg:col-span-6">
              <label htmlFor="contact-name" className={label}>
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                }}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                placeholder="Your name"
                className={`${field} ${fieldEdge(errors.name)}`}
              />
              {errors.name && (
                <p id="contact-name-error" role="alert" className={errorText}>
                  {errors.name}
                </p>
              )}
            </div>

            <div className="lg:col-span-6">
              <label htmlFor="contact-email" className={label}>
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value)
                  if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }))
                }}
                aria-invalid={errors.from ? true : undefined}
                aria-describedby={errors.from ? 'contact-email-error' : undefined}
                placeholder="you@company.com"
                className={`${field} ${fieldEdge(errors.from)}`}
              />
              {errors.from && (
                <p id="contact-email-error" role="alert" className={errorText}>
                  {errors.from}
                </p>
              )}
            </div>

            <div className="lg:col-span-12">
              <label htmlFor="contact-message" className={label}>
                Message
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value)
                  if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }))
                }}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                placeholder="A few lines on what you have in mind"
                className={`${field} resize-y ${fieldEdge(errors.message)}`}
              />
              {errors.message && (
                <p id="contact-message-error" role="alert" className={errorText}>
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5 lg:col-span-12">
              <MagneticButton variant="light" type="submit">
                <span className="flex items-center gap-2.5">
                  Send message
                  <Send className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </MagneticButton>
              <p className="text-[0.74rem] leading-relaxed text-bone/35">
                Opens your email app with the message prefilled.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
